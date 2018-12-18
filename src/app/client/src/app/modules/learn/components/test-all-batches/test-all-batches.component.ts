
import { Component, OnInit, OnDestroy,  VERSION, ViewChild, ChangeDetectorRef, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService } from '../../services';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';

import { ConfigService, ToasterService, ResourceService  } from '@sunbird/shared';
import { LearnerService, UserService, } from '@sunbird/core';
import { pluck, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls: ['./test-all-batches.component.css'],
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog implements OnInit {
  mentorDetail;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public config: ConfigService,
    public learnerService: LearnerService,
    public toasterService: ToasterService
  ) {
  }
  ngOnInit(): void {
    this.mentorDetail = this.data.mentorDetail;
 }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-create-batch-dialog',
  templateUrl: './create-batch-dialog.html',
  styleUrls: ['./test-all-batches.component.css'],
})

// tslint:disable-next-line:component-class-suffix
export class CreateBatchDialog implements OnInit{
  breakpoint: number;
  constructor(
    public dialogRef: MatDialogRef<CreateBatchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
     onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 550) ? 1 : 1;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 550) ? 1 : 1;
  }
}

@Component({
  selector: 'app-test-all-batches',
  templateUrl: './test-all-batches.component.html',
  styleUrls: ['./test-all-batches.component.css'],
})



export class TestAllBatchesComponent implements OnInit, OnDestroy {
  courseId = this.route.snapshot.paramMap.get('courseId');
  public ongoingSearch: any;
  public upcomingSearch: any;
  ongoingBatches = [];
  upcomingBatches = [];
  mentorContactDetail;
  userId;
  showUnenroll;
   animal: string;
  name: string;
  breakpoint: number;
  // ngVersion: string = VERSION.full;
  // // tslint:disable-next-line:no-inferrable-types
  // matVersion: string = '5.1.0';
  public unsubscribe = new Subject<void>();
  currentDate = new Date().toJSON().slice(0, 10);
  ngOnDestroy(): void {
  }

  constructor(
    public dialog: MatDialog,
    public courseBatchService: CourseBatchService,
    private route: ActivatedRoute,
    public config: ConfigService,
    public learnerService: LearnerService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public toasterService: ToasterService,
    public resourceService: ResourceService
  ) {
    this.userId = this.userService.userid;
  }
  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 550) ? 1 : 3;
    this.ongoingSearch = {
      filters: {
        status: '0',
        courseId: this.courseId
      }
    };
    this.upcomingSearch = {
      filters: {
        status: '1',
        courseId: this.courseId
      }
    };
    this.courseBatchService.getAllBatchDetails(this.ongoingSearch)
      .subscribe((data: any) => {
       const batchdetails = data.result.response.content;
        // console.log('ongoing batches', this.ongoingBatches);
        for (const batch of batchdetails) {
          if (batch.endDate > this.currentDate || batch.endDate === null || batch.endDate === undefined) {
            console.log('date', batch.endDate, 'batch', batch);
               this.ongoingBatches.push(batch);
              console.log('batch', batch);
         } else if (this.currentDate < batch.startDate) {
          this.upcomingBatches.push(batch);
      }
    }
      });
    this.courseBatchService.getAllBatchDetails(this.upcomingSearch)
      .subscribe((resp: any) => {
       const batchdetails = resp.result.response.content;

        for (const batch of batchdetails) {
         if (batch.endDate < this.currentDate || batch.endDate === null || batch.endDate === undefined) {
           console.log('date', batch.endDate, 'batch', batch);
              this.ongoingBatches.push(batch);
              console.log('batch', batch);
        } else if (this.currentDate < batch.startDate)  {
            this.upcomingBatches.push(batch);
        }
      }
        console.log('upcoming batches', this.upcomingBatches);
      });
  }
  openContactDetailsDialog(batch): void {
    console.log('BATCH Details', batch);
    this.getUserDetails(batch.createdBy)
      .pipe(tap((data) => {
        this.mentorContactDetail = data;
      }))
      .subscribe((data) => {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '50vw',
          data: {
            mentorDetail: this.mentorContactDetail
          }
        });
      });
  }
  getUserDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    return response;
  }
  openEnrollDetailsDialog(batch) {
    this.courseBatchService.setEnrollToBatchDetails(batch);
    this.router.navigate(['enroll/batch', batch.identifier], { relativeTo: this.activatedRoute });
    this.enrollToCourse(batch);
  }
  enrollToCourse(batch) {
    const request = {
      request: {
        courseId: batch.courseId,
        batchId: batch.id,
        userId: this.userId,
      }
    };
    this.courseBatchService.enrollToCourse(request).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        console.log('data', data);
        if (data.result.response === 'SUCCESS') {
          this.showUnenroll = true;
        }
        this.toasterService.success(this.resourceService.messages.smsg.m0036);
      }, (err) => {

      });
  }

  createNewBatch(): void {
    const dialogRef = this.dialog.open(CreateBatchDialog, {
      width: '60vw',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 550) ? 1 : 3 ;
  }
}


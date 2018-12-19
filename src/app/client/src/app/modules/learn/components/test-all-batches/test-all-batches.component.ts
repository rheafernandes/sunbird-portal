import { Component, OnInit, OnDestroy,  VERSION, ViewChild, ChangeDetectorRef, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService } from '../../services';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';

import { ConfigService, ToasterService, ResourceService,  ServerResponse  } from '@sunbird/shared';
import { LearnerService, UserService, SearchParam } from '@sunbird/core';
import { pluck, takeUntil, tap } from 'rxjs/operators';
import { Subject,  of as observableOf, Observable } from 'rxjs';
import {FormControl} from '@angular/forms';
import * as _ from 'lodash';
export interface DialogData {
  shouldSizeUpdate: boolean;
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
  shouldSizeUpdate: boolean;
  breakpoint: number;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public config: ConfigService,
    public learnerService: LearnerService,
    public toasterService: ToasterService
  ) {
    this.shouldSizeUpdate = data.shouldSizeUpdate;
  }
  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 550) ? 1 : 1;
    if (this.shouldSizeUpdate) { this.updateSize(); }
    this.mentorDetail = this.data.mentorDetail;
 }
  onNoClick(): void {
    this.dialogRef.close();
  }
  updateSize() {
    this.dialogRef.updateSize('300px', '200px');
}
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 550) ? 1 : 1;
  }
}

@Component({
  selector: 'app-create-batch-dialog',
  templateUrl: './create-batch-dialog.html',
  styleUrls: ['./test-all-batches.component.css'],
})

// tslint:disable-next-line:component-class-suffix
export class CreateBatchDialog implements OnInit {
  courseId = this.route.snapshot.paramMap.get('courseId');
  shouldSizeUpdate: boolean;
  breakpoint: number;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  private courseBatchService: CourseBatchService;
  constructor(
    private route: ActivatedRoute,
    courseBatchService: CourseBatchService,
    public userService: UserService,
    public configService: ConfigService,
    public dialogRef: MatDialogRef<CreateBatchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.shouldSizeUpdate = data.shouldSizeUpdate;
    }
     onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 550) ? 1 : 1;
    if (this.shouldSizeUpdate) { this.updateSize(); }
    const orddata = {
      filters: {
      courseId: this.courseId
  }
};
this.getmentorlist();
  }
  getmentorlist(requestParam: SearchParam = {}): any {

  }
  updateSize() {
    this.dialogRef.updateSize('600px', '300px');
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
  public unsubscribe = new Subject<void>();
  currentDate = new Date().toJSON().slice(0, 10);
  animal: string;
  name: string;
  breakpoint: number;

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
        status: '1',
        courseId: this.courseId
      }
    };
    this.upcomingSearch = {
      filters: {
        status: '0',
        courseId: this.courseId
      }
    };
    this.courseBatchService.getAllBatchDetails(this.ongoingSearch)
      .subscribe((data: any) => {
        const batchdetails = data.result.response.content;
        for (const batch of batchdetails) {
          if (batch.endDate > this.currentDate || batch.endDate === null || batch.endDate === undefined) {
                console.log(batch);
               this.ongoingBatches.push(batch);
               console.log('current date', this.currentDate, 'enddate', batch.endDate);
         }

    }
      });
    this.courseBatchService.getAllBatchDetails(this.upcomingSearch)
      .subscribe((resp: any) => {
        const batchdetails = resp.result.response.content;
                for (const batch of batchdetails) {
                if (this.currentDate < batch.startDate)  {
                  console.log('current date', this.currentDate, 'enddate', batch.startDate);
                    this.upcomingBatches.push(batch);
                }
              }
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
          // width: '50vw',
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

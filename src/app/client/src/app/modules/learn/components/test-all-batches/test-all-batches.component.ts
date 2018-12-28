import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService } from '../../services';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import {
  ConfigService,
  ToasterService,
  ResourceService,

} from '@sunbird/shared';
import {
  LearnerService,
  UserService,
  PermissionService
} from '@sunbird/core';
import { pluck, takeUntil, tap } from 'rxjs/operators';
import { Subject, of as observableOf } from 'rxjs';
import * as _ from 'lodash';
import { CreateBatchDialogComponent } from './create-batch-dialog/create-batch-dialog.component';
import { UpdateBatchDialogComponent } from './update-batch-dialog/update-batch-dialog.component';

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls: ['./test-all-batches.component.css']
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
    this.breakpoint = window.innerWidth <= 550 ? 1 : 1;
    if (this.shouldSizeUpdate) {
      this.updateSize();
    }
    this.mentorDetail = this.data.mentorDetail;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  updateSize() {
    this.dialogRef.updateSize('300px', '200px');
  }
  onResize(event) {
    this.breakpoint = event.target.innerWidth <= 550 ? 1 : 1;
  }
}

@Component({
  selector: 'app-test-all-batches',
  templateUrl: './test-all-batches.component.html',
  styleUrls: ['./test-all-batches.component.css']
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
  mentorCheck;
  public unsubscribe = new Subject<void>();
  currentDate = new Date().toJSON().slice(0, 10);
  // startDate = new Date(Date.parse(startDate)).toISOString().slice(0, 10);
  allMentors = [];
  allMembers = [];
  breakpoint: number;
  public courseMentor;
  pageLimit: number;
  userCreatedbatchList = [];
  courseBatchList = [];
  userCourseBatches = [];
  IsUserCreatedBatch: boolean;
  ngOnDestroy(): void {}

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
    public resourceService: ResourceService,
    public permissionService: PermissionService
  ) {
    this.userId = this.userService.userid;
  }
  ngOnInit(): void {
    this.breakpoint =
      window.innerWidth <= 550
        ? 1
        : window.innerWidth > 550 && window.innerWidth < 880
        ? 2
        : 3;
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
    this.courseBatchService
      .getAllBatchDetails(this.ongoingSearch)
      .subscribe((data: any) => {
        const batchdetails = data.result.response.content;
        for (const batch of batchdetails) {
          if (
            batch.endDate > this.currentDate ||
            batch.endDate === null ||
            batch.endDate === undefined
          ) {
            this.ongoingBatches.push(batch);
          }
        }
      });
    this.courseBatchService
      .getAllBatchDetails(this.upcomingSearch)
      .subscribe((resp: any) => {
        const batchdetails = resp.result.response.content;

        for (const batch of batchdetails) {

          if (this.currentDate < batch.startDate) {
            this.upcomingBatches.push(batch);
          }
        }

      });
    this.checkRoles();
    this.getMentorslist();
    this.getMemberslist();
  }
  openContactDetailsDialog(batch): void {
    this.getUserDetails(batch.createdBy)
      .pipe(
        tap(data => {
          this.mentorContactDetail = data;
        })
      )
      .subscribe(data => {
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
    const response = this.learnerService
      .get(option)
      .pipe(pluck('result', 'response'));
    return response;
  }
  openEnrollDetailsDialog(batch) {
    this.courseBatchService.setEnrollToBatchDetails(batch);
    this.router.navigate(['enroll/batch', batch.identifier], {
      relativeTo: this.activatedRoute
    });
    this.enrollToCourse(batch);
  }
  enrollToCourse(batch) {
    console.log('batch ', batch);
    const request = {
      request: {
        courseId: batch.courseId,
        batchId: batch.id,
        userId: this.userId
      }
    };
    this.courseBatchService
      .enrollToCourse(request)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          if (data.result.response === 'SUCCESS') {
            this.showUnenroll = true;
          }
          this.toasterService.success(this.resourceService.messages.smsg.m0036);
        },
        err => {
          this.toasterService.error('Unsuccesful, try again later');
        }
      );
  }
  unEnroll(batch) {
    this.courseBatchService.setEnrollToBatchDetails(batch);
    this.router.navigate(['unenroll/batch', batch.identifier], {
      relativeTo: this.activatedRoute
    });
    this.unEnrollToCourse(batch);
  }
  unEnrollToCourse(batch) {
    const request = {
      request: {
        courseId: batch.courseId,
        batchId: batch.id,
        userId: this.userId
      }
    };
    this.courseBatchService
      .unEnrollToCourse(request)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          if (data.result.response === 'SUCCESS') {
            this.showUnenroll = false;
          }
          this.toasterService.success(
            'You have successfully un-enrolled from this batch'
          );
        },
        err => {
          this.toasterService.error('Unsuccesful, try again later');
        }
      );
  }

  createNewBatch(): void {
    const usersOfCourse = this.allMembers.concat(this.allMentors);
    const dialogRef = this.dialog.open(CreateBatchDialogComponent, {
      data: {
        title: 'create',
        mentorDetail: this.allMentors,
        memberDetail: usersOfCourse,
        courseId: this.courseId
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  updateBatch(batch): void {
    const notCreator = this.checkMentorIsPresent(batch);
    const usersOfCourse = this.allMembers.concat(this.allMentors);
    const dialogRef = this.dialog.open(UpdateBatchDialogComponent, {
      data: {
        title: 'update',
        mentorDetail: this.allMentors,
        memberDetail: usersOfCourse,
        batchDetail: batch,
        courseId: this.courseId,
        creator: notCreator
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  onResize(event) {
    this.breakpoint =
      event.target.innerWidth <= 550
        ? 1
        : event.target.innerWidth > 550 && window.innerWidth < 880
        ? 2
        : 3;
  }
  checkRoles() {
    if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
      this.courseMentor = true;
    } else {
      this.courseMentor = false;
    }
  }
  getMentorslist() {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          query: 'COURSE_MENTOR',
          filters: {
            rootOrgId: this.userService.rootOrgId
          }
        }
      }
    };
    this.learnerService.post(option).subscribe(
      data => {
        const mentorsDetails = data.result.response.content;
        for (const mentorDetail of mentorsDetails) {
            const obj = {};
            if ((mentorDetail.firstName !== null && mentorDetail.firstName !== undefined)
            && (mentorDetail.lastName === undefined || mentorDetail.lastName === null)) {
            obj['name'] = mentorDetail.firstName;
            obj['id'] = mentorDetail.identifier;
            this.allMentors.push(obj);
            this.allMentors = _.compact(this.allMentors);
            } else if ((mentorDetail.firstName === null && mentorDetail.firstName === undefined)
            && (mentorDetail.lastName !== undefined || mentorDetail.lastName !== null)) {
              obj['name'] = mentorDetail.lastName;
              obj['id'] = mentorDetail.identifier;
              this.allMentors.push(obj);
              this.allMentors = _.compact(this.allMentors);
            } else {
              obj['name'] = mentorDetail.firstName + ' ' + mentorDetail.lastName;
              obj['id'] = mentorDetail.identifier;
              this.allMentors.push(obj);
              this.allMentors = _.compact(this.allMentors);
            }
          }
      },
      err => {
        this.toasterService.error(err.error.params.errmsg);
      }
    );
  }

  getMemberslist() {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          query: '',
          filters: {
            rootOrgId: this.userService.rootOrgId
          }
        }
      }
    };
    this.learnerService.post(option).subscribe(
      data => {
        const membersDetails = data.result.response.content;
        for (const memberDetail of membersDetails) {
          const obj = {};
          if ((memberDetail.firstName !== null && memberDetail.firstName !== undefined)
          && (memberDetail.lastName === undefined || memberDetail.lastName === null)) {
          obj['name'] = memberDetail.firstName;
          obj['id'] = memberDetail.identifier;
          this.allMentors.push(obj);
          this.allMentors = _.compact(this.allMentors);
          } else if ((memberDetail.firstName === null && memberDetail.firstName === undefined)
          && (memberDetail.lastName !== undefined || memberDetail.lastName !== null)) {
            obj['name'] = memberDetail.lastName;
            obj['id'] = memberDetail.identifier;
            this.allMentors.push(obj);
            this.allMentors = _.compact(this.allMentors);
          } else {
            obj['name'] = memberDetail.firstName + ' ' + memberDetail.lastName;
            obj['id'] = memberDetail.identifier;
            this.allMentors.push(obj);
            this.allMentors = _.compact(this.allMentors);
          }
            }

      },
      err => {
        this.toasterService.error(err.error.params.errmsg);
      }
    );
  }

  checkMentorIsPresent(batch): boolean {
    const userId = this.userService.userid;
    if (batch.createdBy === userId) {
      return (this.mentorCheck = true);
    }
  }

}

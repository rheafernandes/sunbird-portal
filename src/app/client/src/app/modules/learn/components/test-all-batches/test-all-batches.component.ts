import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService, UpdateBatchService } from '../../services';
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
  PermissionService,
  CoursesService
} from '@sunbird/core';
import { pluck, takeUntil, tap } from 'rxjs/operators';
import { Subject, of as observableOf, Observable } from 'rxjs';
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
  enrolledCourses;
  userEnrolledToCourse;
  mentorIsPresent;
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
    public permissionService: PermissionService,
    public coursesService: CoursesService,
    public updateBatchService: UpdateBatchService,
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
      this.fetchEnrolledCourses();
    this.checkRoles();
    this.getMentorslist();
    this.getMemberslist();
  }
  fetchEnrolledCourses() {
      this.coursesService.getEnrolledCourses().pipe(
        takeUntil(this.unsubscribe))
        .subscribe((data: any) => {
          this.enrolledCourses = data.result.courses;
          for (const enrolledcourse of this.enrolledCourses) {
            if (this.courseId === enrolledcourse.courseId) {
              this.userEnrolledToCourse = true;
            }

          }
        }, (err) => {
          this.router.navigate(['/learn']);
        });
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
          this.toasterService.success(this.resourceService.messages.smsg.m0036);
          this.fetchEnrolledCourseData(batch);
        },
        err => {
          this.toasterService.error('Unsuccesful, try again later');
        }
      );
  }
  fetchEnrolledCourseData(batch) {
    setTimeout(() => {
      this.coursesService.getEnrolledCourses().pipe(
        takeUntil(this.unsubscribe))
        .subscribe(() => {
          this.toasterService.success(this.resourceService.messages.smsg.m0036);
          this.router.navigate(['/learn/course', batch.courseId, 'batch', batch.identifier]);
          window.location.reload();
        }, (err) => {
          this.router.navigate(['/learn']);
        });
    }, 2000);
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
            'Successfully un-enrolled from this batch'
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

  }
  updateBatch(batch): void {
    const notCreator = this.checkMentorIsPresent(batch);
    const usersOfCourse = this.allMembers.concat(this.allMentors);
    this.mentorIsPresent = batch.mentors.includes(this.userService.userid);
    const requestBody = {
      request: {
      batchId: batch.identifier,
      }
    };
    this.updateBatchService.getMentors(requestBody)
    .subscribe((res: any) => {
    this.mentorIsPresent = res.result.data.hasOwnProperty(this.userService.userid);
    console.log('menor', this.mentorIsPresent);
    const userMentors = res.result.data;
    const dialogRef = this.dialog.open(UpdateBatchDialogComponent, {
      data: {
        title: 'update',
        mentorDetail: this.allMentors,
        memberDetail: usersOfCourse,
        batchDetail: batch,
        courseId: this.courseId,
        creator: notCreator,
        mentorIsPresent: this.mentorIsPresent,
        userMentors: userMentors,
      }
      });

    },
    (err: any) => {
    if (err.status === 404) {
        const request = {
        request: {
        courseId: batch.courseId,
        batchId: batch.identifier,
        createdById: batch.createdBy,
        mentorsPresent: batch.mentors,
        mentorWhoUpdated : this.userService.userid,
        mentorsAdded: [],
        mentorsDeleted : [],
        }
      };
        this.updateBatchService.updateMentors(request).subscribe((res: any) => {
        console.log(res);
        this.toasterService.success('batch updated successfully');
        },
        error => {
          console.log(error);
          this.toasterService.error('please try again');
        });
    }
    }
    );
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
          this.allMentors = this.allMentors.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
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
          this.allMembers.push(obj);
          this.allMembers = _.compact(this.allMembers);
          } else if ((memberDetail.firstName === null && memberDetail.firstName === undefined)
          && (memberDetail.lastName !== undefined || memberDetail.lastName !== null)) {
            obj['name'] = memberDetail.lastName;
            obj['id'] = memberDetail.identifier;
            this.allMembers.push(obj);
            this.allMembers = _.compact(this.allMembers);
          } else {
            obj['name'] = memberDetail.firstName + ' ' + memberDetail.lastName;
            obj['id'] = memberDetail.identifier;
            this.allMembers.push(obj);
            this.allMembers = _.compact(this.allMembers);
          }
            }
            this.allMembers = this.allMembers.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));

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

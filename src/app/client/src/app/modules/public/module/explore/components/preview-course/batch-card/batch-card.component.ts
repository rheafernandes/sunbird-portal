import { Component, OnInit, Input } from '@angular/core';
import { CourseBatchService } from '@sunbird/learn';
import { Router } from '@angular/router';
import { UserService, CoursesService } from '@sunbird/core';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-batch-card',
  templateUrl: './batch-card.component.html',
  styleUrls: ['./batch-card.component.css']
})
export class BatchCardComponent implements OnInit {
  public unsubscribe = new Subject<void>();
  public showUnenroll = false;

  @Input()
  batch: any;

  constructor(
    public courseBatchService: CourseBatchService,
    public router: Router,
    public userService: UserService,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    public coursesService: CoursesService,
  ) {}

  ngOnInit() {
    this.checkIfEnrolled();
  }

  checkIfEnrolled() {
    this.coursesService.enrolledCourseData$.subscribe(
      data => {
        if (data && data.hasOwnProperty('enrolledCourses')) {
          if (data.enrolledCourses.length > 0) {
            for (const enrolledCourses of data.enrolledCourses) {
              if (this.batch.identifier === enrolledCourses.batchId) {
                this.showUnenroll = true;
                break;
              } else {
                this.showUnenroll = false;
              }
            }
          }
        }
      },
      err => {
        this.toasterService.error('Failed to fetch enrolled Batch details');
      }
    );
  }

  enroll() {
    const request = {
      request: {
        courseId: this.batch.courseId,
        batchId: this.batch.identifier,
        userId: this.userService.userid,
      }
    };
    this.courseBatchService
      .enrollToCourse(request)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          this.toasterService.success(this.resourceService.messages.smsg.m0036);
          this.fetchEnrolledCourseData(this.batch);
          this.showUnenroll = true;
        },
        err => {
          this.toasterService.error('Unsuccesful, try again later');
          this.showUnenroll = false;
        }
      );
  }
  unEnroll() {
    const request = {
      request: {
        courseId: this.batch.courseId,
        batchId: this.batch.identifier,
        userId: this.userService.userid
      }
    };
    this.courseBatchService
      .unEnrollToCourse(request)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          this.showUnenroll = false;
          this.toasterService.success(
            'Successfully un-enrolled from this batch'
          );
        },
        err => {
          this.showUnenroll = true;
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
}

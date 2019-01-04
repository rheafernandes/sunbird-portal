import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseConsumptionService, CourseBatchService } from '../../services';
import { UserService, LearnerService } from '@sunbird/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { pluck } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'app-preview-course',
  templateUrl: './preview-course.component.html',
  styleUrls: ['./preview-course.component.css']
})
export class PreviewCourseComponent implements OnInit {
  courseId = this.route.snapshot.paramMap.get('courseId');
  courseDetails;
  public ongoingSearch: any;
  totalParticipants = 0;
  batches = [];
  mentorsDetails = [];
  previewurl = [];
  coursechapters = [];
  youtubelink = [];
  check = [];
  safeUrl;

  constructor(
    private route: ActivatedRoute,
    private courseConsumptionService: CourseConsumptionService,
    public courseBatchService: CourseBatchService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public sanitizer: DomSanitizer,
    public router: Router,
    public toaster: ToasterService,
  ) { }

  ngOnInit() {
    this.ongoingSearch = {
      filters: {
        status: '1',
        courseId: this.courseId
      }
    };
    this.getCourseDetails();
    this.getBatchDetails();
  }
  getCourseDetails() {
    this.courseConsumptionService.getCourseHierarchy(this.courseId)
      .subscribe(
        (response: any) => {
          this.courseDetails = response;
          this.coursechapters = this.courseDetails.children;
        },
        (err) => {
          this.toaster.error('Fetching Details Failed');
        },
        () => {
          // this.getpreviewlinks();
        }
      );
  }

  getBatchDetails() {
    this.courseBatchService.getAllBatchDetails(this.ongoingSearch)
      .subscribe(
        (data: any) => {
        this.batches = data.result.response.content;
        for (const batch of this.batches) {
          if (batch.hasOwnProperty('participant')) {
            this.totalParticipants = this.totalParticipants + _.keys(batch.participant).length;
          }
        }
        if (this.batches.length > 0) {
          const mentorIds = _.union(this.batches[0].mentors);
          this.getMentorslist(mentorIds);
        }
      },
      (err) => {
        this.toaster.error('Fetching Details Failed');
      },
      );
  }
  getMentorslist(mentorIds) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: {
            identifier : mentorIds,
          },
          limit: 2
        }
      }
    };
    this.learnerService.post(option)
      .subscribe(
        (data) => {
          this.mentorsDetails = data.result.response.content;
        },
        (err) => {
          this.toaster.error('Fetching Details Failed');
        }
      );
  }

  getpreviewlinks() {
    for (const child of this.coursechapters) {

      this.youtubelink.push(child.children);
      if (child.children.length !== 0 && child.hasOwnProperty('children')) {
      this.checkChildrens(child);
      }

    }

    for (const link of this.check) {
      if (link.mimeType === 'video/x-youtube') {
        link.previewUrl = link.previewUrl.replace('watch?v=', 'embed/');
        this.previewurl.push(link.previewUrl);
      }
    }
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewurl[0]);
  }

  redirect() {
    this.router.navigate(['/learn/course', this.courseId]);
  }

  checkChildrens(child) {
    const property = 'children';
    for (const chheck of child.children) {
      if (chheck.hasOwnProperty('children')) {
        if (chheck.children.length !== 0) {
          this.checkChildrens(chheck);
        } else {
          this.check.push(chheck);
        }
      }
    }
  }
}

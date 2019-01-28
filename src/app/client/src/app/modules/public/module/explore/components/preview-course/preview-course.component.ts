import { Component, OnInit, Inject, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CourseConsumptionService, CourseBatchService } from '@sunbird/learn';
import { UserService, LearnerService } from '@sunbird/core';
import { ConfigService, ToasterService, ICollectionTreeOptions, PlayContent} from '@sunbird/shared';
import { pluck } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

export interface Batches {
  name: string;
  status: string;
}


@Component({
  selector: 'app-preview-course',
  templateUrl: './preview-course.component.html',
  styleUrls: ['./preview-course.component.css']
})
export class PreviewCourseComponent implements OnInit {
  batchControl = new FormControl('', [Validators.required]);
  batch: Batches[] = [
    {name: 'Ongoing', status: '1'},
    {name: 'Upcoming', status: '0'},
    {name: 'Previous', status: '2'},
  ];
  courseId = this.route.snapshot.paramMap.get('courseId');
  courseDetails;
  public search: any;
  totalParticipants = 0;
  batches = [];
  mentorsDetails = [];
  previewurl = [];
  coursechapters = [];
  youtubelink = [];
  check = [];
  safeUrl;
  collectionTreeNodes;
  collectionTreeOptions: ICollectionTreeOptions;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private courseConsumptionService: CourseConsumptionService,
    public courseBatchService: CourseBatchService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public sanitizer: DomSanitizer,
    public router: Router,
    public toaster: ToasterService,
    public player: PlayContent,
  ) {
    this.collectionTreeOptions = this.config.appConfig.collectionTreeOptions;
  }

  ngOnInit() {
    this.search = {
      filters: {
        status: '1',
        courseId: this.courseId
      }
    };
    this.getCourseDetails();
    this.getBatchDetails(this.search);
  }
  getCourseDetails() {
    this.courseConsumptionService.getCourseHierarchy(this.courseId)
      .subscribe(
        (response: any) => {
          this.courseDetails = response;
          console.log('course', this.courseDetails.createdBy);
          this.collectionTreeNodes = { data: this.courseDetails };
          this.coursechapters = this.courseDetails.children;
          const mentorIds = _.union(this.courseDetails.createdBy);
          console.log('mentor', mentorIds);
          this.getMentorslist(mentorIds);
        },
        (err) => {
          this.toaster.error('Fetching Details Failed');
        },
        () => {
        }
      );
  }

  getBatchDetails(search) {
    this.courseBatchService.getAllBatchDetails(search)
      .subscribe(
        (data: any) => {
        this.batches = data.result.response.content;
        for (const batch of this.batches) {
          if (batch.hasOwnProperty('participant')) {
            this.totalParticipants = this.totalParticipants + _.keys(batch.participant).length;
          }
        }
        // if (this.batches.length > 0 && this.mentorsDetails.length === 0) {
        //   const mentorIds = _.union(this.batches[0].mentors);
        //   this.getMentorslist(mentorIds);
        // }
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

  redirect() {
    this.router.navigate(['/learn/course', this.courseId]);
  }

  fetchBatches(input) {
    this.search = {
      filters: {
        status: input.status,
        courseId: this.courseId
      }
    };
    this.getBatchDetails(this.search);
  }

  openDialog(event) {
    console.log('dialog is openend');
  }
  public fetchUrl(event) {

    console.log( 'EVENT', event);
    if (event.hasOwnProperty('previewUrl') && event.previewUrl !== undefined) {
      const previewUrl = event.previewUrl.replace('watch?v=', 'embed/');
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);
    } else {
      this.toaster.error('Error loading Mutli-media content');
    }

  }
}


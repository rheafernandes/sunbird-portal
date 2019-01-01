import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import {
  ConfigService,
  ToasterService,
  IUserProfile,
  ServerResponse
} from '@sunbird/shared';
import { UserService, LearnerService } from '@sunbird/core';
import { of as observableOf, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from '@angular/material';
import { map, startWith, pluck } from 'rxjs/operators';
import * as _ from 'lodash';
import { CourseBatchService, UpdateBatchService } from '../../../services';


@Component({
  selector: 'app-update-batch-dialog',
  templateUrl: './update-batch-dialog.component.html',
  styleUrls: ['./update-batch-dialog.component.css']
})
export class UpdateBatchDialogComponent implements OnInit {
  public courseId;
  existingBatchDetail;
  shouldSizeUpdate: boolean;
  breakpoint: number;
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  userProfile: IUserProfile;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  mentorCtrl = new FormControl();
  filteredMentors: Observable<any>;
  mentors = [];
  allMentors = [];
  memberCtrl = new FormControl();
  filteredMembers: Observable<any>;
  members = [];
  allMembers = [];
  mentorIds;
  batchId;
  membersDetails = [];
  participantIds;
  creator = false;
  mentorIsPresent = false;
  addedMentors = [];
  mentorAddedMentors = [];
  mentorRemovedMentors = [];
  existingMentors = [];

  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMember') matMemberAutocomplete: MatAutocomplete;
  @ViewChild('mentorInput') mentorInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMentor') matMentorAutocomplete: MatAutocomplete;

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public toasterService: ToasterService,
    public courseBatchService: CourseBatchService,
    public updateBatchService: UpdateBatchService,
    public dialogRef: MatDialogRef<UpdateBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.existingBatchDetail = this.data.batchDetail;

    if (this.data.batchDetail.mentors.length > 0) {
      this.mentorIds = _.union(this.data.batchDetail.mentors);
    }

    if (
      this.data.batchDetail.participant !== undefined ||
      this.data.batchDetail.participant !== null
    ) {
      this.participantIds = _.union(_.keys(this.data.batchDetail.participant));
    }

    this.shouldSizeUpdate = data.shouldSizeUpdate;

    this.filteredMentors = this.mentorCtrl.valueChanges.pipe(
      startWith(null),
      map((mentor: string) =>
        mentor ? this._filterMentor(mentor) : this.allMentors.slice()
      )
    );
   }

  ngOnInit(): void {
    this.courseId = this.data.courseId;
    this.creator = this.data.creator;
    this.mentorIsPresent = this.data.mentorIsPresent;
    this.allMembers = this.data.memberDetail;
    this.allMentors = this.data.mentorDetail;

    this.breakpoint = window.innerWidth <= 550 ? 1 : 1;
    if (this.shouldSizeUpdate) {
      this.updateSize();
    }
    const userdata = this.userService.userProfile;
    this.allMentors = this.removeUserFromList(
      this.allMentors,
      'id',
      userdata.identifier
    );

    this.getMemberslist();
    this.getMentorslist();

  }

  updateSize() {
    this.dialogRef.updateSize('600px', '300px');
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth <= 550 ? 1 : 1;
  }

  addMentor(event: MatChipInputEvent): void {
    if (!this.matMentorAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        this.mentors.push(value.trim());
      }
      if (input) {
        input.value = '';
      }
      this.mentorCtrl.setValue(null);
    }
  }
  removeMentor(mentor): void {
    this.mentorRemovedMentors.push(mentor);
    const index = this.mentors.indexOf(mentor);
    if (index >= 0) {
      this.mentors.splice(index, 1);
      this.existingMentors.splice(index, 1);
    }
    this.allMentors.push(mentor);
  }
  selectedMentor(event: MatAutocompleteSelectedEvent): void {
    this.mentors.push(event.option.value);
    // this.existingMentors.push(event.option.value);
    this.removeMentorFromMentorsList(event.option.value);
    this.mentorAddedMentors.push(event.option.value);
    console.log('usermentors', this.mentorAddedMentors);
    this.mentorInput.nativeElement.value = '';
    this.mentorCtrl.setValue(null);
  }
  removeUserFromList(arr, attr, value): any[] {
    let i = arr.length;
      while (i--) {
        if (
          arr[i] &&
          arr[i].hasOwnProperty(attr) &&
          (arguments.length > 2 && arr[i][attr] === value)
        ) {
          arr.splice(i, 1);
        }
      }
      return arr;
    }
  private _filterMentor(value: string) {
    if (value !== undefined) {
      const filterValue = value.toString().toLowerCase();
      return this.allMentors.filter(mentor => mentor.name.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.allMentors;
  }
  removeMentorFromMentorsList(mentor) {
    const index = this.allMentors.indexOf(mentor);
    if (index >= 0) {
      this.allMentors.splice(index, 1);
    }
  }
  getMentorslist() {
   const option = {
     url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
     data: {
       request: {
         filters: {
           identifier : this.mentorIds,
         },
       }
     }
   };
   this.learnerService.post(option)
     .subscribe(
       data => {
         const mentorsDetails = data.result.response.content;
         for (const mentorDetail of mentorsDetails ) {
           if (mentorDetail.firstName !== undefined && mentorDetail.lastName !== undefined) {
             const obj = {};
             obj['name'] = mentorDetail.firstName + ' ' + mentorDetail.lastName;
             obj['id'] = mentorDetail.identifier;
             this.mentors.push(obj);
             this.mentors = _.compact(this.mentors);
           }
         }
       }
     );
     this.mentors = this.mentors.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));

 }
 getMemberslist() {
   const option = {
     url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
     data: {
       request: {
         filters: {
           identifier: this.participantIds,
         },
       }
     }
   };
   this.learnerService.post(option)
     .subscribe(
       data => {
         const membersDetails = data.result.response.content;
         for (const memberDetail of membersDetails ) {
           if (memberDetail.firstName !== undefined && memberDetail.lastName !== undefined) {
             const obj = {};
             obj['name'] = memberDetail.firstName + ' ' + memberDetail.lastName;
             obj['id'] = memberDetail.identifier;
             this.members.push(obj);
             this.members = _.compact(this.members);
           }
         }
       }
     );
     this.members = this.members.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));

 }

 onSubmit(title, description, startDate, endDate) {
    startDate = new Date(Date.parse(startDate)).toISOString().slice(0, 10);
    endDate = new Date(Date.parse(endDate)).toISOString().slice(0, 10);
    if (this.date.value > this.serializedDate.value) {
      this.toasterService.error('End Date should be greater than start date');
    } else {
      const mentorIds = [];
      for (const mentor of this.mentors) {
        mentorIds.push(mentor.id);
      }
      console.log('memtorid', mentorIds);
      const requestBody = {
        id: this.data.batchDetail,
        name: title,
        description: description,
        // tslint:disable-next-line:quotemark
        enrollmentType: 'open',
        startDate: startDate,
        endDate: endDate || null,
        createdFor: this.userService.userProfile.organisationIds,
        mentors: _.compact(mentorIds)
      };
      this.courseBatchService.updateBatch(requestBody)
      .subscribe(
        (data) => {
          this.toasterService.success('Successfully updated the batch');
        },
        err => {
          this.toasterService.error('Cant update. ' + err.error.params.errmsg);
        }
      );
      this.dialogRef.close();
    }
  }

updateMentors() {
 const batch = this.data.batchDetail;
  console.log('batch details', batch.createdBy);
  const mentorIds = [];
  for (const mentor of this.mentors) {
    mentorIds.push(mentor.id);
  }
  console.log('mentor ids', mentorIds);
  const addedmentorIds = [];
  for (const addMentorId  of this.mentorAddedMentors) {
    addedmentorIds.push(addMentorId.id);
  }
  const deletedmemberIds = [];
  for (const deleteMemberId  of this.mentorRemovedMentors) {
    deletedmemberIds.push(deleteMemberId.id);
  }
  const requestBody = {
    request: {
    courseId: this.courseId,
    batchId: batch.identifier,
    createdById: batch.createdBy,
    mentorsPresent: _.compact(mentorIds),
    mentorWhoUpdated : this.userService.userid,
    mentorsAdded: _.compact(addedmentorIds),
    mentorsDeleted : _.compact(deletedmemberIds),
    }
  };
    console.log('request', requestBody);
   this.updateBatchService.updateMentors(requestBody);
    this.dialogRef.close();
  }

}




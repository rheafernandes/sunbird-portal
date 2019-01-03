import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import {
  ConfigService,
  ToasterService,
  IUserProfile,
  ServerResponse,
  ResourceService
} from '@sunbird/shared';
import { UserService, LearnerService } from '@sunbird/core';
import { of as observableOf, Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from '@angular/material';
import { map, startWith, pluck, takeUntil } from 'rxjs/operators';
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
  userMentorCtrl = new FormControl();
  filteredMentors: Observable<any>;
  mentors = [];
  minDate = new Date();
  allMentors = [];
  memberCtrl = new FormControl();
  filteredMembers: Observable<any>;
  filteredUserMentors: Observable<any>;
  members = [];
  allMembers = [];
  mentorIds;
  userMentorIds;
  batchId;
  membersDetails = [];
  participantIds;
  creator = false;
  mentorIsPresent = false;
  addedMentors = [];
  userMentors = [];
  removedMentors = [];
  existingMentors = [];
  // existingMentorIds;
  public unsubscribe = new Subject<void>();
  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMember') matMemberAutocomplete: MatAutocomplete;
  @ViewChild('mentorInput') mentorInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMentor') matMentorAutocomplete: MatAutocomplete;
  @ViewChild('userMentorInput') usermentorInput: ElementRef<HTMLInputElement>;
  @ViewChild('userAutoMentor') matuserMentorAutocomplete: MatAutocomplete;
  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public toasterService: ToasterService,
    public courseBatchService: CourseBatchService,
    public updateBatchService: UpdateBatchService,
    public resourceService: ResourceService,
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
    } else {
      this.participantIds = [];
    }
    this.shouldSizeUpdate = data.shouldSizeUpdate;

    this.filteredMentors = this.mentorCtrl.valueChanges.pipe(
      startWith(null),
      map((mentor: string) =>
        mentor ? this._filterMentor(mentor) : this.allMentors.slice()
      )
    );
    this.filteredUserMentors = this.userMentorCtrl.valueChanges.pipe(
      startWith(null),
      map((mentor: string) =>
        mentor ? this._filterUserMentor(mentor) : this.allMentors.slice()
      )
    );

   }

  ngOnInit(): void {
    this.courseId = this.data.courseId;
    this.creator = this.data.creator;
    this.mentorIsPresent = this.data.mentorIsPresent;
    this.allMembers = this.data.memberDetail;
    this.allMentors = this.data.mentorDetail;

    this.userMentors = this.data.userMentors.hasOwnProperty(this.userService.userid) ? this.data.userMentors[this.userService.userid] : [];
    // tslint:disable-next-line: max-line-length
    this.existingMentors = this.data.userMentors.hasOwnProperty(this.data.batchDetail.createdBy) ? this.data.userMentors[this.data.batchDetail.createdBy] : [];
   if (this.userMentors.length > 0) {
      this.userMentorIds = _.union(this.userMentors);
    }
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

  for (const mentor of this.userMentors) {
  this.allMentors.filter(data => {
    if (data.id === mentor) {
      const index = this.allMentors.indexOf(data);
      if (index > 0) {
        this.allMentors.splice(index, 1);
          }
        }
      });
    }
    for (const mentor of this.existingMentors) {
      this.allMentors.filter(data => {
        if (data.id === mentor) {
          const index = this.allMentors.indexOf(data);
          if (index > 0) {
            this.allMentors.splice(index, 1);
              }
            }
          });
        }
    this.getMembers();
    this.getMentorslist();
    this.getUserMentorslist();
  }

  updateSize() {
    this.dialogRef.updateSize('600px', '300px');
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth <= 550 ? 1 : 1;
  }

  addUserMentor(event: MatChipInputEvent): void {
    if (!this.matuserMentorAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        this.addedMentors.push(value.trim());
      }
      if (input) {
        input.value = '';
      }
      this.userMentorCtrl.setValue(null);
    }
  }

  removeUserMentor(mentor): void {
    const index = this.addedMentors.indexOf(mentor);
    const mentorindex = this.mentors.indexOf(mentor);
    this.removedMentors.push(mentor);
    if (index >= 0) {
      this.addedMentors.splice(index, 1);
    }
    if (mentorindex >= 0) {
      this.mentors.splice(index, 1);
    }
  }

  selectedUserMentor(event: MatAutocompleteSelectedEvent): void {
    this.addedMentors.push(event.option.value);
    this.removeMentorFromMentorsList(event.option.value);
    this.userMentors.push(event.option.value.id);
    this.usermentorInput.nativeElement.value = '';
    this.userMentorCtrl.setValue(null);
  }
  private _filterUserMentor(value: string) {
    if (value !== undefined) {
      const filterValue = value.toString().toLowerCase();
      return this.allMentors.filter(mentor => mentor.name.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.allMentors;
  }
  removeUserMentorFromMentorsList(mentor) {
    const index = this.allMentors.indexOf(mentor);
    if (index >= 0) {
      this.allMentors.splice(index, 1);
    }
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

  removeMentor(mentor): void {
    const index = this.mentors.indexOf(mentor);
    if (index >= 0) {
      this.mentors.splice(index, 1);
    }
  }

  selectedMentor(event: MatAutocompleteSelectedEvent): void {
    this.mentors.push(event.option.value);
    this.removeMentorFromMentorsList(event.option.value);
    this.mentorInput.nativeElement.value = '';
    this.mentorCtrl.setValue(null);
  }

  private _filterMentor(value: string) {
    if (value !== undefined) {
      const filterValue = value.toString().toLowerCase();
      return this.allMentors.filter(
        mentor => mentor.name.toLowerCase().indexOf(filterValue) === 0
      );
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
           identifier : this.existingMentors,
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
        //  this.getUserMentorslist();
       }
     );
     this.mentors = this.mentors.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
 }

 getUserMentorslist() {
   if (this.userMentors.length > 0) {
  const option = {
    url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
    data: {
      request: {
        filters: {
          identifier : this.userMentors,
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
            this.addedMentors.push(obj);
            this.addedMentors = _.compact(this.addedMentors);
          }
        }
      }
    );
    }
    this.addedMentors = this.addedMentors.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
}
 getMembers() {
  const key = this.data.batchDetail.participant;
  if (key !== undefined && key !== null) {
    const memberKeys = Object.keys(key);

    for (const memb of memberKeys) {
      const option = {
        url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${memb}`,
        param: this.config.urlConFig.params.userReadParam
      };
      const obj = [];
      this.learnerService.get(option).subscribe((data: ServerResponse) => {
        const newmemberdata = data.result.response;
      obj['id'] = newmemberdata.identifier;
      obj['name'] = newmemberdata.firstName + ' ' + newmemberdata.lastName;
      this.members.push(obj);
      this.members = _.compact(this.members);

        }
      );
    }
    this.members = this.members.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
  }
}

 onSubmit(title, description, startDate, endDate) {
   let requestBody;
  const participants = [];
    startDate = new Date(Date.parse(startDate)).toISOString().slice(0, 10);
    endDate = new Date(Date.parse(endDate)).toISOString().slice(0, 10);
    if (this.date.value > this.serializedDate.value) {
      this.toasterService.error('End Date should be greater than start date');
    } else {
      const mentorIds = [];
      for (const mentor of this.mentors) {
        mentorIds.push(mentor.id);
      }
        requestBody = {
          id: this.data.batchDetail,
          name: title,
          description: description,
          enrollmentType: 'invite-only',
          startDate: startDate,
          endDate: endDate || null,
          createdFor: this.userService.userProfile.organisationIds,
          mentors: _.compact(mentorIds)
        };

      for (const memberId of this.members) {
        participants.push(memberId.id);
      }

      this.courseBatchService.updateBatch(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (participants && participants.length > 0) {
          this.updateParticipantsToBatch(this.batchId, participants);
        } else {
          this.toasterService.success(this.resourceService.messages.smsg.m0034);
        }
      },
      (err) => {
        if (err.error && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0052);
        }
      });
      this.dialogRef.close();
    }
  }
  private updateParticipantsToBatch(batchId, participants) {
    const userRequest = {
      userIds: _.compact(participants)
    };
    this.courseBatchService.addUsersToBatch(userRequest, batchId).pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0034);
      },
      (err) => {
        if (err.params && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0053);
        }
      });
  }

updateMentors() {
 const batch = this.data.batchDetail;
  const mentorIds = [];
  for (const mentor of this.mentors) {
    mentorIds.push(mentor.id);
  }
  const deletedmemberIds = [];
  for (const deleteMemberId  of this.removedMentors) {
    deletedmemberIds.push(deleteMemberId.id);
  }
  const addedmemberIds = [];
  for (const addedMemberId  of this.addedMentors) {
    addedmemberIds.push(addedMemberId.id);
  }
  const requestBody = {
    request: {
    courseId: this.courseId,
    batchId: batch.identifier,
    createdById: batch.createdBy,
    mentorsPresent: _.compact(mentorIds),
    mentorWhoUpdated : this.userService.userid,
    mentorsAdded: _.compact(addedmemberIds),
    mentorsDeleted : _.compact(deletedmemberIds),
    }
  };
    this.updateBatchService.updateMentors(requestBody).subscribe((res: any) => {
    console.log(res);
    this.toasterService.success('batch updated successfully');
    },
    err => {
      console.log(err);
      this.toasterService.error('please try again');
    });
    this.dialogRef.close();
  }


}



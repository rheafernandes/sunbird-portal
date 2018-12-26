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
import { CourseBatchService } from '../../../services';

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
  // mentor;
  mentors;
  allMentors = [];
  memberCtrl = new FormControl();
  filteredMembers: Observable<any>;
  // member;
  members = [];
  allMembers = [];
  mentorIds;
  batchId;
  membersDetails = [];
  participantIds;
  creator: boolean;

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
    public dialogRef: MatDialogRef<UpdateBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // console.log('Batch Detail', this.data.batchDetail);
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
    // this.filteredMembers = this.memberCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((member: string | null) => member ? this._filterMember(member) : this.allMembers.slice()));
  }

  ngOnInit(): void {
    this.courseId = this.data.courseId;
    this.creator = this.data.creator;
      this.allMembers = this.data.memberDetail;
    this.allMentors = this.data.mentorDetail;
    this.mentors = this.data.batchDetail.mentors;
    console.log('existing batchDetail', this.data.batchDetail);
    // this.members = this.data.batchDetail.participant;
    // console.log('existing members', this.members);
    this.breakpoint = window.innerWidth <= 550 ? 1 : 1;
    if (this.shouldSizeUpdate) {
      this.updateSize();
    }
    this.getMentorslist();
    this.getMembers();
    // this.getMemberslist();
    // this.getMentors();
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
    const index = this.mentors.indexOf(mentor);

    if (index >= 0) {
      this.mentors.splice(index, 1);
    }
  }
  selectedMentor(event: MatAutocompleteSelectedEvent): void {
    this.mentors.push(event.option.value);
    console.log('selected mentor', event.option.value);
    this.mentorInput.nativeElement.value = '';
    this.mentorCtrl.setValue(null);
  }

  private _filterMentor(value: string) {
    if  (value !== undefined) {
      const filterValue = value.toString().toLowerCase();
      return this.allMentors.filter(mentor => mentor.name.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.allMentors;
  }
  // addMember(event: MatChipInputEvent): void {

  //   if (!this.matMemberAutocomplete.isOpen) {
  //     const input = event.input;
  //     const value = event.value;

  //     if ((value || '').trim()) {
  //       this.members.push(value.trim());
  //     }
  //     if (input) {
  //       input.value = '';
  //     }
  //     this.memberCtrl.setValue(null);
  //   }
  // }

  // selectedMember(event: MatAutocompleteSelectedEvent): void {
  //   this.members.push(event.option.value);
  //   console.log('selected member', this.members);
  //   this.memberInput.nativeElement.value = '';
  //   this.memberCtrl.setValue(null);
  // }

  // private _filterMember(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.allMembers.filter(member => member.name.toLowerCase().indexOf(filterValue) === 0);
  // }

  getMentorslist() {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: {
            identifier: this.mentorIds
          }
        }
      }
    };
    const obj = [];
    this.learnerService.post(option).subscribe(data => {
      const mentorsDetails = data.result.response.content;
      for (const mentorDetail of mentorsDetails) {
        if (
          (mentorDetail.firstName !== undefined &&
          mentorDetail.firstName !== null) ||
          (mentorDetail.lastName !== undefined &&
            mentorDetail.lastName !== null)
        ) {
          obj['id'] = mentorDetail.identifier;
          obj['name'] = mentorDetail.firstName + ' ' + mentorDetail.lastName;
          // this.mentors = this.mentors || [];
          this.mentors.push(obj);
        }
      }
      // console.log('obj mentors', this.mentors);
     this.mentors = this.mentors.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));

      // console.log('duplicate', this.mentors);
    });
  }

  getMembers() {
    // console.log('this', this.data.batchDetail);
    const key = this.data.batchDetail.participant;
    // console.log('key value', key === undefined && key === null);
    if (key !== undefined && key !== null) {
      const memberKeys = Object.keys(key);
      // console.log('memberkeys', memberKeys);

      for (const memb of memberKeys) {
        const option = {
          url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${memb}`,
          param: this.config.urlConFig.params.userReadParam
        };
        const obj = [];
        this.learnerService.get(option).subscribe((data: ServerResponse) => {
          const newmemberdata = data.result.response;
        console.log('member in update', newmemberdata);

        obj['id'] = newmemberdata.identifier;
        obj['name'] = newmemberdata.firstName + ' ' + newmemberdata.lastName;
        // console.log('obj member data', obj);

        this.members.push(obj);
        console.log('this.members after array push', this.members);
        this.members = _.compact(this.members);
        // this.members = _.flatten(this.members);
        console.log('this.members', this.members);
          // if ((newmemberdata.firstName !== undefined && newmemberdata.firstName !== null) ||
          // (newmemberdata.lastName === undefined && newmemberdata === null)) {
          //   obj['id'] = newmemberdata.identifier;
          //   obj['name'] = newmemberdata.firstName;
          //   // this.members.splice(obj);
          // } else if ((newmemberdata.firstName === undefined || newmemberdata.firstName === null) &&
          //      (newmemberdata.lastName !== null && newmemberdata.lastName !== undefined)) {
          //       obj['id'] = newmemberdata.identifier;
          //     obj['name'] = newmemberdata.lastName;
          //     // this.members.splice(obj);
          //     console.log('obj', obj);
          //   } else {
          //     obj['id'] = newmemberdata.identifier;
          //   obj['name'] = newmemberdata.firstName + ' ' + newmemberdata.lastName;
          //   // this.members.splice(obj);
          //   console.log('obj', obj);
          //   }
          //   // this.members = this.members || [];
          //   console.log('members', this.members);
          }
        );
      }
      this.members = this.members.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
      console.log('members', this.members);
    }
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
      const requestBody = {
        id: this.data.batchDetail.identifier,
        name: title,
        description: description,
        // tslint:disable-next-line:quotemark
        enrollmentType: 'open',
        startDate: startDate,
        endDate: endDate || null,
        createdFor: this.userService.userProfile.organisationIds,
        mentors: _.compact(mentorIds)
      };
      console.log('request body', requestBody);
      this.courseBatchService.updateBatch(requestBody).subscribe(
        data => {
          // console.log(data);
          this.toasterService.success('You successfully updated the batch');
        },
        err => {
          // console.log(err);
          this.toasterService.error('Cant update. ' + err.error.params.errmsg);
        }
      );
      this.dialogRef.close();
    }
  }
  // getMemberslist() {
  //   const option = {
  //     url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
  //     data: {
  //       request: {
  //         filters: {
  //           identifier: this.participantIds,
  //         },
  //       }
  //     }
  //   };
  //   const obj = [];
  //   this.learnerService.post(option)
  //     .subscribe(
  //       data => {
  //         const membersDetails = data.result.response.content;
  //         for (const memberDetail of membersDetails ) {
  //           if ((memberDetail.firstName !== undefined && memberDetail.firstName !== null) &&
  //           (memberDetail.lastName !== undefined && memberDetail.lastName !== null)) {
  //             obj['name'] = memberDetail.firstName + ' ' + memberDetail.lastName;
  //             obj['id'] = memberDetail.identifier;
  //             this.members = this.members || [];
  //             this.members.push(obj);
  //           }
  //         }
  //         console.log('obj mentors', this.members);

  //       }
  //     );
  //     // Object.keys(this.member.id).map(data => console.log('member detail in update======', data));

  // }
}

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { UserService, LearnerService } from '@sunbird/core';
import { Subject, of as observableOf, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { map, startWith, pluck } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-update-batch-dialog',
  templateUrl: './update-batch-dialog.component.html',
  styleUrls: ['./update-batch-dialog.component.css']
})
export class UpdateBatchDialogComponent implements OnInit {
  existingBatchDetail;
  shouldSizeUpdate: boolean;
  breakpoint: number;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  mentorCtrl = new FormControl();
  filteredMentors: Observable<string[]>;
  mentors = [];
  allMentors = [];
  memberCtrl = new FormControl();
  filteredMembers: Observable<string[]>;
  members = [];
  allMembers = [];
  mentorIds;
  mentorsDetails = {};
  membersDetails = {};
  allMentorsDetails = {};
  allMembersDetails = {};
  participantIds;

  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMember') matMemberAutocomplete: MatAutocomplete;
  @ViewChild('mentorInput') mentorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public dialogRef: MatDialogRef<UpdateBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Batch Detail', this.data.batchDetail);
    this.existingBatchDetail = this.data.batchDetail;
    if (this.data.batchDetail.mentors.length > 0) {
      this.mentorIds = _.union(this.data.batchDetail.mentors);
    }
    if (this.data.batchDetail.participant !== undefined || this.data.batchDetail.participant !== null) {
      this.participantIds = _.union(_.keys(this.data.batchDetail.participant ));
    }
    this.shouldSizeUpdate = data.shouldSizeUpdate;
    this.filteredMentors = this.mentorCtrl.valueChanges.pipe(
      startWith(null),
      map((mentor: string | null) => mentor ? this._filterMentor(mentor) : this.allMentors.slice()));
    this.filteredMembers = this.memberCtrl.valueChanges.pipe(
      startWith(null),
      map((member: string | null) => member ? this._filterMember(member) : this.allMembers.slice()));
  }

  ngOnInit(): void {
    this.allMembersDetails = this.data.memberDetail;
    this.allMentorsDetails = this.data.mentorDetail;
    this.allMentors = _.values(this.data.mentorDetail);
    this.allMembers = _.values(this.data.memberDetail);
    this.allMembers = _.concat(this.allMentors, this.allMembers);
    this.breakpoint = (window.innerWidth <= 550) ? 1 : 1;
    if (this.shouldSizeUpdate) { this.updateSize(); }
    this.getMemberslist();
    this.getMentorslist();
  }

  updateSize() {
    this.dialogRef.updateSize('600px', '300px');
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 550) ? 1 : 1;
  }
  addMentor(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
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

  removeMentor(mentor: string): void {
    const index = this.mentors.indexOf(mentor);

    if (index >= 0) {
      this.mentors.splice(index, 1);
    }
  }

  selectedMentor(event: MatAutocompleteSelectedEvent): void {
    this.mentors.push(event.option.viewValue);
    this.mentorInput.nativeElement.value = '';
    this.mentorCtrl.setValue(null);
  }

  private _filterMentor(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allMentors.filter(mentor => mentor.toLowerCase().indexOf(filterValue) === 0);
  }
  addMember(event: MatChipInputEvent): void {

    if (!this.matMemberAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.members.push(value.trim());
      }
      if (input) {
        input.value = '';
      }

      this.memberCtrl.setValue(null);
    }
  }

  selectedMember(event: MatAutocompleteSelectedEvent): void {
    this.members.push(event.option.viewValue);
    this.memberInput.nativeElement.value = '';
    this.memberCtrl.setValue(null);
  }

  private _filterMember(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allMembers.filter(member => member.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit(title, description, startDate, endDate) {
    // const requestBody = {
    //   id: this.batchId,
    //   name: this.batchUpdateForm.value.name,
    //   description: this.batchUpdateForm.value.description,
    //   enrollmentType: this.batchUpdateForm.value.enrollmentType,
    //   startDate: startDate,
    //   endDate: endDate || null,
    //   createdFor: this.userService.userProfile.organisationIds,
    //   mentors: _.compact(mentors)
    // };
    console.log('Submitted');
    console.log(title);
    console.log(description);
    startDate = new Date(Date.parse(startDate)).toISOString().slice(0, 10);
    endDate = new Date(Date.parse(endDate)).toISOString().slice(0, 10);
    console.log(this.mentors);
    console.log(this.members);
    console.log(startDate);
    console.log(endDate);
    this.dialogRef.close();
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
              this.mentorsDetails[mentorDetail.identifier] = mentorDetail.firstName + ' ' + mentorDetail.lastName;
              this.mentors = _.values(this.mentorsDetails);
            }
          }
        }
      );
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
              this.membersDetails[memberDetail.identifier] = memberDetail.firstName + ' ' + memberDetail.lastName;
              this.members = _.values(this.membersDetails);
            }
          }
        }
      );
  }
}


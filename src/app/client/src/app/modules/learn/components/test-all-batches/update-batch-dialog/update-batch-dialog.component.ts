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
  courseId = this.route.snapshot.paramMap.get('courseId');
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
  existingBatchDetail;
  mentorIds = [];
  mentorsDetails = [];
  participantIds = [];

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
      this.mentorIds = this.data.batchDetail.mentors;
    }
    if (this.data.batchDetail.participant !== undefined || this.data.batchDetail.participant !== null) {
      this.participantIds = Object.keys(this.data.batchDetail.participant );
    }
    this.shouldSizeUpdate = data.shouldSizeUpdate;
    this.filteredMentors = this.mentorCtrl.valueChanges.pipe(
      startWith(null),
      map((mentor: string | null) => mentor ? this._filterMentor(mentor) : this.allMentors.slice()));
    this.filteredMembers = this.memberCtrl.valueChanges.pipe(
      startWith(null),
      map((member: string | null) => member ? this._filterMember(member) : this.allMembers.slice()));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.allMentors = this.data.mentorDetail;
    this.allMembers = this.data.memberDetail;
    this.allMembers.push(this.allMentors);
    this.breakpoint = (window.innerWidth <= 550) ? 1 : 1;
    if (this.shouldSizeUpdate) { this.updateSize(); }
    const orddata = {
      filters: {
        courseId: this.courseId
      }
    };
    for (const mentorId of this.mentorIds) {
          this.getMentorDetails(mentorId);
    }
    for (const participantId of this.participantIds) {
      this.getParticipantDetails(participantId);
}
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
  getMentorDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    response.subscribe((data: any) => {
        this.mentorsDetails.push(data);
        if (data.firstName !== undefined && data.lastName !== undefined) {
          this.mentors.push(data.firstName + ' ' + data.lastName);
        }
    }
    );
  }
  getParticipantDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    response.subscribe((data: any) => {
      if (data.firstName !== undefined && data.lastName !== undefined) {
        this.members.push(data.firstName + ' ' + data.lastName);
      }
    }
    );
  }
}


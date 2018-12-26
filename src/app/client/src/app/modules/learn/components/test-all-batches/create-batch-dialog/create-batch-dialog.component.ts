import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService } from '../../../services';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { ConfigService, ToasterService, ServerResponse,  ResourceService  } from '@sunbird/shared';
import { UserService, LearnerService  } from '@sunbird/core';
import { Subject, of as observableOf, Observable } from 'rxjs';
import * as moment from 'moment';
import { takeUntil, mergeMap } from 'rxjs/operators';
import {
  FormControl,
  Validators
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete
} from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

export class DetailModel {
  name: string;
  id: string;
}
@Component({
  selector: 'app-create-batch-dialog',
  templateUrl: './create-batch-dialog.component.html',
  styleUrls: ['./create-batch-dialog.component.css']
})
export class CreateBatchDialogComponent implements OnInit {
  public courseId;
  minDate = new Date();
  mentorsCreatedBy;
  shouldSizeUpdate: boolean;
  breakpoint: number;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  mentorCtrl = new FormControl();
  filteredMentors: Observable<any>;
  mentors = [];
  allMentors = [];
  allMentorsDetails;
  @ViewChild('mentorInput') mentorInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMentor') matMentorAutocomplete: MatAutocomplete;
  memberCtrl = new FormControl();
  filteredMembers: Observable<any>;
  members = [];
  rout: Router;
  allMembers = [];
  allMembersDetails;
  events: string[] = [];
  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoMember') matMemberAutocomplete: MatAutocomplete;
  serializedDate = new FormControl(new Date().toISOString());
  date = new FormControl(new Date(), [Validators.required]);
  startDate = '';
  endDate = '';
  disableSubmitBtn = true;
  batchDescriptCtrl = new FormControl('', [Validators.required]);
  batchnameCtrl = new FormControl('', [Validators.required]);
  dateBooleanvalue: Boolean;
  private activatedRoute: ActivatedRoute;
  public unsubscribe = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    public courseBatchService: CourseBatchService,
    public userService: UserService,
    rout: Router,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public learnerService: LearnerService,
    public configService: ConfigService,
    public dialogRef: MatDialogRef<CreateBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rout = rout;
    this.shouldSizeUpdate = data.shouldSizeUpdate;
    this.filteredMentors = this.mentorCtrl.valueChanges.pipe(
      startWith(null),
      map((mentor: string | null) =>
        mentor ? this._filterMentor(mentor) : this.allMentors.slice()
      )
    );

    this.filteredMembers = this.memberCtrl.valueChanges.pipe(
      startWith(null),
      map((member: string | null) =>
        member ? this._filterMember(member) : this.allMembers.slice()
      )
    );
  }

  ngOnInit(): void {
    this.courseId = this.data.courseId;
    console.log('courseId', this.courseId);
    this.allMentors = this.data.mentorDetail;
    this.allMembers = this.data.memberDetail;
    // this.allMembers = _.concat(this.allMentors, this.allMembers);
    this.breakpoint = window.innerWidth <= 550 ? 1 : 1;
    if (this.shouldSizeUpdate) {
      this.updateSize();
    }
    // this.redirect();
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

  private _filterMentor(value) {
    const filterValue = value.toLowerCase();
    return this.allMentors.filter(
      mentor => mentor.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  addMember(event: MatChipInputEvent): void {
    if (!this.matMemberAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      console.log('Added Member Value', value);
      if ((value || '').trim()) {
        this.members.push(value.trim());
      }
      if (input) {
        input.value = '';
      }
      this.memberCtrl.setValue(null);
    }
  }

  removeMember(member): void {
    const index = this.members.indexOf(member);
    if (index >= 0) {
      this.members.splice(index, 1);
    }
  }

  selectedMember(event: MatAutocompleteSelectedEvent): void {
    this.members.push(event.option.value);
    this.memberInput.nativeElement.value = '';
    this.memberCtrl.setValue(null);
  }

  private _filterMember(value) {
    const filterValue = value.toLowerCase();
    return this.allMembers.filter(
      member => member.name.toLowerCase().indexOf(filterValue) === 0
    );
  }
  submit(startDate, endDate) {
    this.disableSubmitBtn = true;
    console.log('diable ', this.disableSubmitBtn);
    const userRootOrgId = this.userService.rootOrgId;
  const  participants = [];
    startDate = new Date(Date.parse(startDate)).toISOString().slice(0, 10);
    endDate = new Date(Date.parse(endDate)).toISOString().slice(0, 10);

    const mentorIds = [];
    for (const mentor of this.mentors) {
      mentorIds.push(mentor.id);

        }
    const requestBody = {
      courseId: this.courseId,
      name: this.batchnameCtrl.value,
      description: this.batchDescriptCtrl.value,
      // tslint:disable-next-line:quotemark
      enrollmentType: "invite-only",
      startDate: startDate,
      endDate: endDate || null,
      createdBy: this.userService.userid,
      createdFor: this.userService.userProfile.organisationIds,
      mentors: _.compact(mentorIds)
    };
    const memberIds = [];
    for (const memberId of this.members) {
      console.log('meemId', memberId.id);
     participants.push(memberId.id);
    }
    // console.log('participants', participants);
    console.log('memebers while submit', this.members);
    console.log('request body', requestBody);
    this.courseBatchService.createBatch(requestBody).pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      console.log(response);
      console.log('members length', participants.length);
      if (participants && participants.length > 0) {
        console.log('batchid', response.result.batchId);
        this.addParticipantToBatch(response.result.batchId, participants );
      } else {
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        // this.reload();
      }
      this.toasterService.success('Successfully Created Batch');
    },
    (err) => {
      this.disableSubmitBtn = false;
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0052);
      }
    });
    // this.courseBatchService.createBatch(requestBody)
    // .subscribe(
    //   (data) => {
    //     console.log(data);
    //     this.toasterService.success('Successfully Created Batch');
    //   },
    //   (err) => {
    //     this.toasterService.error('Cant create. ' + err.error.params.errmsg);
    //   }
    // );
  }
  private addParticipantToBatch(batchId, participants) {
    const userRequest = {
      userIds: _.compact(participants)
    };
    console.log('diable ', this.disableSubmitBtn);
    this.courseBatchService.addUsersToBatch(userRequest, batchId).pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.disableSubmitBtn = false;
        console.log('diable ', this.disableSubmitBtn);
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        // this.reload();
      },
        (err) => {
          this.disableSubmitBtn = false;
          console.log('diable ', this.disableSubmitBtn);
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0053);
          }
        });
  }
  // private reload() {
  //   setTimeout(() => {
  //     this.courseBatchService.updateEvent.emit({ event: 'create' });
  //     this.rout.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  //   }, 1000);
  // }
  // public redirect() {
  //   this.rout.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  // }
}

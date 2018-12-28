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
      this.allMembers = this.data.memberDetail;
    this.allMentors = this.data.mentorDetail;

    this.breakpoint = window.innerWidth <= 550 ? 1 : 1;
    if (this.shouldSizeUpdate) {
      this.updateSize();
    }
    this.getMembers();
    this.getMentors();
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
    this.removeMentorFromMentorsList(event.option.value);

    this.mentorInput.nativeElement.value = '';
    this.mentorCtrl.setValue(null);
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

  getMembers() {
    setTimeout(() => {
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
  }, 3000);
  }
getMentors() {
  setTimeout(() => {
  const key = this.data.batchDetail.mentors;
    for (const mentor of key) {
      const option = {
        url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${mentor}`,
        param: this.config.urlConFig.params.userReadParam
      };
      const obj = {};
      this.learnerService.get(option).subscribe((data: ServerResponse) => {
      const newmentor = data.result.response;
      obj['id'] = newmentor.identifier;
      obj['name'] = newmentor.firstName + ' ' + newmentor.lastName;
      this.mentors.push(obj);
      this.mentors = _.compact(this.mentors);

        }
      );
    }
    this.mentors = this.mentors.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
}, 2000);
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
      this.courseBatchService.updateBatch(requestBody)
      .subscribe(
        (data) => {
          this.toasterService.success('You successfully updated the batch');
        },
        err => {
          this.toasterService.error('Cant update. ' + err.error.params.errmsg);
        }
      );
      this.dialogRef.close();
    }
  }

}

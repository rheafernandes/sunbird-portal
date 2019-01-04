import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigService } from '@sunbird/shared';
import { UserService, LearnerService } from '@sunbird/core';
import { pluck } from 'rxjs/operators';
import {AttendanceComponent} from '../attendance/attendance.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  sessions;
  participants = [];
  userIds = [];
  participantsDetails = [];
  constructor(private router: Router, public dialogRef: MatDialogRef<SessionDetailsComponent>, @Inject(MAT_DIALOG_DATA) private data,
    private userService: UserService, public learnerService: LearnerService,
    public config: ConfigService) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.sessions = this.data.sessionData;
    this.participants = this.sessions.hasOwnProperty('participant') ? this.sessions.participant : {};
    console.log('parshf', this.participants);
    this.userIds = Object.keys(this.participants);
    for (const userId of this.userIds) {
      this.getParticipantsDetails(userId);
    }
  }

  navigate(courseId) {
    this.router.navigate([`learn/preview/${courseId}`]);
    this.dialogRef.close();
  }

  getParticipantsDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    response.subscribe(data => {
      console.log('user details', data);
      this.participantsDetails.push(data);
    }
    );
  }

}

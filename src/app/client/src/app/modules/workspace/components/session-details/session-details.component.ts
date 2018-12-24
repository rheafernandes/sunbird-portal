import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigService } from '@sunbird/shared';
import { UserService, LearnerService } from '@sunbird/core';
import { pluck } from 'rxjs/operators';

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
  constructor(public dialogRef: MatDialogRef<SessionDetailsComponent>, @Inject(MAT_DIALOG_DATA) private data,
    private userService: UserService, public learnerService: LearnerService,
    public config: ConfigService) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.sessions = this.data.sessionData;
    this.participants = this.sessions.hasOwnProperty('participant') ? this.sessions.participant : {};
    this.userIds = Object.keys(this.participants);
    for (const userId of this.userIds) {
      this.getParticipantsDetails(userId);
    }
  }

  getParticipantsDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    response.subscribe(data => {
      console.log('data', data);
      this.participantsDetails.push(data);
    }
    );
  }
}

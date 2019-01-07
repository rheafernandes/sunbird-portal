import { Component, OnInit, OnDestroy } from '@angular/core';
import * as CanvasJS from './canva.min.js';
import { MatDialog } from '@angular/material';
import { SessionDetailsComponent } from '../session-details/session-details.component.js';
import { SessionService } from '../../services/session/session.service.js';
import { ActivatedRoute } from '@angular/router';
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit, OnDestroy {

  constructor(public dialog: MatDialog, private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private learnerService: LearnerService,
    public config: ConfigService) { }
  session;
  sessionId;
  participantsDetails = [];

  ngOnInit() {
    const sessionId = this.activatedRoute.params.subscribe(params => this.sessionId = params.sessionId);
    this.sessionService.getSessionById(this.sessionId).subscribe((session: any) => {
      this.session = session;
      session.sessionDetails.attendees.forEach((participant) => {
        this.getParticipantsDetails(participant.id);
      });

    }, null, () => {
      const chart = new CanvasJS.Chart('chartContainer', {
        theme: 'light2',
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: 'Attendance'
        },
        data: [{
          type: 'pie',
          showInLegend: true,
          toolTipContent: '<b>{label}</b>: {y} (#percent%)',
          indexLabel: '{name} - #percent%',
          dataPoints: [
            { y: this.session.sessionDetails.participantCount, name: 'Participants Percentage' , label: 'Participants' },
            { y: this.session.sessionDetails.enrolledCount, name: 'Enrolled Percentage' , label : 'Joined' }
          ]
        }]
      });
      chart.render();
    });
  }
  participantDetails() {
    const participantDetailDialog = this.dialog.open(SessionDetailsComponent, {
      width: '50%',
      height: '70%',
      // data: { sessionData: session }
    });
    participantDetailDialog.afterClosed().subscribe(result => {
    });
  }


  getParticipantsDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    response.subscribe(data => {
      this.participantsDetails.push(data);
    }
    );
  }

  ngOnDestroy() {
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionDetailsComponent } from '../session-details/session-details.component';
import * as CanvasJS from './canva.min.js';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  sessions;
  participants;

  // participantsDetails = [];
  constructor( public dialogRef: MatDialogRef<AttendanceComponent>,  @Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
    this.sessions = this.data.sessions;
    this.participants = this.sessions.sessionDetails.participants;
    console.log('p ts', this.participants);
    console.log('s', this.data);
    const participantsCount = this.sessions.sessionDetails.participantCount;
    const enrolledCount = this.sessions.sessionDetails.enrolledCount;
    console.log('p count' , participantsCount);
    console.log('e count' , enrolledCount);
    const enrolledPercentage = ( enrolledCount / participantsCount ) * 100 ;
    const participantPercentage = 100 - enrolledPercentage ;
    console.log('p per', participantPercentage );
    console.log('e per', enrolledPercentage );
    // console.log('user details', this.participantsDetails);
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
        toolTipContent: '<b>{name}</b>: ${y} (#percent%)',
        indexLabel: '{name} - #percent%',
        dataPoints: [
          { y: participantsCount , name: 'Participant Percentage'},
          { y: enrolledCount, name: 'Enrolled Percentage'}
        ]
      }]
  });
  chart.render();

  // const chart = new CanvasJS.Chart('chartContainer', {
  //   theme: 'light2',
  //   animationEnabled: true,
  //   exportEnabled: true,
  //   title: {
  //     text: 'Monthly Expense'
  //   },
  //   data: [{
  //     type: 'pie',
  //     showInLegend: true,
  //     toolTipContent: '<b>{name}</b>: ${y} (#percent%)',
  //     indexLabel: '{name} - #percent%',
  //     dataPoints: [
  //       { y: 450, name: 'Food' },
  //       { y: 120, name: 'Insurance' },
  //       { y: 300, name: 'Traveling' },
  //       { y: 800, name: 'Housing' },
  //       { y: 150, name: 'Education' },
  //       { y: 150, name: 'Shopping'},
  //       { y: 250, name: 'Others' }
  //     ]
  //   }]
  // });
  // chart.render();
    }
  }



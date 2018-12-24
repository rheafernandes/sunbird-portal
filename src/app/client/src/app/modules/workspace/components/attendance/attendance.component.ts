import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canva.min.js';
import { MatDialog } from '@angular/material';
import { SessionDetailsComponent } from '../session-details/session-details.component.js';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
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
          { y: 100 , name: 'Unenrolled Percentage'},
          { y: 120, name: 'Enrolled Percentage'}
        ]
      }]
  });
  chart.render();
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
}

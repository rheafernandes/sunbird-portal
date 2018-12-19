import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  constructor( public dialogRef: MatDialogRef<SessionDetailsComponent>) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }


}

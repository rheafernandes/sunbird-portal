import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  sessions;
  constructor( public dialogRef: MatDialogRef<SessionDetailsComponent>,  @Inject(MAT_DIALOG_DATA) private data) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.sessions = this.data.sessionData;
    console.log('sedjsfnsbjfnmdgfmer', this.data);
  }


}

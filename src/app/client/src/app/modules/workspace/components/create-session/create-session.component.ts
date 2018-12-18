import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {

  existingSessionFlag: Boolean;

  constructor(
    public dialogRef: MatDialogRef<CreateSessionComponent>,
    @Inject(MAT_DIALOG_DATA) private data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.existingSessionFlag = true;
    if ('createSession' in this.data) {
      this.existingSessionFlag = false;
    }

  }

}

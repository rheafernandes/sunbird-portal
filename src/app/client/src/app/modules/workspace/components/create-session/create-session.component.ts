import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {

  existingSessionFlag: Boolean;
  batchData;
  sessionId;
  constructor(
    public dialogRef: MatDialogRef<CreateSessionComponent>,
    @Inject(MAT_DIALOG_DATA) private data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    if (this.data.create) {
      this.existingSessionFlag = false;
      this.batchData = this.data.sessionData;
    } else {
      this.existingSessionFlag = true;
      this.sessionId = this.data.sessionData;
    }
  }

  // used to save the session delta for creating a new session
  save(formElement, status) {
    // creates the session delta
    const sessionDelta = Object.assign({
      status: status, participantCount: Object.keys(this.batchData.participant).length,
      enrolledCount: 0, participants: this.batchData.participant, createdBy: 'ravinder'
    }, formElement.value);

    // addes the session delta to the batch details object
    const result = Object.assign({ sessionDetails: sessionDelta }, this.batchData);
    console.log('session Delta', result);
    console.log('json batchData', JSON.stringify(sessionDelta));
  }
}

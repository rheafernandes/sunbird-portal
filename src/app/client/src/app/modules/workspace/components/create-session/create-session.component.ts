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

  // used to save the session delta for creating a new session
  save(formElement) {
    // const sessionDelta = Object.assign({status:"draft" , participantCount:this.data.label , 
    // enrolledCount:0 , participants: this.data.participant , createdBy:"ravinder"} , formElement.value)
    // const result = Object.assign({ sessionDetails: formElement.value }, this.data.createSession);
    // console.log("form", result);
  }

}

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CourseConsumptionService } from '../../../learn/services';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css'],
  // providers: [CourseConsumptionService]
})
export class CreateSessionComponent implements OnInit, OnDestroy {

  existingSessionFlag: Boolean;
  course: any;
  courseid: any;
  coursechapters;
  batchData;
  session;
  constructor(private courseConsumptionService: CourseConsumptionService,
    public dialogRef: MatDialogRef<CreateSessionComponent>,
    @Inject(MAT_DIALOG_DATA) private data, private sessionService: SessionService) { }

  onNoClick(): void {
    this.dialogRef.close();
    this.ngOnDestroy();
  }
  ngOnInit() {
    if (this.data.create) {
      this.existingSessionFlag = false;
      this.batchData = this.data.sessionData;
      console.log('Batch Details for session', this.batchData);
      this.courseid = this.data.sessionData.courseId;
    } else {
      this.existingSessionFlag = true;
      this.session = this.data.sessionData;
      this.courseid = this.data.sessionData.courseId;
      console.log('Session details', this.session);
    }
    this.getCourseUnits();
  }

  // used to save the session delta for creating a new session
  saveSession(formElement, status) {
    // creates the session delta
    console.log('form data ' , formElement);
    const sessionDelta = Object.assign({
      status: status, participantCount: this.batchData.hasOwnProperty('participant') ? Object.keys(this.batchData.participant).length : 0,
      enrolledCount: 0, participants: this.batchData.hasOwnProperty('participant') ? this.batchData.participant : {}, createdBy: 'ravinder'
    }, formElement.value);

    // addes the session delta to the batch details object
    const resultBatchData = Object.assign({ sessionDetails: sessionDelta }, this.batchData);
    this.sessionService.addSession(resultBatchData);
    this.onNoClick();
  }

  updateSession(form) {
    const sessionDelta = Object.assign({}, this.session.sessionDetails, form.value);
    const resultBatchData = Object.assign({}, this.session);
    resultBatchData.sessionDetails = sessionDelta;
    console.log('Resultant batch delta', resultBatchData);
    this.sessionService.updateSession(resultBatchData);
    this.onNoClick();
  }

  getCourseUnits() {
    this.courseConsumptionService.getCourseHierarchy(this.courseid)
      .subscribe(
        (response: any) => {
          this.course = response;
          this.coursechapters = this.course.children;
        }
      );
  }

  ngOnDestroy() {
  }
}

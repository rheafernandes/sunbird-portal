import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CourseConsumptionService } from '../../../learn/services';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css'],
  // providers: [CourseConsumptionService]
})
export class CreateSessionComponent implements OnInit {

  existingSessionFlag: Boolean;
  course: any;
  courseid: any;
  coursechapters;
  batchData;
  sessionId;
  model = 'est name';
  constructor(private courseConsumptionService: CourseConsumptionService,
    public dialogRef: MatDialogRef<CreateSessionComponent>,
    @Inject(MAT_DIALOG_DATA) private data, private formbuilder: FormBuilder) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    if (this.data.create) {
      this.existingSessionFlag = false;
      this.batchData = this.data.sessionData;
      this.courseid = this.data.sessionData.courseId;
      this.getCourseUnits();
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

  getCourseUnits() {
    this.courseConsumptionService.getCourseHierarchy(this.courseid)
      .subscribe(
        (response: any) => {
          this.course = response;
          this.coursechapters = this.course.children;
        }
      );
  }
}

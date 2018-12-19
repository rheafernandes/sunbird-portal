import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {CourseConsumptionService} from '../../../learn/services';

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
  constructor(private courseConsumptionService: CourseConsumptionService,
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
    console.log('meta data', this.data);
    this.courseid = this.data.createSession.courseId;
    this.getCourseUnits();
  }

  getCourseUnits() {
    this.courseConsumptionService.getCourseHierarchy(this.courseid)
    .subscribe(
      (response: any) => {
        this.course = response;
        this.coursechapters = this.course.children;
        console.log('khdjwhsefdsfesjfhe', this.course);
      }
    );
    }
}

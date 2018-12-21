import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SessionDetailsComponent } from '../../workspace/components/session-details/session-details.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-list-sessions',
  templateUrl: './list-sessions.component.html',
  styleUrls: ['./list-sessions.component.css']
})
export class ListSessionsComponent implements OnInit {
  sessionsList;
  step = 0;
  constructor(public dialogRef: MatDialogRef<ListSessionsComponent>, public dialog: MatDialog, public overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
    this.sessionsList = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  openLink(): void {

  }
    setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  openSessionDetail(): void {
    const dialogRef = this.dialog.open(SessionDetailsComponent, {
      width: '50%',
      height: '70%',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    dialogRef.afterClosed().subscribe(result => {
console.log('result', result);
    });
  }

}

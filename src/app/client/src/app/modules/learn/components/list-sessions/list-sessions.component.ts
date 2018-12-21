import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SessionDetailsComponent } from '../../../workspace/components/session-details/session-details.component';

@Component({
  selector: 'app-list-sessions',
  templateUrl: './list-sessions.component.html',
  styleUrls: ['./list-sessions.component.css']
})
export class ListSessionsComponent implements OnInit {
  sessionsList;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ListSessionsComponent>,
    @Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
    this.sessionsList = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  openLink(): void {

  }

  openSession(session): void {
    const sessionDialog = this.dialog.open(SessionDetailsComponent, {
      width: '50%',
      height: '70%',
      data: { sessionData: session }
    });
    sessionDialog.afterClosed().subscribe(result => {
    });
  }

  joinSession(session) {
    console.log('Session to join', session);
  }
}

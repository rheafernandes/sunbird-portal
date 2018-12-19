import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateSessionComponent } from '../create-session/create-session.component';
import { SessionDetailsComponent } from '../session-details/session-details.component';
@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateSessionComponent, {
      width: '50%',
      data: { updateSession: 'this' }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openSession(): void {
    const sessionDialog = this.dialog.open(SessionDetailsComponent, {
      width: '50%',
    });
    sessionDialog.afterClosed().subscribe(result => {
    });
  }
}


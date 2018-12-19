import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateSessionComponent } from '../create-session/create-session.component';
import { SessionService } from '../../services/session/session.service';
@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  constructor(public dialog: MatDialog, private sessionService: SessionService) { }
  sessionsList;
  ngOnInit() {
    this.sessionService.getSessions().subscribe((sessions) => {
      this.sessionsList = sessions;
    });
  }

  openDialog(session): void {
    const dialogRef = this.dialog.open(CreateSessionComponent, {
      width: '50%',
      data: { sessionData: session, create: false }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  deleteSession(session) {
    this.sessionService.deleteSession(session);
  }

  publish(session) {
    console.log('published');
    this.sessionService.publishSession(session);
  }
}

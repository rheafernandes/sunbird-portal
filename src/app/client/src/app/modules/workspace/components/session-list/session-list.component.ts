import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateSessionComponent } from '../create-session/create-session.component';
<<<<<<< HEAD
import { SessionDetailsComponent } from '../session-details/session-details.component';
=======
import { SessionService } from '../../services/session/session.service';
>>>>>>> 1e84481fc6b15fb13b0cc2ce562d933630407e9f
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

  openSession(): void {
    const sessionDialog = this.dialog.open(SessionDetailsComponent, {
      width: '50%',
    });
    sessionDialog.afterClosed().subscribe(result => {
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


import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateSessionComponent } from '../create-session/create-session.component';
import { SessionService } from '../../services/session/session.service';

import { SessionDetailsComponent } from '../session-details/session-details.component';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { UserService } from '@sunbird/core';
import { ToasterService } from '../../../shared/services/toaster/toaster.service';
@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {
  constructor(private userService: UserService, private toasterService: ToasterService, public dialog: MatDialog,
    private sessionService: SessionService) { }
  sessionsList = [];
  ngOnInit() {
    this.sessionService.getSessions(this.userService.userid).subscribe((data: any) => {
      this.sessionsList = data.sessions;
    });
  }

  openDialog(session): void {
    if (session.sessionDetails.status === 'published') {
      this.toasterService.error('You cannot update a published session');
    } else {
      const dialogRef = this.dialog.open(CreateSessionComponent, {
        width: '50%',
        height: '100%',
        data: { sessionData: session, create: false }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
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
  deleteSession(session) {
    this.sessionService.deleteSession(session);
  }

  publish(session) {
    console.log('published');
    this.sessionService.publishSession(session);
  }

  showValues(value) {
    console.log('form data', value);
  }
}


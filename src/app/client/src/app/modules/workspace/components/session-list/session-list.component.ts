import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateSessionComponent } from '../create-session/create-session.component';
import { SessionService } from '../../services/session/session.service';

import { SessionDetailsComponent } from '../session-details/session-details.component';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { ToasterService } from '../../../shared/services/toaster/toaster.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {
  constructor(private toasterService: ToasterService, public dialog: MatDialog, private sessionService: SessionService) { }
  sessionsList;
  views = new FormControl();
  currentView = [];
  viewsList: string[] = ['startDate', 'endDate', 'time', 'status', 'attendance'];

  ngOnInit() {
    this.views.valueChanges.subscribe((data) => {
      localStorage['VIEW_CONTROL'] = JSON.stringify(data);
      this.currentView = data;
    });
    this.sessionService.getSessions().subscribe((sessions) => {
      this.sessionsList = sessions;
    });

    if (localStorage.getItem('VIEW_CONTROL') !== null) {
      this.currentView = JSON.parse(localStorage.getItem('VIEW_CONTROL'));
    }
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

  storeSession() {
    this.sessionService.storeSessions();
  }

  showValues(value) {
    console.log('form data', value);
  }

  view(attr) {
    if (this.currentView.length === 0) {
      return true;
    }
    return this.currentView.includes(attr);
  }

}


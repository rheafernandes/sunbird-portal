import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SessionDetailsComponent } from '../../../workspace/components/session-details/session-details.component';
import { SessionService } from '../../../workspace/services/session/session.service';
import { UserService } from '@sunbird/core';
import { ToasterService } from '../../../shared/services/toaster/toaster.service';

@Component({
  selector: 'app-list-sessions',
  templateUrl: './list-sessions.component.html',
  styleUrls: ['./list-sessions.component.css']
})
export class ListSessionsComponent implements OnInit {
  sessionsList;
  // true indicates that user is already part of session and vice versa
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ListSessionsComponent>,
    @Inject(MAT_DIALOG_DATA) private data, private sessionService: SessionService,
    private userService: UserService, private toasterService: ToasterService) { }

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

  checkIfAlreadyJoined(session) {
    if (session.sessionDetails.attendees.findIndex((participant) => {
      if (participant.id === this.userService.userid) {
        return true;
      } else {
        return false;
      }
    }) === -1) {
      return false;
    } else {
      return true;
    }
  }

  joinSession(session) {
    if (!this.checkIfAlreadyJoined(session)) {
      this.sessionService.joinSession(this.userService.userid, session);
    } else {
      this.toasterService.error('you already joined this session');
    }
  }
}

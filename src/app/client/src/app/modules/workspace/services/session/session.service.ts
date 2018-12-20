import { Injectable } from '@angular/core';
import { of } from 'rxjs';
// import { ToasterService } from 'src/app/modules/shared';
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessions = [];
  constructor() {
  }

  // create session
  addSession(sessionDelta) {
    this.sessions.push(sessionDelta);
    // this.toasterService.info("session successfully added");
  }

  // returns all sessions
  getSessions() {
    return of(this.sessions);
  }

  updateSession(session) {
    const batchId = session.identifier;
    const courseId = session.courseId;
    const courseUnitId = session.sessionDetails.courseUnit;
    const batchIndex = this.sessions.findIndex((batch) => {
      if (batch.identifier === batchId && batch.courseId === courseId && batch.sessionDetails.courseUnit === courseUnitId) {
        return true;
      }
      return false;
    });

    this.sessions[batchIndex] = session;
    // this.toasterService.info("session successfully updated");

  }

  deleteSession(session) {
    const batchId = session.identifier;
    const courseId = session.courseId;
    const courseUnitId = session.sessionDetails.courseUnit;
    const batchIndex = this.sessions.findIndex((batch) => {
      if (batch.identifier === batchId && batch.courseId === courseId && batch.sessionDetails.courseUnit === courseUnitId) {
        return true;
      }
      return false;
    });
    this.sessions.splice(batchIndex, 1);
    // this.toasterService.info("session successfully removed");

  }


  publishSession(session) {
    const batchId = session.identifier;
    const courseId = session.courseId;
    const courseUnitId = session.sessionDetails.courseUnit;
    const batchIndex = this.sessions.findIndex((batch) => {
      if (batch.identifier === batchId && batch.courseId === courseId && batch.sessionDetails.courseUnit === courseUnitId) {
        return true;
      }
      return false;
    });
    this.sessions[batchIndex].sessionDetails.status = 'published';
    // this.toasterService.info("session successfully published");

  }



}

import { Injectable } from '@angular/core';
import { of } from 'rxjs';
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
  }



}

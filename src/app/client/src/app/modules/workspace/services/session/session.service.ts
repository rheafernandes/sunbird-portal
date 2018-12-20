import { Injectable, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnInit {

  sessions = [];
  constructor() {
  }


  ngOnInit() {
    this.sessions.push(JSON.parse(localStorage.getItem('sessions')));
  }

  addSession(sessionDelta) {
    console.log('new session', sessionDelta);
    this.sessions.push(sessionDelta);
  }

  storeSessions() {
    localStorage.setItem('sessions', JSON.stringify(this.sessions));
  }

  getSessions() {
    return of(this.sessions);
  }

  getSessionsFilter(batchId, courseId) {
    return of(this.sessions).pipe(
      filter((batch: any) => {
        if (batch.id === batchId && batch.courseID === courseId && batch.sessionDetails.status === 'published') {
          return true;
        } else {
          return false;
        }
      }));
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

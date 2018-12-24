import { Injectable, OnInit } from '@angular/core';
import { of, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ToasterService } from '../../../shared/services/toaster/toaster.service';
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessions = [];
  constructor(private toasterService: ToasterService) {
    if (localStorage.getItem('sessions') !== null) {
      this.sessions = JSON.parse(localStorage.getItem('sessions'));
    }
  }

  addSession(sessionDelta) {
    console.log('new session', sessionDelta);
    this.sessions.push(sessionDelta);
  }

  storeSessions() {
    if (localStorage.getItem('sessions') !== null) {
      localStorage.removeItem('sessions');
      localStorage.setItem('sessions', JSON.stringify(this.sessions));
    } else {
      localStorage.setItem('sessions', JSON.stringify(this.sessions));
    }
  }

  getSessions() {
    return of(this.sessions);
  }

  getSessionsFilter(batchId, courseId) {
    return from(this.sessions).pipe(
      filter((batch: any) => {
        if (batch.id === batchId && batch.courseId === courseId && batch.sessionDetails.status === 'published') {
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
    this.storeSessions();
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


  joinSession(userId, session) {
    console.log('sessionService : userID', userId);
    console.log('sessionService : session', session);
    const eligibilty = Object.keys(session.participant).includes(userId);
    if (eligibilty) {

      const batchId = session.identifier;
      const courseId = session.courseId;
      const courseUnitId = session.sessionDetails.courseUnit;
      const batchIndex = this.sessions.findIndex((batch) => {
        if (batch.identifier === batchId && batch.courseId === courseId && batch.sessionDetails.courseUnit === courseUnitId) {
          return true;
        }
        return false;
      });

      const attendee = {
        id: userId,
        joinedAt: new Date()
      };

      const updatedSession = this.sessions[batchIndex];
      updatedSession.sessionDetails.attendees.push(attendee);
      updatedSession.sessionDetails.enrolledCount = updatedSession.sessionDetails.attendees.length;
      this.updateSession(updatedSession);
      console.log('attendance captured', updatedSession.sessionDetails);
    } else {
      this.toasterService.error('you are not eligible to join the session');
    }
  }
}

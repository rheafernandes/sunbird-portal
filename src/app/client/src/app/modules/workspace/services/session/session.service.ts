import { Injectable, OnInit } from '@angular/core';
import { of, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessions = [];
  constructor(private http: HttpClient) {
    // if (localStorage.getItem('sessions') !== null) {
    //   this.sessions = JSON.parse(localStorage.getItem('sessions'));
    // }
  }

  addSession(sessionDelta: {}): any {
    // console.log('new session', JSON.stringify(sessionDelta));
    const result = this.http.post('http://13.233.213.245:8080/create-session', sessionDelta);
    result.subscribe((data) => {
      console.log(data);
    }, (err) => {
      console.log('Error', err);
    });
  }

  storeSessions() {
    if (localStorage.getItem('sessions') !== null) {
      localStorage.removeItem('sessions');
      localStorage.setItem('sessions', JSON.stringify(this.sessions));
    } else {
      localStorage.setItem('sessions', JSON.stringify(this.sessions));
    }
  }

  getSessions(userId) {
    // return of(this.sessions);
    return this.http.post('http://13.233.213.245:8080/user-sessions', { 'userId': userId });
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
    // const batchId = session.identifier;
    // const courseId = session.courseId;
    // const courseUnitId = session.sessionDetails.courseUnit;
    // const batchIndex = this.sessions.findIndex((batch) => {
    //   if (batch.identifier === batchId && batch.courseId === courseId && batch.sessionDetails.courseUnit === courseUnitId) {
    //     return true;
    //   }
    //   return false;
    // });
    // this.sessions[batchIndex] = session;
    this.http.post('http://13.233.213.245:8080/update-session', session).subscribe((data) => {
      console.log('updated method called', data);
    });
  }

  deleteSession(session) {
    // const batchId = session.identifier;
    // const courseId = session.courseId;
    // const courseUnitId = session.sessionDetails.courseUnit;
    // const batchIndex = this.sessions.findIndex((batch) => {
    //   if (batch.identifier === batchId && batch.courseId === courseId && batch.sessionDetails.courseUnit === courseUnitId) {
    //     return true;
    //   }
    //   return false;
    // });
    // this.sessions.splice(batchIndex, 1);

    console.log('delete session ' , session);

    this.http.post('http://13.233.213.245:8080/delete-session', session).subscribe((data) => {
      console.log('deletion methods caled', data);
    });

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

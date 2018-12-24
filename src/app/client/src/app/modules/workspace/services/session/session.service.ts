import { Injectable, OnInit } from '@angular/core';
import { of, from } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToasterService } from '../../../shared/services/toaster/toaster.service';
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessions = [];
  constructor(private http: HttpClient, private toasterService: ToasterService) {
  }

  addSession(sessionDelta: {}): any {
    const result = this.http.post('http://13.233.213.245:8080/create-session', sessionDelta);
    result.subscribe((data) => {
      console.log(data);
    }, (err) => {
      console.log('Error', err);
    });
  }

  getSessions(userId) {
    return this.http.post('http://13.233.213.245:8080/user-sessions', { 'userId': userId })
      .pipe(tap((data) => {
        console.log('Response from API', data);
      }));
  }

  getSessionsFilter(batchId, courseId) {
    return this.http.post('http://13.233.213.245:8080/getsessions', { 'batchId': batchId });
  }

  updateSession(session) {
    this.http.post('http://13.233.213.245:8080/update-session', session).subscribe((data) => {
      console.log('updated method called', data);
    });
  }

  deleteSession(session) {
    this.http.post('http://13.233.213.245:8080/delete-session', session).subscribe((data) => {
      console.log('deletion methods caled', data);
    });
  }

  publishSession(session) {
    session.sessionDetails.status = 'published';
    this.updateSession(session);
  }

  joinSession(userId, session) {
    console.log('sessionService : userID', userId);
    console.log('sessionService : session', session);
    const eligibilty = Object.keys(session.participant).includes(userId);
    if (eligibilty) {
      const attendee = {
        id: userId,
        joinedAt: new Date()
      };
      session.sessionDetails.attendees.push(attendee);
      session.sessionDetails.enrolledCount = session.sessionDetails.attendees.length;
      this.updateSession(session);
      console.log('attendance captured for', session.sessionDetails);
    } else {
      this.toasterService.error('you are not eligible to join the session');
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateBatchService {
   url = 'http://13.233.213.245:8080';
  //url = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  updateMentors(request): Observable<{}> {
  return this.http.post(`${this.url}/update-batch`, request);
  }
  getMentors(request): Observable<{}> {
    return this.http.post(`${this.url}/fetch-batch`, request);
  }
}

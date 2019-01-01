import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { updateBatchDetails } from '../../components/batch/update-course-batch/update-course-batch.component.data';

@Injectable({
 providedIn: 'root'
})
export class UpdateBatchService {
 url = 'http://localhost:8080';
 constructor(private http: HttpClient) { }

 updateMentors(request) {
 this.http.post(`${this.url}/updateBatch`, request).subscribe(data => {
   console.log('requst', data);
 });
 }
}

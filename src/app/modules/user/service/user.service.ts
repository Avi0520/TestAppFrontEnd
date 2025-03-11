import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const BASIC_URL ="http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http :HttpClient) { }

    getAllTest(): Observable<any> {
      return this.http.get(BASIC_URL + `api/test`);
    }
    
    getAllQuestion(id:number): Observable<any> {
      return this.http.get(BASIC_URL + `api/test/${id}`);
    }

    submitTest(data: any): Observable<any> {
      return this.http.post(BASIC_URL + `api/test/submit-test`, data);
    }

    getTestResult(resultId: string): Observable<any> {
      return this.http.get(BASIC_URL + `api/test/results/${resultId}`);
    }
}

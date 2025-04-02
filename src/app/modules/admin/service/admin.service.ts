import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const BASIC_URL ="http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private http: HttpClient) { }

// Correct (using backticks)
createTest(testDto: any, courseId: number): Observable<any> {
  return this.http.post(`${BASIC_URL}api/test/course/${courseId}`, testDto);
}

  getAllTest(): Observable<any> {
    return this.http.get(BASIC_URL + `api/test`);
  }

  addQuestion(questionDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/questions/add', questionDto, { responseType: 'text' });
  }

  getAllQuestion(id:number): Observable<any> {
    return this.http.get(BASIC_URL + `api/test/${id}`);
  }

  getAllTestResults(): Observable<any> {
    return this.http.get(BASIC_URL + `api/test/results`);
  }

  uploadQuestions(formData: FormData): Observable<any> {
    return this.http.post(BASIC_URL + 'api/questions/upload', formData, { responseType: 'text' });
  }

  updateTest(id: number, testDto: any): Observable<any> {
    return this.http.put(`${BASIC_URL}api/test/${id}`, testDto);
}
  
  getTestById(id: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/test/details/${id}`); // Use the new endpoint
  }

  getQuestionById(id: number): Observable<any> {
    return this.http.get<any>(`${BASIC_URL}api/questions/${id}`);
  }

  // Update a question
  updateQuestion(id: number, question: any): Observable<any> {
    return this.http.put(`${BASIC_URL}api/questions/update/${id}`, question);
  }
}

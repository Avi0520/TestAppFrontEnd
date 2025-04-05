import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<any> {
    return this.http.get(BASIC_URL + "api/courses");
  }

  createCourse(course: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/courses", course);
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/courses/${id}`);
  }

  updateCourse(id: number, course: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/courses/${id}`, course);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/courses/${id}`);
  }
}
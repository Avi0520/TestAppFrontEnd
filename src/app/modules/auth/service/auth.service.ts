import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserStorageService } from './user-stoarage.service';


const BASIC_URL = "http://localhost:8080/"; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registerWithCourses(userData: any, courseIds: number[]): Observable<any> {
    const request = {
      user: userData,
      courseIds: courseIds
    };
    return this.http.post(BASIC_URL + "api/auth/sign-up", request);
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/auth/login", loginRequest).pipe(
      tap((response: any) => {
        // Store user data including courses
        UserStorageService.saveUser(response);
      })
    );
  }
}

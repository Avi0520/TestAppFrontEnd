import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../service/auth.service';
import { CourseService } from '../../../course-service.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  validateForm!: FormGroup;
  courses: any[] = [];
  selectedCourses: number[] = [];
  isLoading = false; // Add this line to declare the property

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {  
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]],
    });
    
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: (error) => {
        this.message.error('Failed to load courses');
        this.isLoading = false;
      }
    });
  }

  submitForm() {
    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.selectedCourses.length === 0) {
      this.message.error('Please select at least one course');
      return;
    }

    this.isLoading = true;
    const userData = this.validateForm.value;
    
    this.authService.registerWithCourses(userData, this.selectedCourses).subscribe({
      next: (res) => {
        this.message.success('Registration successful!');
        this.router.navigateByUrl("/login");
        this.isLoading = false;
      },
      error: (error) => {
        this.message.error(error.error?.message || 'Registration failed');
        this.isLoading = false;
      }
    });
  }
}
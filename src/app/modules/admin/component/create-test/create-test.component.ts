import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { CourseService } from '../../../../course-service.service';
import { SharedModule } from '../../../shared/shared/shared.module';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css']
})
export class CreateTestComponent {
  testForm: FormGroup;
  courses: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private courseService: CourseService,
    private notification: NzNotificationService,
    private router: Router
  ) {
    this.testForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      time: ['', [Validators.required, Validators.min(1)]],
      courseId: [null, Validators.required]  // Changed to null and required
    });
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (res) => {
        this.courses = res;
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.error('ERROR', 'Failed to load courses', { nzDuration: 5000 });
        this.isLoading = false;
      }
    });
  }

  submitForm() {
    if (this.testForm.valid) {
      this.isLoading = true;
      const { courseId, ...testData } = this.testForm.value;
      
      this.adminService.createTest(testData, courseId).subscribe({
        next: (res) => {
          this.notification.success('SUCCESS', 'Test created successfully!', { nzDuration: 5000 });
          this.router.navigate(['/admin/dashboard']);
          this.isLoading = false;
        },
        error: (error) => {
          this.notification.error('ERROR', error.error?.message || 'Failed to create test', { nzDuration: 5000 });
          this.isLoading = false;
        }
      });
    } else {
      Object.values(this.testForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SharedModule } from '../../../shared/shared/shared.module';

@Component({
  selector: 'app-edit-test',
    standalone: true,
    imports: [SharedModule],
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.css']
})
export class EditTestComponent implements OnInit {
  testForm!: FormGroup; // Form group for the test details
  testId!: number; // ID of the test to be edited

  constructor(
    private fb: FormBuilder, // FormBuilder for creating reactive forms
    private route: ActivatedRoute, // ActivatedRoute to get route parameters
    private router: Router, // Router for navigation
    private adminService: AdminService, // Service to interact with the backend
    private notification: NzNotificationService // Notification service for showing messages
  ) {}

  ngOnInit(): void {
    // Get the test ID from the route parameters
    this.testId = this.route.snapshot.params['id'];
    console.log('Test ID:', this.testId); // Debug: Log the test ID

    // Initialize the form with validation rules
    this.testForm = this.fb.group({
      title: ['', Validators.required], // Title is required
      description: ['', Validators.required], // Description is required
      time: ['', [Validators.required, Validators.min(1)]] // Time is required and must be greater than 0
    });

    // Load the test data into the form
    this.loadTestData();
  }

  // Fetch the test data from the backend and populate the form
  loadTestData(): void {
    this.adminService.getTestById(this.testId).subscribe(
      (res: any) => {
        console.log('API Response:', res); // Debug: Log the API response
        // Populate the form with the fetched data
        this.testForm.patchValue({
          title: res.title,
          description: res.description,
          time: res.time
        });
      },
      error => {
        console.error('API Error:', error); // Debug: Log the error
        // Show an error notification
        this.notification.error('ERROR', 'Failed to load test data', { nzDuration: 5000 });
      }
    );
  }

  // Handle form submission
  onSubmit(): void {
    if (this.testForm.valid) {
      // Call the updateTest method in the AdminService
      this.adminService.updateTest(this.testId, this.testForm.value).subscribe(
        res => {
          // Show a success notification
          this.notification.success('SUCCESS', 'Test updated successfully', { nzDuration: 5000 });
          // Navigate back to the dashboard
          this.router.navigate(['/admin/dashboard']);
        },
        error => {
          // Show an error notification
          this.notification.error('ERROR', 'Failed to update test', { nzDuration: 5000 });
        }
      );
    } else {
      // Mark all form fields as touched to display validation errors
      this.testForm.markAllAsTouched();
    }
  }
}
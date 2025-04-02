import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor and *ngIf

@Component({
  selector: 'app-edit-question',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add ReactiveFormsModule and CommonModule
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  editQuestionForm!: FormGroup; // Form group for editing the question
  testId!: number; // Test ID from the route
  questionId!: number; // Question ID from the route
  questionTypes = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE']; // Available question types

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get testId and questionId from the route
    this.testId = +this.activatedRoute.snapshot.params['testId'];
    this.questionId = +this.activatedRoute.snapshot.params['id'];

    // Initialize the form
    this.editQuestionForm = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['', Validators.required],
      options: this.fb.array([], Validators.required), // Dynamic array for options
      correctAnswer: ['', Validators.required]
    });

    // Fetch the question details
    this.fetchQuestionDetails();
  }

  // Fetch question details by ID
  fetchQuestionDetails(): void {
    this.adminService.getQuestionById(this.questionId).subscribe(
      (res: any) => {
        console.log("Question Details:", res);

        // Patch the form with the fetched question details
        this.editQuestionForm.patchValue({
          questionText: res.questionText,
          questionType: res.questionType,
          correctAnswer: res.correctAnswer.join(', ') // Convert array to string
        });

        // Add options to the form
        res.options.forEach((option: any) => {
          this.addOption(option.optionText);
        });
      },
      (error) => {
        console.error("Error fetching question details:", error);
        alert('Failed to fetch question details.'); // Use alert for error messages
      }
    );
  }

  // Getter for the options FormArray
  get options(): FormArray {
    return this.editQuestionForm.get('options') as FormArray;
  }

  // Add an option to the form
  addOption(optionText: string = ''): void {
    this.options.push(this.fb.control(optionText, Validators.required));
  }

  // Remove an option from the form
  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  // Handle form submission
  onSubmit(): void {
    if (this.editQuestionForm.invalid) {
      alert('Please fill all required fields.'); // Use alert for validation messages
      return;
    }

    // Prepare the updated question data
    const updatedQuestion = {
      ...this.editQuestionForm.value,
      correctAnswer: this.editQuestionForm.value.correctAnswer
        .split(',')
        .map((answer: string) => answer.trim()), // Convert string to array
      options: this.editQuestionForm.value.options.map((optionText: string) => ({
        optionText: optionText, // Convert strings to OptionDto objects
      })),
      test: { id: this.testId } // Include the test ID
    };

    // Log the payload for debugging
    console.log('Updated Question Payload:', updatedQuestion);

    // Call the API to update the question
    this.adminService.updateQuestion(this.questionId, updatedQuestion).subscribe(
      (res: any) => {
        alert('Question updated successfully!'); // Use alert for success message
        this.router.navigate(['/admin/view-test', this.testId]); // Navigate back to the test view
      },
      (error) => {
        console.error("Error updating question:", error);
        alert('Failed to update question.'); // Use alert for error messages
      }
    );
  }
}
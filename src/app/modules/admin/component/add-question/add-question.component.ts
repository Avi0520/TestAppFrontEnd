import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SharedModule } from '../../../shared/shared/shared.module';

@Component({
  selector: 'app-add-question',
  standalone: true,
    imports: [SharedModule],
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  questionForm!: FormGroup;
  testId!: number;

  // Question types
  questionTypes = [
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { value: 'SINGLE_CHOICE', label: 'Single Choice' },
    { value: 'TRUE_FALSE', label: 'True/False' }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.testId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
  }

  // Initialize the form
  initializeForm(): void {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['MULTIPLE_CHOICE', Validators.required],
      options: this.fb.array([]), // Array of strings
      correctAnswer: this.fb.array([])
    });
  
    // Add default options for multiple-choice
    this.addOption();
    this.addOption();
  }
  // Getter for options FormArray
  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  // Getter for correctAnswer FormArray
  get correctAnswer(): FormArray {
    return this.questionForm.get('correctAnswer') as FormArray;
  }

  // Add a new option
  addOption(): void {
    this.options.push(this.fb.control('', Validators.required));
  }
  
  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  // Handle question type change
  onQuestionTypeChange(): void {
    const questionType = this.questionForm.get('questionType')?.value;

    // Clear existing options and correct answers
    this.options.clear();
    this.correctAnswer.clear();

    if (questionType === 'TRUE_FALSE') {
      // Add True and False options
      this.options.push(this.fb.control('True', Validators.required));
      this.options.push(this.fb.control('False', Validators.required));
    } else {
      // Add default options for multiple/single choice
      this.addOption();
      this.addOption();
    }
  }

  onCorrectAnswerChange(event: any, index: number): void {
    const questionType = this.questionForm.get('questionType')?.value;
    const selectedValue = this.options.at(index).value;

    if (questionType === 'MULTIPLE_CHOICE') {
      const correctAnswers = this.correctAnswer.value;
      if (event.target.checked) {
        this.correctAnswer.push(this.fb.control(selectedValue));
      } else {
        const indexToRemove = correctAnswers.indexOf(selectedValue);
        if (indexToRemove !== -1) {
          this.correctAnswer.removeAt(indexToRemove);
        }
      }
    } else {
      // For single choice and true/false
      this.correctAnswer.clear();
      this.correctAnswer.push(this.fb.control(selectedValue));
    }
  }
  

  // Submit the form
  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.notification.error('Error', 'Please fill all required fields.');
      return;
    }
  
    // Map options to OptionDto objects
    const options = this.questionForm.value.options.map((optionText: string) => ({
      optionText: optionText
    }));
  
    const questionDto = {
      questionText: this.questionForm.value.questionText,
      questionType: this.questionForm.value.questionType,
      options: options, // Send as array of OptionDto objects
      correctAnswer: this.questionForm.value.correctAnswer,
      test: { id: this.testId }
    };
  
    console.log('Payload:', questionDto); // Verify the payload
  
    this.adminService.addQuestion(questionDto).subscribe(
      (response) => {
        this.notification.success('Success', 'Question added successfully!');
        this.questionForm.reset();
        this.initializeForm(); // Reset the form
      },
      (error) => {
        this.notification.error('Error', 'Failed to add question.');
      }
    );
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../service/admin.service';
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
  options!: FormArray;
  testId!: number;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));

    this.questionForm = this.fb.group({
      questionText: [''],
      questionType: ['multiple_choice'],
      options: this.fb.array([]),
      correctAnswer: ['']  // Corrected (was [[]])
    });

    this.options = this.questionForm.get('options') as FormArray;
    this.addOption();
    this.addOption();
  }

  // Getters for form conditions
  get showOptions() {
    return this.questionForm.value.questionType !== 'true_false';
  }

  get isMultipleChoice() {
    return this.questionForm.value.questionType === 'multiple_choice';
  }

  get isSingleChoice() {
    return this.questionForm.value.questionType === 'single_choice';
  }

  get isTrueFalse() {
    return this.questionForm.value.questionType === 'true_false';
  }

  onQuestionTypeChange() {
    this.options.clear(); // Clear existing options
    this.questionForm.patchValue({ correctAnswer: '' });
  
    if (this.isTrueFalse) {
      // Add 'True' and 'False' as fixed options in the FormArray
      this.options.push(this.fb.control('True'));
      this.options.push(this.fb.control('False'));
  
      // Ensure a default correct answer is selected
      this.questionForm.patchValue({ correctAnswer: 'True' });
    } else {
      this.addOption();
      this.addOption();
    }
  }
  

  addOption() {
    this.options.push(this.fb.control(''));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  setCorrectAnswer(index: number) {
    const selectedOption = this.options.at(index).value;
    this.questionForm.patchValue({ correctAnswer: [selectedOption] }); // Always store as an array
  }
  

  updateCorrectAnswer(index: number, event: any) {
    let currentAnswers = this.questionForm.value.correctAnswer || [];

    if (event.target.checked) {
      currentAnswers.push(this.options.at(index).value);
    } else {
      currentAnswers = currentAnswers.filter((ans: any) => ans !== this.options.at(index).value);
    }

    this.questionForm.patchValue({ correctAnswer: currentAnswers });
  }

  onSubmit() {
    if (this.questionForm.valid && this.testId > 0) {
      const options = this.isTrueFalse
        ? [{ optionText: 'True' }, { optionText: 'False' }]
        : this.questionForm.value.options.map((opt: string) => ({ optionText: opt }));
  
      // Ensure correctAnswer is always an array (even for single-choice questions)
      const correctAnswer = Array.isArray(this.questionForm.value.correctAnswer)
        ? this.questionForm.value.correctAnswer
        : this.questionForm.value.correctAnswer
        ? [this.questionForm.value.correctAnswer]  // Convert single value to array
        : [];  // If empty, set as an empty array
  
      const questionDto = {
        questionText: this.questionForm.value.questionText,
        questionType: this.questionForm.value.questionType,
        options: options,
        correctAnswer: correctAnswer,  // Ensures correct format
        test: { id: this.testId }
      };
  
      console.log(questionDto); // Debugging output
  
      this.adminService.addQuestion(questionDto).subscribe(response => {
        alert('Question added successfully!');
      }, error => {
        console.error(error);
        alert('There was an error adding the question.');
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  
}

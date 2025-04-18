import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { SharedModule } from '../../../shared/shared/shared.module';
import { UserStorageService } from '../../../auth/service/user-stoarage.service';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.css'],
})
export class TakeTestComponent implements OnInit, OnDestroy {
  testDetails: any = null; // Holds the test details
  testID: any; // Holds the test ID from the route
  userAnswers: any = {}; // Stores user's answers
  remainingTime: number = 0; // Tracks remaining time in seconds
  timer: any; // Reference to the timer

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Fetch the test ID from the route
    this.activatedRoute.paramMap.subscribe((params) => {
      this.testID = params.get('id');

      if (this.testID) {
        // Fetch test details from the API
        this.userService.getAllQuestion(this.testID).subscribe(
          (res: any) => {
            console.log('API Response:', res);
            if (res) {
              this.testDetails = res;
              this.initializeUserAnswers();
              this.startTimer(res.testDto.time); // Start the timer with the test time
            }
          },
          (error) => {
            console.error('Error fetching test details:', error);
          }
        );
      }
    });
  }

  // Initialize userAnswers object with empty selectedOptions for each question
  initializeUserAnswers() {
    if (this.testDetails?.questions) {
      this.testDetails.questions.forEach((q: any, index: number) => {
        this.userAnswers[index] = {
          questionId: q.id,
          selectedOptions: [],
        };
      });
    }
  }

  // Start the timer
  startTimer(totalTimeInSeconds: number) {
    this.remainingTime = totalTimeInSeconds;
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timer); // Stop the timer
        this.submitTest(); // Automatically submit the test when time is up
      }
    }, 1000);
  }

  // Handle option selection (for multiple choice, single choice, and true/false)
  onOptionSelect(questionIndex: number, option: string, isChecked: boolean) {
    const question = this.testDetails.questions[questionIndex];

    if (question.questionType === 'MULTIPLE_CHOICE') {
      if (isChecked) {
        this.userAnswers[questionIndex].selectedOptions.push(option);
      } else {
        const optionIndex = this.userAnswers[questionIndex].selectedOptions.indexOf(option);
        if (optionIndex !== -1) {
          this.userAnswers[questionIndex].selectedOptions.splice(optionIndex, 1);
        }
      }
    } else {
      this.userAnswers[questionIndex].selectedOptions = [option];
    }
  }

  // Check if all questions have been answered
  areAllQuestionsAnswered(): boolean {
    return this.testDetails.questions.every((q: any, index: number) => {
      return this.userAnswers[index].selectedOptions.length > 0;
    });
  }

  // Submit the test
  submitTest() {
    // Check if all questions are answered
    if (!this.areAllQuestionsAnswered()) {
      const confirmSubmit = confirm('You have not answered all questions. Are you sure you want to submit the test?');
      if (!confirmSubmit) {
        return; // Stop submission if the user cancels
      }
    } else {
      const confirmSubmit = confirm('Are you sure you want to submit the test?');
      if (!confirmSubmit) {
        return; // Stop submission if the user cancels
      }
    }

    const userId = UserStorageService.getUserId(); // Get the user ID from UserStorageService
    if (!userId) {
      console.error('User ID is missing. Please log in again.');
      return;
    }

    const submitData = {
      testId: this.testID,
      userId: userId, // Use the actual user ID
      responses: Object.values(this.userAnswers),
    };

    this.userService.submitTest(submitData).subscribe(
      (res: any) => {
        console.log('Test submitted successfully:', res);
        this.router.navigate(['user/view-test-results', res.id]); // Navigate to results page
      },
      (error: any) => {
        console.error('Error submitting test:', error);
      }
    );
  }

  // Format time for display (e.g., "5m 30s")
  formatTime(seconds: number): string {
    if (isNaN(seconds)) {
      return '0m 0s';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  // Get formatted remaining time for display
  getFormattedTime(): string {
    return this.formatTime(this.remainingTime);
  }

  // Clean up the timer when the component is destroyed
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
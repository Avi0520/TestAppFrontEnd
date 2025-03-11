import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.css']
})
export class TakeTestComponent {
  testDetails: any = null;
  testID: any;
  userAnswers: any = {};

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.testID = params.get('id');

      if (this.testID) {
        this.userService.getAllQuestion(this.testID).subscribe(
          (res: any) => {
            console.log("API Response:", res);
            if (res) {
              this.testDetails = res;
              this.initializeUserAnswers();
            }
          },
          (error) => {
            console.error("Error fetching test details:", error);
          }
        );
      }
    });
  }

  initializeUserAnswers() {
    if (this.testDetails?.questions) {
      this.testDetails.questions.forEach((q: any, index: number) => {
        this.userAnswers[index] = {
          questionId: q.id,
          selectedOptions: []
        };
      });
    }
  }

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

  submitTest() {
    const submitData = {
      testId: this.testID,
      userId: this.getUserId(),
      responses: Object.values(this.userAnswers)
    };

    this.userService.submitTest(submitData).subscribe(
      (res: any) => {
        console.log("Test submitted successfully:", res);
        this.router.navigate(['user/view-test-results', res.id]);
      },
      (error: any) => {
        console.error("Error submitting test:", error);
      }
    );
  }

  getUserId(): number {
    // Replace with actual logic to get the user ID
    return 1;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) {
      return '0m 0s';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared/shared/shared.module';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-view-correct-answers',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-correct-answer.component.html',
  styleUrls: ['./view-correct-answer.component.css']
})
export class ViewCorrectAnswersComponent implements OnInit {
  testDetails: any = null;
  testID: any;
  resultID: any;
  userAnswers: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  paginatedQuestions: any[] = [];

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.testID = params['testId'];
      this.resultID = params['resultId'];

      if (this.testID && this.resultID) {
        this.loadTestDetails();
        this.loadTestResult();
      }
    });
  }

  loadTestDetails() {
    this.userService.getAllQuestion(this.testID).subscribe(
      (res: any) => {
        this.testDetails = res;
        this.updatePaginatedQuestions();
      },
      (error) => {
        console.error("Error fetching test details:", error);
      }
    );
  }

  loadTestResult() {
    this.userService.getTestResult(this.resultID).subscribe(
      (res: any) => {
        this.userAnswers = res.responses;
      },
      (error) => {
        console.error("Error fetching test result:", error);
      }
    );
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.updatePaginatedQuestions();
  }

  updatePaginatedQuestions() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedQuestions = this.testDetails?.questions?.slice(startIndex, endIndex) || [];
  }

  getQuestionNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  isCorrectAnswer(question: any, optionText: string): boolean {
    return question.correctAnswer.includes(optionText);
  }

  isUserAnswerCorrect(question: any, userAnswer: any): boolean {
    if (!userAnswer) return false;
    
    const correctAnswers = question.correctAnswer;
    const userAnswers = userAnswer.selectedOptions;
    
    if (correctAnswers.length !== userAnswers.length) {
      return false;
    }
    
    return correctAnswers.every((answer: string) => 
      userAnswers.includes(answer)
    );
  }
}
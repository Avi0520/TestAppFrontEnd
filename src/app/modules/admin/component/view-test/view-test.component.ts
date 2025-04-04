import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-view-test',
  standalone: true,
  imports: [SharedModule, FormsModule], // Include FormsModule for ngModel
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent {
  testDetails: any = null; // Holds the test details and questions
  testID: any; // Holds the test ID from the route
  currentPage: number = 1; // Current page for pagination
  pageSize: number = 5; // Number of questions per page
  paginatedQuestions: any[] = []; // Holds the questions for the current page

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private notification: NzNotificationService // Add this line

  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.testID = params.get('id'); // Get the test ID from the route

      if (this.testID) {
        // Fetch test details and questions
        this.adminService.getAllQuestion(this.testID).subscribe(
          (res: any) => {
            console.log("API Response:", res);

            if (res) {
              this.testDetails = res; // Assign the response to testDetails
              this.initializeQuestions(); // Initialize selected options for questions
              this.updatePaginatedQuestions(); // Update paginated questions
            }
          },
          (error) => {
            console.error("Error fetching test details:", error);
          }
        );
      }
    });
  }

  // Initialize selected options for questions
  initializeQuestions() {
    if (this.testDetails?.questions) {
      this.testDetails.questions = this.testDetails.questions.map((q: any) => ({
        ...q,
        selectedOption: null, // For Single Choice & True/False
        selectedOptions: []   // For Multiple Choice
      }));
    }
  }

  // Convert seconds to minutes and seconds format
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  // Handle page change event
  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.updatePaginatedQuestions();
  }

  // Update the paginated questions based on the current page
  updatePaginatedQuestions() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedQuestions = this.testDetails.questions.slice(startIndex, endIndex);
  }

  // Calculate the question number based on the current page
  getQuestionNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

// In view-test.component.ts
deleteQuestion(questionId: number) {
  if (confirm('Are you sure you want to delete this question?')) {
    this.adminService.deleteQuestion(questionId).subscribe({
      next: (response) => {
        console.log('Delete successful:', response);
        this.testDetails.questions = this.testDetails.questions.filter(
          (q: any) => q.id !== questionId
        );
        this.updatePaginatedQuestions();
        
        // Show success notification
        this.notification.success(
          'Success', 
          'Question deleted successfully',
          { nzDuration: 3000 }
        );
      },
      error: (err) => {
        console.error('Error details:', err);
        this.notification.error(
          'Error',
          err.error?.message || 'Failed to delete question',
          { nzDuration: 3000 }
        );
      }
    });
  }
}
}
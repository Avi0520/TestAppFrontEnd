import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

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

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute
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
}
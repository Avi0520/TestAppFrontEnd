import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { SharedModule } from '../../../shared/shared/shared.module';

@Component({
  selector: 'app-view-test-results',
    standalone: true,
    imports: [SharedModule],
  templateUrl: './view-test-results.component.html',
  styleUrls: ['./view-test-results.component.css']
})
export class ViewTestResultsComponent implements OnInit {
  testResult: any = null; // Holds the test result data
  resultId: string | null = null; // Holds the result ID from the route

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the result ID from the route parameters
    this.resultId = this.route.snapshot.paramMap.get('id');

    if (this.resultId) {
      // Fetch the test result data
      this.userService.getTestResult(this.resultId).subscribe(
        (res: any) => {
          console.log("Test result fetched successfully:", res);
          this.testResult = res; // Assign the fetched result to the component property
        },
        (error) => {
          console.error("Error fetching test result:", error);
        }
      );
    } else {
      console.error("Result ID is missing from the route.");
    }
  }
}
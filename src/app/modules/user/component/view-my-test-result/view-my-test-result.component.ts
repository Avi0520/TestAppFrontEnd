import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngModel
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { SharedModule } from '../../../shared/shared/shared.module';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-my-test-result',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule], // Add CommonModule and FormsModule
  templateUrl: './view-my-test-result.component.html',
  styleUrl: './view-my-test-result.component.css',
})


export class ViewMyTestResultComponent implements OnInit {
  testResults: any[] = []; // Array to store all test results
  filteredResults: any[] = []; // Array to store filtered test results
  paginatedResults: any[] = []; // Array to store paginated test results
  searchTerm: string = ''; // Variable to store the search term
  currentPage: number = 1; // Current page for pagination
  pageSize: number = 8; // Number of results per page

  constructor(private userService: UserService,
    private router: Router) {}

    viewCorrectness(testResult: any) {
      this.router.navigate(['/user/correctness', testResult.id], {
        state: { testData: testResult }
      });
    }

  ngOnInit(): void {
    this.loadTestResults();
  }

  loadTestResults(): void {
    this.userService.getTestResultbyUser().subscribe(
      (data: any) => {
        this.testResults = data; // Assign fetched data to the testResults array
        this.filteredResults = data; // Initialize filteredResults with all data
        this.updatePaginatedResults(); // Initialize paginated results
      },
      (error) => {
        console.error('Error fetching test results:', error);
      }
    );
  }

  // Method to filter results based on the search term
  filterResults(): void {
    if (!this.searchTerm) {
      this.filteredResults = this.testResults; // If no search term, show all results
    } else {
      this.filteredResults = this.testResults.filter((result) =>
        result.testName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1; // Reset to the first page after filtering
    this.updatePaginatedResults(); // Update paginated results
  }

  // Handle page change event
  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.updatePaginatedResults();
  }

  // Update the paginated results based on the current page
  updatePaginatedResults(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedResults = this.filteredResults.slice(startIndex, endIndex);
  }
}
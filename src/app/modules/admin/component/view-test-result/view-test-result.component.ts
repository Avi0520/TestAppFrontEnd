import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { SharedModule } from '../../../shared/shared/shared.module';

@Component({
  selector: 'app-view-test-result',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-test-result.component.html',
  styleUrl: './view-test-result.component.css'
})
export class ViewTestResultComponent implements OnInit {
  testResults: any[] = []; // Holds all test results
  filteredResults: any[] = []; // Holds filtered results
  searchQuery: string = ''; // Search query

  // Pagination properties
  pageIndex: number = 1; // Current page number
  pageSize: number = 8; // Number of items per page
  totalItems: number = 0; // Total number of items

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchAllTestResults();
  }

  // Fetch all test results
  fetchAllTestResults() {
    this.adminService.getAllTestResults().subscribe(
      (res: any) => {
        console.log("All test results fetched successfully:", res);
        this.testResults = res;
        this.filteredResults = res; // Initialize filtered results with all results
        this.totalItems = this.filteredResults.length; // Set total items for pagination
      },
      (error) => {
        console.error("Error fetching test results:", error);
      }
    );
  }

  // Filter results based on search query
  filterResults() {
    if (!this.searchQuery) {
      // If search query is empty, show all results
      this.filteredResults = this.testResults;
    } else {
      // Filter results by user name or test name
      this.filteredResults = this.testResults.filter(result =>
        result.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        result.testName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.totalItems = this.filteredResults.length; // Update total items for pagination
    this.pageIndex = 1; // Reset to the first page after filtering
  }

  // Handle page change
  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }
}
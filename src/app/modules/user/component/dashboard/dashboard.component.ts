import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from '../../../admin/service/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule], // Add FormsModule for ngModel
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  tests: any[] = []; // Original list of tests
  filteredTests: any[] = []; // Filtered list of tests for display
  paginatedTests: any[] = []; // Paginated list of tests for the current page
  searchTerm: string = ''; // Search term
  currentPage: number = 1; // Current page for pagination
  pageSize: number = 6; // Number of tests per page

  constructor(
    private notification: NzNotificationService,
    private testService: AdminService
  ) { }

  ngOnInit() {
    this.getAllTests();
  }

  // Fetch all tests from the API
  getAllTests() {
    this.testService.getAllTest().subscribe(
      (res) => {
        this.tests = res;
        this.filteredTests = res; // Initialize filteredTests with all tests
        this.updatePaginatedTests(); // Update paginated tests
      },
      (error) => {
        this.notification.error(
          `ERROR`,
          `Something went wrong! Try Again.`,
          { nzDuration: 5000 }
        );
      }
    );
  }

  // Format time in minutes and seconds
  getFormatedTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return ` ${minutes} minutes ${seconds} seconds `;
  }

  // Filter tests based on the search term
  filterTests() {
    if (!this.searchTerm) {
      this.filteredTests = this.tests; // If no search term, show all tests
    } else {
      this.filteredTests = this.tests.filter(test =>
        test.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1; // Reset to the first page after filtering
    this.updatePaginatedTests(); // Update paginated tests
  }

  // Handle page change event
  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.updatePaginatedTests();
  }

  // Update the paginated tests based on the current page
  updatePaginatedTests() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTests = this.filteredTests.slice(startIndex, endIndex);
  }
}
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
  searchTerm: string = ''; // Search term

  constructor(
    private notification: NzNotificationService,
    private testService: AdminService
  ) { }

  ngOnInit() {
    this.getAllTests();
  }

  getAllTests() {
    this.testService.getAllTest().subscribe(
      (res) => {
        this.tests = res;
        this.filteredTests = res; // Initialize filteredTests with all tests
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
  }
}
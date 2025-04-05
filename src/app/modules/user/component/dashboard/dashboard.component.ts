import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStorageService } from '../../../auth/service/user-stoarage.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  tests: any[] = [];
  filteredTests: any[] = [];
  paginatedTests: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 6;

  constructor(
    private notification: NzNotificationService,
    private userService: UserService // Changed from AdminService to UserService
  ) { }

  ngOnInit() {
    this.loadUserTests();
  }

  loadUserTests() {
    if (UserStorageService.isAdminLoggedIn()) {
      // Admin sees all tests
      this.userService.getAllTest().subscribe(
        (res) => this.handleTestsResponse(res),
        (error) => this.handleError(error)
      );
    } else {
      // Regular user sees only tests from their courses
      this.userService.getTestsByUser().subscribe(
        (res) => this.handleTestsResponse(res),
        (error) => this.handleError(error)
      );
    }
  }

  private handleTestsResponse(res: any) {
    this.tests = res;
    this.filteredTests = res;
    this.updatePaginatedTests();
  }

  private handleError(error: any) {
    this.notification.error(
      `ERROR`,
      `Something went wrong! Try Again.`,
      { nzDuration: 5000 }
    );
  }

  // Rest of your existing methods...
  getFormatedTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return ` ${minutes} minutes ${seconds} seconds `;
  }

  filterTests() {
    if (!this.searchTerm) {
      this.filteredTests = this.tests;
    } else {
      this.filteredTests = this.tests.filter(test =>
        test.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePaginatedTests();
  }

  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.updatePaginatedTests();
  }

  updatePaginatedTests() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTests = this.filteredTests.slice(startIndex, endIndex);
  }
}
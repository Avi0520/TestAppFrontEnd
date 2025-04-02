import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  pageSize: number = 5; // Number of items per page

  constructor(private notification: NzNotificationService,
    private testService: AdminService 
  ){}

  ngOnInit(){
    this.getAllTests();
  }

  getAllTests(){
    this.testService.getAllTest().subscribe(res=>{
      this.tests = res;
      this.filteredTests = res; // Initialize filteredTests with all tests
      this.updatePaginatedTests();
    },error=>{
      this.notification
      .error(
        `ERROR`,
        `Something went wrong! Try Again.`,
        { nzDuration: 5000 }
      )
    })  
  }

  getFormatedTime(time: number): string{
      const minutes = Math.floor(time/60);
      const seconds =   time % 60;
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
    this.currentPage = 1; // Reset to first page after filtering
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
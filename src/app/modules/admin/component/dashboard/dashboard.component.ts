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
  searchTerm: string = '';

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
  }
}
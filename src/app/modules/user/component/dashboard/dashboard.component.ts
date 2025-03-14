import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from '../../../admin/service/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  tests: any[] = [];

  constructor(private notification: NzNotificationService,
    private testService: AdminService
  ) { }

  ngOnInit() {
    this.getAllTests();
  }

  getAllTests() {
    this.testService.getAllTest().subscribe(res => {

      this.tests = res;

    }, error => {

      this.notification
        .error(
          `ERROR`,
          `somthing went wrong!. Try Again`,
          { nzDuration: 5000 }
        )

    })
  }

  getFormatedTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return ` ${minutes} minutes ${seconds} seconds `;


  }
}

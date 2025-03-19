import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-view-my-test-result',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-my-test-result.component.html',
  styleUrl: './view-my-test-result.component.css'
})
export class ViewMyTestResultComponent implements OnInit {

  testResults: any[] = []; // Array to store test results

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadTestResults();
  }

  loadTestResults(): void {
    this.userService.getTestResultbyUser().subscribe(
      (data: any) => {
        this.testResults = data; // Assign fetched data to the testResults array
      },
      (error) => {
        console.error('Error fetching test results:', error);
      }
    );
  }
}

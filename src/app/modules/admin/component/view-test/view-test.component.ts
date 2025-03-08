import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

@Component({
  selector: 'app-view-test',
  standalone: true,
  imports: [SharedModule, FormsModule], // ✅ Include FormsModule for ngModel
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent {

  questions: any[] = [];
  testID: any;

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.testID = params.get('id');

      if (this.testID) {
        this.adminService.getAllQuestion(this.testID).subscribe(
          (res: any) => {
            console.log("API Response:", res);
            if (Array.isArray(res)) {
              this.questions = res.map(q => ({ ...q, selectedOption: null })); // ✅ Initialize selectedOption
            } else {
              this.questions = (res?.questions || []).map((q: any) => ({ ...q, selectedOption: null })); // ✅ Prevent undefined binding
            }
          },
          (error) => {
            console.error("Error fetching questions:", error);
          }
        );
      }
    });
  }
}

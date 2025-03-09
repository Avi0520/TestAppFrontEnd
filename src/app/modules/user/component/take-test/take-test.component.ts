import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared/shared.module';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './take-test.component.html',
  styleUrl: './take-test.component.css'
})
export class TakeTestComponent {

  questions : any[] =[];
  testID :any;

  constructor(private testservice : UserService,
    private route:Router,
    private message :NzMessageService,
    private activatedRoute:ActivatedRoute,
  ){}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.testID = params.get('id');

      if (this.testID) {
        this.testservice.getAllQuestion(this.testID).subscribe(
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

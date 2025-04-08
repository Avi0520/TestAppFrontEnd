import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../component/dashboard/dashboard.component';
import { TakeTestComponent } from '../../component/take-test/take-test.component';
import { ViewTestResultsComponent } from '../../component/view-test-results/view-results.component';
import { ViewMyTestResultComponent } from '../../component/view-my-test-result/view-my-test-result.component';
import { CorrectnessComponent } from '../../component/correctness/correctness.component';

const routes: Routes = [
  {path: 'dashboard', component:DashboardComponent},
  {path: 'take-test/:id', component:TakeTestComponent},
  { path: 'view-test-results/:id', component: ViewTestResultsComponent } ,
  {path : 'view-my-test-result', component:ViewMyTestResultComponent},
  { path: 'correctness', component: CorrectnessComponent }

];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule { }

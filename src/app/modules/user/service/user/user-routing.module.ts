import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../component/dashboard/dashboard.component';
import { TakeTestComponent } from '../../component/take-test/take-test.component';
import { ViewTestResultsComponent } from '../../component/view-test-results/view-results.component';

const routes: Routes = [
  {path: 'dashboard', component:DashboardComponent},
  {path: 'take-test/:id', component:TakeTestComponent},
  { path: 'view-test-results/:id', component: ViewTestResultsComponent } // Route for viewing test results

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule { }

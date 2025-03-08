import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../component/dashboard/dashboard.component';
import { CreateTestComponent } from '../../component/create-test/create-test.component';
import { AddQuestionComponent } from '../../component/add-question/add-question.component';
import { ViewTestComponent } from '../../component/view-test/view-test.component';


const routes: Routes = [
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'create-test', component: CreateTestComponent},
  {path: 'add-question/:id', component: AddQuestionComponent},
  {path: 'view-test/:id', component: ViewTestComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

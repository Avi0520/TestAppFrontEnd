import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../component/dashboard/dashboard.component';
import { CreateTestComponent } from '../../component/create-test/create-test.component';
import { AddQuestionComponent } from '../../component/add-question/add-question.component';
import { ViewTestComponent } from '../../component/view-test/view-test.component';
import { ViewTestResultComponent } from '../../component/view-test-result/view-test-result.component';
import { EditTestComponent } from '../../component/edit-test/edit-test.component';
import { EditQuestionComponent } from '../../component/edit-question/edit-question.component';
import { CourseComponent } from '../../component/course/course.component';


const routes: Routes = [
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'create-test', component: CreateTestComponent},
  {path: 'add-question/:id', component: AddQuestionComponent},
  {path: 'view-test/:id', component: ViewTestComponent},
  {path: 'view-test-result', component: ViewTestResultComponent},
  {path: 'edit-test/:id', component: EditTestComponent },
  { path: 'edit-question/:testId/:id', component: EditQuestionComponent },
  { path: 'courses', component: CourseComponent }, // Course management
  { path: 'courses/:id/edit', component: CourseComponent }, // Edit course
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

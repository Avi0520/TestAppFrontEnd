import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../component/dashboard/dashboard.component';
import { CreateTestComponent } from '../../component/create-test/create-test.component';


const routes: Routes = [
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'create-test', component: CreateTestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

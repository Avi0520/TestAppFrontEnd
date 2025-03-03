import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterLink } from '@angular/router';
import { DemoNgZorroAntdModule } from '../../../demo-ng-zorro.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    DemoNgZorroAntdModule
  ],exports : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    DemoNgZorroAntdModule
  ]
})
export class SharedModule { }

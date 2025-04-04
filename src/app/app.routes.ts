import { Routes } from '@angular/router';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { LoginComponent } from './modules/auth/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: '/signup', pathMatch: 'full' },
    {path: 'signup', component: SignupComponent},
    {path: 'login', component: LoginComponent},
    {path: 'user', loadChildren: ()=> import('./modules/user/service/user/user.module').then(m=> m.UserModule)},
    {path: 'admin', loadChildren: ()=> import('./modules/admin/service/admin/admin.module').then(m=> m.AdminModule)}

];

import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MonthlyCalcComponent } from './monthly-calc/monthly-calc.component';
import { MaxCalcComponent } from './max-calc/max-calc.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LoginComponent } from './login/login.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { UserpageComponent } from './userpage/userpage.component';
import { AdminComponent } from './admin/admin.component';
import { UserGuard } from './guard/user.guard';
import { AdminGuard } from './guard/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'maximum-loan', component: MaxCalcComponent },
  { path: 'monthly-payment', component: MonthlyCalcComponent },
  { path: 'admin-page', component: AdminpageComponent},
  { path: 'admin-page', component: AdminpageComponent, canActivate: [AdminGuard]},
  { path: 'user-page', component: UserpageComponent},
  { path: 'user-page', component: UserpageComponent, canActivate: [UserGuard]},
  { path: 'admin', component: AdminComponent},
 
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

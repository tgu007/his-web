import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ErrorNotFoundComponent} from "./component/group-common/error-not-found/error-not-found.component";
import {LandingComponent} from "./component/landing/landing.component";
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./component/group-user/login/login.component";


const routes: Routes = [
  {path: 'page_not_found', component: ErrorNotFoundComponent},//辅助路由显示
  {
    path: 'landing', component: LandingComponent,
    canActivate: [AuthGuard],
  },
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule {
}

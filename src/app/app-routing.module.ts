import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TestPlanComponent} from "./test-plan/test-plan.component";

const routes: Routes = [
  {path: 'staff', loadChildren: () => import('./module_staff/staff.module').then(m => m.StaffModule)},
  {path: '', pathMatch: 'full', redirectTo: 'staff/landing'},
  {path: 'patient', loadChildren: () => import('./module_patient/patient.module').then(m => m.PatientModule)},
  {path: 'testplan', component: TestPlanComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

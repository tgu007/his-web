import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {MyFeeComponent} from './component/my-fee.component';

const routes: Routes = [{path: 'my_fee/:patientId', component: MyFeeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {
}

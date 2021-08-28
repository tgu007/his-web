import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {PatientRoutingModule} from './patient-routing.module';
import {MyFeeComponent} from './component/my-fee.component';
import {BadgeModule, CalendarModule, ListModule, SwipeActionModule, TabBarModule} from 'ng-zorro-antd-mobile';
import {NZ_I18N, NzButtonModule, NzGridModule, NzSpinModule, NzTableModule, zh_CN} from "ng-zorro-antd";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [MyFeeComponent],
    imports: [
        CommonModule,
        PatientRoutingModule,
        TabBarModule,
        ListModule,
        NzGridModule,
        SwipeActionModule,
        CalendarModule,
        FormsModule,
        NzSpinModule,
        BadgeModule,
        NzButtonModule,
        NzTableModule
    ],
  providers: [DatePipe],
})
export class PatientModule {
}

import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserModule} from "@angular/platform-browser";
import {SessionService} from "./service/session.service";
import {HttpClientModule} from "@angular/common/http";
import {
  NzMessageModule, NzTabsModule
} from "ng-zorro-antd";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {TestPlanComponent} from './test-plan/test-plan.component';


@NgModule({
  declarations: [AppComponent, TestPlanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NzMessageModule,
    BrowserAnimationsModule,
    FormsModule,
    NzTabsModule,
  ],

  bootstrap: [AppComponent],
  providers: [SessionService,],

})
export class AppModule {
}

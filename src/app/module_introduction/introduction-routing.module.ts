import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IntroductionComponent} from "./introduction/introduction.component";
import {JdyIntroductionComponent} from "./jdy-introduction/jdy-introduction.component";


const routes: Routes = [{path: 'his', component: IntroductionComponent},
                        {path: 'data_hub', component: JdyIntroductionComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntroductionRoutingModule {
}

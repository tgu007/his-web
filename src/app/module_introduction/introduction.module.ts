import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionComponent } from './introduction/introduction.component';
import {IntroductionRoutingModule} from "./introduction-routing.module";
import {NzButtonModule, NzCarouselModule, NzCollapseModule, NzDescriptionsModule} from "ng-zorro-antd";
import { JdyIntroductionComponent } from './jdy-introduction/jdy-introduction.component';



@NgModule({
    declarations: [IntroductionComponent, JdyIntroductionComponent],
    exports: [

    ],
    imports: [
        CommonModule,
        IntroductionRoutingModule,
        NzCollapseModule,
        NzButtonModule,
        NzCarouselModule,
        NzDescriptionsModule
    ]
})
export class IntroductionModule { }

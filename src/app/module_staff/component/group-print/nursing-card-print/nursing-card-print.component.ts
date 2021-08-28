import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-nursing-card-print',
  templateUrl: './nursing-card-print.component.html',
  styleUrls: ['./nursing-card-print.component.css']
})
export class NursingCardPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService, public sessionService: SessionService,) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onNursingCardClose.emit();
  }

}

import {Component, OnInit} from '@angular/core';
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {DatePipe} from "@angular/common";
import {BasePrint} from "../BasePrint";

@Component({
  selector: 'app-settlement-print',
  templateUrl: './settlement-print.component.html',
  styleUrls: ['./settlement-print.component.css']
})
export class SettlementPrintComponent extends BasePrint implements OnInit {

  constructor(printService: PrintService,
              public sessionService: SessionService,
              public datePipe: DatePipe,
  ) {
    super(printService, sessionService);
  }

  ngOnInit() {
    console.log(this.printData);
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onSettlementSummaryClose.emit();
  }


}

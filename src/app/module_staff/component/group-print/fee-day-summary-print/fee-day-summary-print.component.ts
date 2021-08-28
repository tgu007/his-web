import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-fee-day-summary-print',
  templateUrl: './fee-day-summary-print.component.html',
  styleUrls: ['./fee-day-summary-print.component.css']
})
export class FeeDaySummaryPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onFeeDaySummaryListClose.emit();
  }

  getTotalValue() {
    if (this.printData && this.printData.feeDaySummaryList)
      return this.printData.feeDaySummaryList.reduce((total, fee) => total + fee.totalAmount, 0).toFixed(2) + '元'
    else
      return '0元';
  }
}

import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-fee-summary-list-print',
  templateUrl: './fee-summary-list-print.component.html',
  styleUrls: ['./fee-summary-list-print.component.css']
})
export class FeeSummaryListPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onFeeSummaryListClose.emit();
  }

  getTotalValue() {
    if (this.printData && this.printData.feeSummaryList)
      return this.printData.feeSummaryList.reduce((total, fee) => total + fee.totalAmount, 0).toFixed(2) + '元'
    else
      return '0元';
  }
}

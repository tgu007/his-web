import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-internal-fee-summary-print',
  templateUrl: './internal-fee-summary-print.component.html',
  styleUrls: ['./internal-fee-summary-print.component.css']
})
export class InternalFeeSummaryPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onInternalFeeSummaryClose.emit();
  }

  getTotalValue() {
    if (this.printData && this.printData.internalFeeSummaryList)
      return this.printData.internalFeeSummaryList.reduce((total, fee) => total + fee.totalAmount, 0).toFixed(2) + '元'
    else
      return '0元';
  }
}

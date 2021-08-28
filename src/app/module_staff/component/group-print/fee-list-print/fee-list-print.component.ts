import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-fee-list-print',
  templateUrl: './fee-list-print.component.html',
  styleUrls: ['./fee-list-print.component.css']
})
export class FeeListPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onFeeListClose.emit();
  }

  getTotalValue() {
    if (this.printData && this.printData.feeList)
      return this.printData.feeList.reduce((total, fee) => total + fee.totalAmount, 0).toFixed(2) + '元'
    else
      return '0元';
  }
}

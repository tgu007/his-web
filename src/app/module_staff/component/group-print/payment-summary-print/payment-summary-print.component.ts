import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {FeeService} from "../../../../service/fee.service";

@Component({
  selector: 'app-payment-summary-print',
  templateUrl: './payment-summary-print.component.html',
  styleUrls: ['./payment-summary-print.component.css']
})
export class PaymentSummaryPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public feeService: FeeService,
              public sessionService: SessionService,) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onPaymentSummaryClose.emit();
  }

  getTotalCashAmount() {
    if (this.printData.summaryList)
      return this.printData.summaryList.reduce((total, summary) => total + summary.totalCashAmount, 0).toFixed(2);

  }

  getTotalAmount() {
    if (this.printData.summaryList)
      return this.printData.summaryList.reduce((total, summary) => total + summary.totalAmount, 0).toFixed(2);
  }

  getTotalBankTransferAmount() {
    if (this.printData.summaryList)
      return this.printData.summaryList.reduce((total, summary) => total + summary.totalBankAmount, 0).toFixed(2);

  }

  getTotalWechatPaymentAmount() {
    if (this.printData.summaryList)
      return this.printData.summaryList.reduce((total, summary) => total + summary.totalWechatAmount, 0).toFixed(2);

  }

  getTotalAliPaymentAmount() {
    if (this.printData.summaryList)
      return this.printData.summaryList.reduce((total, summary) => total + summary.totalAliAmount, 0).toFixed(2);

  }

  getTotalAmountInChinese() {
    if (this.printData.summaryList) {
      let totalAmount = this.printData.summaryList.reduce((total, summary) => total + summary.totalAmount, 0).toFixed(2);
      return this.feeService.toChineseNumeral(totalAmount)
    }
  }
}

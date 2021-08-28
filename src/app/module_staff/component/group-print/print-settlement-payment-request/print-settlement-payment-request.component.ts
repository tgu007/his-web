import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-print-settlement-payment-request',
  templateUrl: './print-settlement-payment-request.component.html',
  styleUrls: ['./print-settlement-payment-request.component.css']
})
export class PrintSettlementPaymentRequestComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService,
  ) {
    super(printService, sessionService);
  }

  ngOnInit() {

  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onSettlementPaymentRequestClose.emit();
  }

  getTotalPaymentTypeAdjustment(paymentType: any) :number{
    if (paymentType) {
      let civilAdjustment:number = Number(paymentType["civilAdjustment"]);
      let companyAdjustment:number = Number(paymentType["companyAdjustment"]);
      let otherAdjustment:number = Number(paymentType["otherAdjustment"]);
     return Number((civilAdjustment + companyAdjustment + otherAdjustment).toFixed(2));
    } else return 0;

  }

  getTotalAccountAdjustment(employerType: string, adjustmentType: string) :number {
    if (this.printData.settlementSummary && this.printData.settlementSummary.accountList) {
      return this.printData.settlementSummary.accountList.map(a => a[employerType][adjustmentType]).reduce((sum, current) => sum + current);
    } else
      return 0;
  }

  toNumber(value: any) {
    if (!value)
      return 0;
    return Number(value);
  }
}

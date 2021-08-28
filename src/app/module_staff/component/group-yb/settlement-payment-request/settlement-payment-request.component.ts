import {Component, OnInit} from '@angular/core';
import * as dateFunction from 'date-fns';
import {YbTzService} from "../../../../service/yb-tz.service";
import {DatePipe} from "@angular/common";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-settlement-payment-request',
  templateUrl: './settlement-payment-request.component.html',
  styleUrls: ['./settlement-payment-request.component.css']
})
export class SettlementPaymentRequestComponent implements OnInit {
  filterDateRange: any;
  settlementSummary: any = undefined;
  inEdit: boolean = false;

  constructor(
    public ybService: YbTzService,
    private datePipe: DatePipe,
    public printService: PrintService,
  ) {
  }

  ngOnInit() {
    this.filterDateRange = [dateFunction.startOfMonth(new Date()), dateFunction.endOfMonth(new Date())]
    this.reload();
  }

  reload() {
    let filter = {};
    filter["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd');
    filter["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd');
    this.ybService.calculateSettlementPayment(filter).subscribe(response => {
      this.settlementSummary = response.content;
    });
  }

  manualAdjustment() {
    this.inEdit = true;
  }

  adjustmentCompleted() {
    //let selfWorkingCivilAdjustment = this.settlementSummary.selfAccount.workingPayment.civilAdjustment;
    this.inEdit = false;
  }

  print() {
    let startDate = this.datePipe.transform(this.filterDateRange[0], 'yyyy.MM.dd');
    let endDate = this.datePipe.transform(this.filterDateRange[1], 'yyyy.MM.dd');
    let dataRange = startDate + '至' + endDate;

    this.printService.onPrintClicked.emit({
      name: 'settlementPaymentRequest',
      data: {
        settlementSummary: this.settlementSummary,
        dateRange: dataRange,
      }
    });
  }

  getTotalPaymentTypeAdjustment(paymentType: any) :number {
    if (paymentType) {
      return Number((Number(paymentType["civilAdjustment"])
        + Number(paymentType["companyAdjustment"])
        + Number(paymentType["otherAdjustment"])).toFixed(2));
    } else return 0;

  }

  getTotalAccountAdjustment(employerType: string, adjustmentType: string) :number{
    if (this.settlementSummary && this.settlementSummary.accountList) {
      return this.settlementSummary.accountList.map(a => a[employerType][adjustmentType]).reduce((sum, current) => sum + current);
    } else
      return 0;
  }

  toNumber(value: any) {
    if (!value)
      return 0;
    return Number(value);
  }
}

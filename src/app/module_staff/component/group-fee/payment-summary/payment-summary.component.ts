import {Component, OnInit} from '@angular/core';
import {FeeService} from "../../../../service/fee.service";
import {PrintService} from "../../../../service/print.service";
import {DatePipe} from "@angular/common";
import * as addDays from 'date-fns/add_days';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})
export class PaymentSummaryComponent implements OnInit {
  filterDateRange: any = [new Date(), new Date()];
  summaryList: any;
  loading: any = false;
  mapOfExpandData: { [key: string]: boolean } = {};

  constructor(
    public feeService: FeeService,
    public printService: PrintService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //let yesterday =  this.datePipe.transform(addDays(today, -1), 'yyyy-MM-dd');
    this.filterDateRange = [today + ' 00:00:00', today + ' 23:59:59'];
    this.loadPaymentSummaryList();
  }

  loadPaymentSummaryList() {
    let dateFilter = {};
    dateFilter['startDate'] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
    dateFilter['endDate'] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss')
    this.loading = true;
    this.feeService.getPaymentSummaryList(dateFilter).subscribe(
      response => {
        this.loading = false;
        if (response) {
          this.summaryList = response.content;
        }
      }
    );
  }

  getTotalCashAmount() {
    if (this.summaryList)
      return this.summaryList.reduce((total, summary) => total + summary.totalCashAmount, 0).toFixed(2);

  }

  getTotalBankTransferAmount() {
    if (this.summaryList)
      return this.summaryList.reduce((total, summary) => total + summary.totalBankAmount, 0).toFixed(2);

  }

  getTotalWechatPaymentAmount() {
    if (this.summaryList)
      return this.summaryList.reduce((total, summary) => total + summary.totalWechatAmount, 0).toFixed(2);

  }

  getTotalAliPaymentAmount() {
    if (this.summaryList)
      return this.summaryList.reduce((total, summary) => total + summary.totalAliAmount, 0).toFixed(2);

  }

  getTotalAmount() {
    if (this.summaryList)
      return this.summaryList.reduce((total, summary) => total + summary.totalAmount, 0).toFixed(2);
  }

  printClicked() {
    let dateRange = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd') + '至'
      + this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd');
    this.printService.onPrintClicked.emit({
      name: 'paymentSummary',
      data: {
        summaryList: this.summaryList,
        dateRange: dateRange,
      }
    });
  }


  getStatusColour(payment: any) {
    let colour = null;
    if (payment.paymentType == '退费')
      colour = 'red';
    return {'color': colour};
  }

  getTotalAmountInChinese() {
    if (this.summaryList) {
      let totalAmount = this.summaryList.reduce((total, summary) => total + summary.totalAmount, 0).toFixed(2);
      return this.feeService.toChineseNumeral(totalAmount)
    }
  }
}

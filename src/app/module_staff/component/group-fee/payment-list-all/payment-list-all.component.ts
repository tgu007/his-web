import { Component, OnInit } from '@angular/core';
import {FeeService} from "../../../../service/fee.service";
import {DatePipe} from "@angular/common";
import * as globals from "../../../../../globals";

@Component({
  selector: 'app-payment-list-all',
  templateUrl: './payment-list-all.component.html',
  styleUrls: ['./payment-list-all.component.css']
})
export class PaymentListAllComponent implements OnInit {
  filterDateRange: any = [new Date(), new Date()];
  loading: any;
  paymentList: any;
  totalDataCount: any;
  //currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;


  constructor(public feeService: FeeService,
              private datePipe: DatePipe,
              ) { }

  ngOnInit() {
    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //let yesterday =  this.datePipe.transform(addDays(today, -1), 'yyyy-MM-dd');
    this.filterDateRange = [today + ' 00:00:00', today + ' 23:59:59'];
    this.loadPaymentList();
  }

  loadPaymentList() {

    let dateFilter = {};
    dateFilter['startDate'] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
    dateFilter['endDate'] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss')
    this.loading = true;
    this.feeService.getAllPaymentList(dateFilter)
      .subscribe(response => {
        if (response) {
          this.totalDataCount = response.totalCount;
          this.paymentList = response.content;
          this.loading = false;
        }
      });

  }

  getStatusColour(payment: any) {
    let colour = null;
    if (payment.paymentType == '退费')
      colour = 'red';
    return {'color': colour};
  }

  getTotalAmount() {
    if (this.paymentList)
      return this.paymentList.reduce((total, summary) => total + summary.amount, 0).toFixed(2);
    return 0;
  }

  getTotalAmountInChinese() {
      let totalAmount = this.getTotalAmount();
      return this.feeService.toChineseNumeral(totalAmount)
  }
}

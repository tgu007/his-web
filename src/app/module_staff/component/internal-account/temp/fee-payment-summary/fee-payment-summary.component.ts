import { Component, OnInit } from '@angular/core';
import * as globals from "../../../../../../globals";
import {InternalAccountService} from "../../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-fee-payment-summary',
  templateUrl: './fee-payment-summary.component.html',
  styleUrls: ['./fee-payment-summary.component.css']
})
export class FeePaymentSummaryComponent implements OnInit {
  isLoading: any = false;
  feePaymentList: any;
  tablePageSize = globals.tablePageSize;

  constructor(private internalAccountService: InternalAccountService,
              private message: NzMessageService,) { }

  ngOnInit() {
    this.loadFeePaymentList();
  }

  loadFeePaymentList() {
    this.isLoading = true;
    this.internalAccountService.getFeePaymentList()
      .subscribe(response => {
          if (response) {
            this.feePaymentList = response.content;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }
}

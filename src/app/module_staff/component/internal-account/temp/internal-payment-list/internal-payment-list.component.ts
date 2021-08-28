import {Component, OnInit, ViewChild} from '@angular/core';
import {InternalAccountService} from "../../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {InternalFeeDetailComponent} from "../internal-fee-detail/internal-fee-detail.component";
import {InternalPaymentDetailComponent} from "../internal-payment-detail/internal-payment-detail.component";
import * as globals from "../../../../../../globals";
import {PatientService} from "../../../../../service/patient.service";
import {PrintService} from "../../../../../service/print.service";

@Component({
  selector: 'app-internal-payment-list',
  templateUrl: './internal-payment-list.component.html',
  styleUrls: ['./internal-payment-list.component.css']
})
export class InternalPaymentListComponent implements OnInit {
  filterSignInNumber: any;
  filterPatientInfo: any;
  isLoading: any = false;
  paymentList: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  totalDataCount: any;
  @ViewChild(InternalPaymentDetailComponent, {static: true}) paymentDetailComponent: InternalPaymentDetailComponent;
  paymentDetailModalVisible: any = false;
  listOfSelectedPaymentStatus: any = ['待缴费', '已缴费'];
  totalFeeAmount: any;
  totalPaidAmount: any;
  balanceAmount: any;

  constructor(
    private internalAccountService: InternalAccountService,
    private message: NzMessageService,
    public printService: PrintService,
  ) {
  }

  ngOnInit() {
    this.loadPaymentList();
  }

  searchPayment() {
    this.currentPageIndex = 1
    this.loadPaymentList();
  }

  initPaymentDetailModal() {
    this.paymentDetailComponent.resetUI();
    this.paymentDetailModalVisible = true;
  }

  reloadPaymentClicked() {
    this.filterSignInNumber = undefined
    this.filterPatientInfo = undefined
    this.loadPaymentList();
  }

  loadPaymentList() {
    this.isLoading = true;
    let filter = {};
    if (this.filterSignInNumber != undefined && this.filterSignInNumber != '')
      filter['signInNumber'] = this.filterSignInNumber;

    if (this.filterPatientInfo != undefined && this.filterPatientInfo != '')
      filter['patientInfo'] = this.filterPatientInfo;

    filter['paymentStatusList'] = this.listOfSelectedPaymentStatus;

    this.internalAccountService.getPagedPaymentList(filter, this.currentPageIndex)
      .subscribe(response => {
          if (response) {
            this.paymentList = response.content.paymentList.content;
            this.totalDataCount = response.content.paymentList.totalCount;
            this.totalFeeAmount = response.content.totalFeeAmount;
            this.totalPaidAmount = response.content.totalPaidAmount;
            this.balanceAmount = response.content.balanceAmount;

          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  cancelPayment(data: any) {
    this.isLoading = true;
    this.internalAccountService.cancelPayment(data.uuid)
      .subscribe(response => {
          this.loadPaymentList();
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  handleCancel() {
    this.paymentDetailModalVisible = false;
  }

  savePayment() {
    this.paymentDetailComponent.save();
  }

  onPaymentSaved($event: any) {
    this.paymentDetailModalVisible = false;
    this.loadPaymentList();
  }

  confirmPayment(data: any) {
    this.isLoading = true;
    this.internalAccountService.confirmPayment(data.uuid)
      .subscribe(response => {
          this.loadPaymentList();
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  printPayment(data: any) {
    this.printService.onPrintClicked.emit({
      name: 'internalPaymentList',
      data: {
        payment: data,
      }
    });
  }
}

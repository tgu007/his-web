import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as globals from "../../../../../globals";
import {InternalPaymentDetailComponent} from "../temp/internal-payment-detail/internal-payment-detail.component";
import {InternalAccountService} from "../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";
import {PrintService} from "../../../../service/print.service";
import {HisInternalPaymentDetailComponent} from "../his-internal-payment-detail/his-internal-payment-detail.component";

@Component({
  selector: 'app-his-internal-payment-list',
  templateUrl: './his-internal-payment-list.component.html',
  styleUrls: ['./his-internal-payment-list.component.css']
})
export class HisInternalPaymentListComponent implements OnInit {
  @Input() patientSignIn:any;
  isLoading: any = false;
  paymentList: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  totalDataCount: any;
  @ViewChild(HisInternalPaymentDetailComponent, {static: true}) paymentDetailComponent: HisInternalPaymentDetailComponent;
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
    this.loadPaymentList();
  }

  loadPaymentList() {
    this.isLoading = true;
    let filter = {};
    filter['paymentStatusList'] = this.listOfSelectedPaymentStatus;
    filter['patientSignInId'] = this.patientSignIn.uuid;

    this.internalAccountService.getHisPagedPaymentList(filter, this.currentPageIndex)
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
    this.internalAccountService.cancelHisPayment(data.uuid)
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
    this.internalAccountService.confirmHisPayment(data.uuid)
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
      name: 'hisInternalPaymentList',
      data: {
        payment: data,
        his:true,
      }
    });
  }
}

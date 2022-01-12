import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FeeService} from "../../../../service/fee.service";
import {PaymentDetailComponent} from "../payment-detail/payment-detail.component";
import * as globals from "../../../../../globals";
import {NzMessageService} from "ng-zorro-antd";
import {PatientService} from "../../../../service/patient.service";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  @Input() patientSignIn: any;
  paymentList: any;
  newPaymentModalVisible: any = false;
  @ViewChild(PaymentDetailComponent, {static: true}) newPrePaymentComponent: PaymentDetailComponent;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;

  constructor(public feeService: FeeService,
              private message: NzMessageService,
              private patientService: PatientService,
              public printService: PrintService,
  ) {
  }

  ngOnInit() {
    this.loadPaymentList();
  }


  newPaymentClicked() {
    this.newPaymentModalVisible = true;
    this.newPrePaymentComponent.resetUi(undefined);
  }


  reloadPaymentList() {
    this.loadPaymentList();
  }

  loadPaymentList() {
    this.patientService.getSignInDetail(this.patientSignIn.uuid).subscribe(
      response => {
        if (response) {
          this.patientSignIn = response.content;
        }
      }
    );
    this.feeService.getPatientPaymentList(this.patientSignIn.uuid, this.currentPageIndex)
      .subscribe(response => {
        if (response) {
          this.totalDataCount = response.totalCount;
          this.paymentList = response.content;
        }
      });
  }

  handleCancel() {
    this.newPaymentModalVisible = false;
  }

  saveNewPayment() {
    this.newPrePaymentComponent.saveNewPayment();
  }

  onNewPaymentSaved() {
    this.loadPaymentList();
    this.newPaymentModalVisible = false;
  }

  confirmPayment(payment: any) {
    this.feeService.confirmPayment(payment.uuid)
      .subscribe(response => {
          //this.message.create("success", "已确认");
          this.loadPaymentList();

        },
        error => {
          this.message.create("error", error.error.message);
        });
  }

  refundPayment(payment: any) {
    this.newPaymentModalVisible = true;
    this.newPrePaymentComponent.resetUi(payment);
  }

  cancelPayment(payment: any) {
    this.feeService.cancelPayment(payment.uuid)
      .subscribe(response => {
        this.message.create("success", "已作废");
        this.loadPaymentList();
      });
  }

  printPayment(payment: any) {
    this.printService.onPrintClicked.emit({
      name: 'payment',
      data: {
        payment: payment,
        patientSignIn: this.patientSignIn
      }
    });
  }




  getStatusColour(payment: any) {
    let colour = null;
    if (payment.paymentType == '退费')
      colour = 'red';
    return {'color': colour};
  }
}

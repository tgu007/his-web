import {Component, Input, OnInit} from '@angular/core';
import {PrescriptionService} from "../../../../service/prescription.service";
import {PatientService} from "../../../../service/patient.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {FeeService} from "../../../../service/fee.service";

@Component({
  selector: 'app-settlement-summary',
  templateUrl: './settlement-summary.component.html',
  styleUrls: ['./settlement-summary.component.css']
})
export class SettlementSummaryComponent implements OnInit {
  @Input() patientSignIn;
  @Input() isFinalSettle = false;
  loading: boolean = false;
  uploadingFee: any = false;
  preSettling: boolean = false;
  paymentMethodList: any;
  selectPaymentMethod: any;
  formatterDollar = (value: number) => `￥ ${value}`;
  parserDollar = (value: string) => value.replace('￥ ', '');
  paymentAmount: any = 0;
  creatingPayment: any = false;


  constructor(
    public patientService: PatientService,
    private ybService: YbTzService,
    private message: NzMessageService,
    private modal: NzModalService,
    private feeService: FeeService,
  ) {
  }

  ngOnInit() {
    this.feeService.getPaymentMethodList()
      .subscribe(response => {
        if (response) {
          this.paymentMethodList = response.content;
          //if(this.paymentMethodList.length > 0)
          this.selectPaymentMethod = this.paymentMethodList[2];
        }
      });

    this.paymentAmount = this.patientSignIn.accountBalance * -1;
  }

  uploadFee() {
    this.uploadingFee = true;
    this.ybService.uploadPatientFee(this.patientSignIn.uuid)
      .toPromise().then(response => {
      this.uploadingFee = false;
      this.patientService.getSignInDetail(this.patientSignIn.uuid).subscribe(
        response => {
          if (response) {
            this.patientSignIn.totalFeeAmount = response.content.totalFeeAmount;
            this.patientSignIn.coveredFeeAmount = response.content.coveredFeeAmount;
            this.patientSignIn.selfPayFeeAmount = response.content.selfPayFeeAmount;
            this.patientSignIn.pendingFeeAmount = response.content.pendingFeeAmount;
            this.patientSignIn.totalPaidAmount = response.content.accountBalance;
            this.modal.confirm({
              nzTitle: '更新预结信息',
              nzContent: '费用上传完毕，是否更新预结信息',
              nzOnOk: () => {
                this.preSettle();
              }
            });
          }
        }
      );

    })
      .catch(error => {
        this.uploadingFee = false;
        this.message.create("error", error.error.message);
      });
  }

  preSettle() {
    let pram = {};
    pram["patientSignInId"] = this.patientSignIn.uuid;
    pram["returnFeeDetail"] = false;
    this.preSettling = true;
    this.ybService.downloadPreSettlement(pram)
      .toPromise().then(response => {
      this.preSettling = false;
      this.message.create("success", "预结已更新");
      this.patientSignIn.preSettlement = response.content;
      console.log(this.patientSignIn.preSettlement);
    })
      .catch(error => {
        this.preSettling = false;
        this.message.create("error", error.error.message);
      });
  }

  creatPayment() {
    if (this.paymentAmount == 0)
      this.message.warning("缴费退费金额不能为0");
    let newPayment = {};
    newPayment["signInId"] = this.patientSignIn.uuid;
    if (this.paymentAmount > 0) {
      newPayment["paymentType"] = '结算缴费';
      newPayment["amount"] = this.paymentAmount;
      newPayment["status"] = '已缴费';
    } else {
      this.message.warning("请到缴费菜单退费");
      return;
      // newPayment["paymentType"] = '结算退费';
      // newPayment["amount"] = this.paymentAmount * -1;
      // newPayment["status"] = '已退费';
    }
    newPayment["paymentMethodId"] = this.selectPaymentMethod.id;

    this.creatingPayment = true;
    this.feeService.saveNewPayment(newPayment)
      .subscribe(response => {
          if (this.paymentAmount > 0)
            this.message.create("success", "缴费成功");
          else
            this.message.create("success", "退费成功");
          this.creatingPayment = false;
          this.patientService.getSignInDetail(this.patientSignIn.uuid).subscribe(
            response => {
              if (response) {
                this.patientSignIn = response.content;
                this.paymentAmount = this.patientSignIn.accountBalance * -1;
              }
            });
        },
        error => {
          this.creatingPayment = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  disablePayment() {
    if (this.patientSignIn) {
      if (this.patientSignIn.accountBalance == 0)
        return true;
      if (!this.patientSignIn.selfPay && !this.patientSignIn.settlement)
        return true;
    }
    return false;
  }
}

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PatientService} from "../../../../service/patient.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {HttpClient} from "@angular/common/http";
import {FeeService} from "../../../../service/fee.service";
import {PrintService} from "../../../../service/print.service";
import {PatientSignInDetailComponent} from "../patient-sign-in-detail/patient-sign-in-detail.component";
import {SettlementSummaryComponent} from "../../group-yb/settlement-summary/settlement-summary.component";

@Component({
  selector: 'app-patient-sign-in-settle',
  templateUrl: './patient-sign-in-settle.component.html',
  styleUrls: ['./patient-sign-in-settle.component.css']
})
export class PatientSignInSettleComponent implements OnInit {
  @Input() patientSignIn: any;
  isSaving: any = false;
  // preSettlement: any;
  signOutRequest: any;
  currentInvoiceNumber: any;
  printInvoiceModalVisible: boolean = false;
  generatingInvoice: any = false;
  private printSettlementModalVisible: boolean = false;
  @ViewChild(SettlementSummaryComponent, {static: true}) settlementSummaryComponent: SettlementSummaryComponent;


  constructor(private patientService: PatientService,
              private message: NzMessageService,
              private sessionService: SessionService,
              private ybService: YbTzService,
              private modal: NzModalService,
              private feeService: FeeService,
              public printService: PrintService,
  ) {
  }

  ngOnInit() {
    //this.preSettlement = undefined;
    this.signOutRequest = undefined;
    // this.patientService.getSignInDetail(this.patientSignIn.uuid)
    //   .subscribe(response => {
    //     if (response) {
    //       this.patientSignIn = response.content;
    //     }
    //   });

  }


  settle() {
    let clientUrl = {clientUrl: ''};
    // if (this.patientSignIn.selfPay)
    //   this.hisSettle(clientUrl);
    // else {
    //
    // }
    this.isSaving = true;
    this.hisSettle(clientUrl);
    // this.ybService.getLocalIpInfo()
    //   .toPromise().then(response => {
    //   clientUrl["clientUrl"] = response.content;
    //   clientUrl["employeeId"] = this.sessionService.loginUser.uuid;
    //   clientUrl["employeeName"] = this.sessionService.loginUser.name;
    //   this.hisSettle(clientUrl);
    // })
    //   .catch(error => {
    //     this.processError(error);
    //   });
  }


  selfHisSettle() {
    this.isSaving = true;
    this.ybService.selfSettle(this.patientSignIn.uuid).toPromise()
      .then(response => {
        this.isSaving = false;
        this.patientSignIn.settlement = response.content;
      })
      .catch(error => {
        this.processError(error);
      })
  }

  hisSettle(clientUrl: any) {
    this.isSaving = true;
    this.ybService.settle(this.patientSignIn.uuid, clientUrl).toPromise()
      .then(response => {
       this.refresh();
      })
      .catch(error => {
        this.processError(error);
      })
  }

  confirmSignOutClicked() {
    // if (!this.patientSignIn.selfPay) {
    //   if (this.patientSignIn.pendingFeeAmount != 0) {
    //     this.message.create("error", "有费用还未上传");
    //     return
    //   }
    //
    //   if (!this.patientSignIn.settlement) {
    //     this.message.create("error", "医保费用未结算");
    //     return
    //   }
    //   this.validateSignOutTotalFee();
    //
    // } else
    this.validateAccountBalance();
  }

  // private validateSignOutTotalFee() {
  //   if (this.patientSignIn.settlement.totalFeeAmount != this.patientSignIn.totalFeeAmount) {
  //     this.modal.confirm({
  //       nzTitle: '出院确认',
  //       nzContent: '医保上传总费用与记录费用不符合,点击确认继续出院，取消中断出院。',
  //       nzOnOk: () => {
  //         this.validateSignOutCoveredFee()
  //       }
  //     });
  //   } else
  //     this.validateSignOutCoveredFee()
  // }

  // private validateSignOutCoveredFee() {
  //   if (this.patientSignIn.settlement.coveredAmount != this.patientSignIn.coveredFeeAmount) {
  //     this.modal.confirm({
  //       nzTitle: '出院确认',
  //       nzContent: '医保报销费用与记录费用不符合，点击确认继续出院，取消中断出院。',
  //       nzOnOk: () => {
  //         this.validateAccountBalance();
  //       }
  //     });
  //   } else
  //     this.validateAccountBalance();
  // }

  private validateAccountBalance() {
    if (this.patientSignIn.accountBalance < 0) {
      this.modal.confirm({
        nzTitle: '出院确认',
        nzContent: '仍有欠费未缴，点击确认继续出院，取消中断出院。',
        nzOnOk: () => {
          this.confirmSignOut();
        }
      });
    } else
      this.confirmSignOut();
  }


  private confirmSignOut() {
    this.isSaving = true;
    this.patientService.confirmSignOut(this.patientSignIn.uuid)
      .subscribe(response => {
          if (response.content)
            this.patientSignIn = response.content;
          this.message.create("success", "出院办理成功");
          this.isSaving = false;
        },
        error => {
          this.processError(error);
        });
  }

  private processError(error: any) {
    this.message.create("error", error.error.message);
    this.isSaving = false;
  }


  allowSignOut() {
    // if(this.patientSignIn.selfPay)
    //   return true;
    if (this.patientSignIn.status != '待出院')
      return false;
    if (this.patientSignIn.settlement)
      return true;
    return false;
  }


  printInvoiceClicked() {
    this.isSaving = true;
    this.feeService.getCurrentInvoiceNumber().toPromise()
      .then(response => {
        this.currentInvoiceNumber = response.content;
        this.printInvoiceModalVisible = true;
        this.isSaving = false;
      })
  }

  printSettlementClicked() {
    this.isSaving = true;
    this.ybService.getSettlementSummary(this.patientSignIn.uuid).toPromise()
      .then(response => {
        this.isSaving = false;
        let pram = this.patientSignIn;
        pram['settleInfo'] = response.content;
        this.printService.onPrintClicked.emit({
          name: 'settlementSummary',
          data: pram
        });
      })
      .catch(error => {
      this.processError(error);
    })


  }


  generateInvoice() {
    this.generatingInvoice = true
    this.feeService.generateInvoice(this.patientSignIn.uuid, this.currentInvoiceNumber).toPromise()
      .then(response => {
        this.generatingInvoice = false
        this.printInvoiceModalVisible = false;
        this.printService.onPrintClicked.emit({
          name: 'invoice',
          data: response.content
        });
      }) .catch(error => {
      this.generatingInvoice = false
      this.processError(error);
    })
  }

  handleCancel() {
    this.printInvoiceModalVisible = false;
  }


  uploadSettlement() {
    this.isSaving = true;
    this.ybService.uploadSettlement(this.patientSignIn.uuid).toPromise()
      .then(response => {
        this.isSaving = false;
        this.message.success("成功上传")
      })
      .catch(error => {
        this.processError(error);
      })
  }

  downloadSettlement() {
    this.isSaving = true;
    this.ybService.downloadSettlement(this.patientSignIn.uuid).toPromise()
      .then(response => {
        this.isSaving = false;
        this.message.success("下载成功")
      })
      .catch(error => {
        this.processError(error);
      })
  }

  refresh() {
    this.patientService.getSignInDetail(this.patientSignIn.uuid).subscribe(
      response => {
        this.patientSignIn = response.content;
        this.settlementSummaryComponent.paymentAmount = this.patientSignIn.accountBalance * -1;
        this.isSaving = false;
      }
    );
  }
}

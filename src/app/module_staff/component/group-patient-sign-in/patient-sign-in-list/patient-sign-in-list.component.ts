import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PatientService} from "../../../../service/patient.service";
import * as globals from "../../../../../globals";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {PatientSignInDetailComponent} from "../patient-sign-in-detail/patient-sign-in-detail.component";
import {SessionService} from "../../../../service/session.service";
import {DomSanitizer} from "@angular/platform-browser";
import {PrintService} from "../../../../service/print.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {PatientSignInSelectComponent} from "../patient-sign-in-select/patient-sign-in-select.component";
import {PatientSignInSettleComponent} from "../patient-sign-in-settle/patient-sign-in-settle.component";
import {HttpClient} from "@angular/common/http";
import {FeeService} from "../../../../service/fee.service";
import {YbSignInRecordComponent} from "../yb-sign-in-record/yb-sign-in-record.component";

@Component({
  selector: 'app-patient-sign-in-list',
  templateUrl: './patient-sign-in-list.component.html',
  styleUrls: ['./patient-sign-in-list.component.css']
})
export class PatientSignInListComponent implements OnInit {
  patientSignInList: any;
  //patientName: any;
  searchCode: any;
  @Output() prePaymentClickedEvent = new EventEmitter<any>();
  totalPatientSignInListCount: any;
  currentPageIndex: any = 1;
  tablePageSize: any = globals.tablePageSize;
  signInModalVisible: any = false;
  @ViewChild(PatientSignInDetailComponent, {static: true}) patientSignInComponent: PatientSignInDetailComponent;
  selectStatus: any = ["待入院", "已入院", "待出院"];
  @Output() prescriptionClickedEvent = new EventEmitter<any>();
  @Output() settlementClickedEvent = new EventEmitter<any>();
  @Output() feeListClickedEvent = new EventEmitter<any>();
  @Output() nursingRecordListClickedEvent = new EventEmitter<any>();
  @Output() tempRecordListClickedEvent = new EventEmitter<any>();
  @Output() medicalRecordClickedEvent = new EventEmitter<any>();
  @Output() feeCheckClickedEvent = new EventEmitter<any>();
  isLoading: any = false;
  uiPermission;
  qrCodeModalVisible: any = false;
  qrCodeBase64: any = undefined;
  selectedPatientSignIn: any = undefined;
  filterPendingUploadFee: any = false;
  selectInsuranceType: any = ["医保", "工商", "自费"];
  // settleModalVisible: any = false;
  // @ViewChild(PatientSignInSettleComponent, {static: true}) patientSignInSettleComponent: PatientSignInSettleComponent;
  @Output() internalChargeFeeListClickedEvent = new EventEmitter<any>();
  @Output() internalChargeAutoFeeListClickedEvent = new EventEmitter<any>();
  @Output() internalChargePaymentListClickedEvent = new EventEmitter<any>();
  @Output() centerFeeValidationClickedEvent = new EventEmitter<any>();
  @Output() drgRecordClickedEvent = new EventEmitter<any>();
  printInvoiceModalVisible: any = false;
  generatingInvoice: any = false;
  currentInvoiceNumber: any;
  loadingDetail: any = false;
  patient3024Check: any = false;
  ybSignInRecordModalVisible: any = false;
  @ViewChild(YbSignInRecordComponent, {static: true}) ybSignInRecordComponent: YbSignInRecordComponent;


  constructor(private patientService: PatientService,
              private message: NzMessageService,
              public sessionService: SessionService,
              private sanitizer: DomSanitizer,
              public printService: PrintService,
              private ybService: YbTzService,
              private feeService: FeeService,
              private modal: NzModalService,
  ) {
  }

  ngOnInit() {
    this.uiPermission = this.sessionService.getUserPermission().commonComponent.patientSignIn;
    this.selectStatus = this.uiPermission.defaultStatus;
    this.loadPatientSignInList();
  }

  reloadPatientSignInList() {
    this.loadPatientSignInList();
  }

  loadPatientSignInList() {
    this.isLoading = true;
    let searchDto = {
      statusList: this.selectStatus,
      searchCode: this.searchCode,
      insuranceTypeList: this.selectInsuranceType
    }
    if (this.sessionService.getUserPermission().commonComponent.patientSignIn.filterOnDepartment)
      searchDto["departmentIdList"] = this.sessionService.loginUser.departmentIdList;
    if (this.filterPendingUploadFee)
      searchDto["pendingUploadFee"] = true;
    searchDto["check3024"] = this.patient3024Check;

    this.patientService.getPatientSignInList(this.currentPageIndex, searchDto)
      .subscribe(response => {
          if (response) {
            this.patientSignInList = response.content
            this.totalPatientSignInListCount = response.totalCount;
            this.isLoading = false;
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  paymentClicked(patientSignIn: any) {
    this.prePaymentClickedEvent.emit(patientSignIn);
  }


  private showHelpInfo(clientServerInfo: any, patientSignIn: any) {
    this.modal.info({
      nzContent: `扫码提示，弹出扫码界面后，请用鼠标右键点击一下电子凭证编码旁的输入框(光标闪烁处)。 若扫码失败，请让病人手动刷新手机上的二维码后再做尝试`,
      nzOnOk: () => {
        this.hisConfirmSignIn(clientServerInfo, patientSignIn);
      }
    });

  }

  confirmSignIn(patientSignIn: any, readElectronicCard) {
    let clientServerInfo = {clientUrl: ''};
    if (patientSignIn.selfPay)
      this.hisConfirmSignIn(clientServerInfo, patientSignIn);
    else {
      this.isLoading = true;
      this.ybService.getLocalIpInfo()
        .toPromise().then(response => {
        clientServerInfo["clientUrl"] = response.content;
        clientServerInfo["electronicCard"] = readElectronicCard;
        clientServerInfo["employeeId"] = this.sessionService.loginUser.uuid;
        clientServerInfo["employeeName"] = this.sessionService.loginUser.name;
        if (!readElectronicCard)
          this.hisConfirmSignIn(clientServerInfo, patientSignIn);
        else
          this.showHelpInfo(clientServerInfo, patientSignIn);
      })
        .catch(error => {
          this.processError(error);
        });
    }
  }

  hisConfirmSignIn(clientServerInfo: any, patientSignIn: any) {
    this.isLoading = true;
    this.patientService.confirmSignIn(patientSignIn.uuid, clientServerInfo)
      .toPromise().then(response => {
      this.message.create("success", "入院成功");
      this.reloadPatientSignInList();
      this.isLoading = false;
    })
      .catch(error => {
        this.processError(error);
      });
  }

  processError(error: any) {
    this.message.create("error", error.error.message);
    this.isLoading = false;
  }

  cancelSignIn(signInId: any) {
    this.patientService.cancelSignIn(signInId).toPromise().then(response => {
      this.message.create("success", "取消入院成功");
      this.reloadPatientSignInList();
      this.isLoading = false;
    })
      .catch(error => {
        this.processError(error);
      });
  }

  editSignInDetail(patientSignIn: any) {
    this.selectedPatientSignIn = patientSignIn;
    this.patientSignInComponent.resetUi(patientSignIn);
    this.signInModalVisible = true;
  }

  handleCancel() {
    this.signInModalVisible = false;
    this.qrCodeModalVisible = false;
    this.printInvoiceModalVisible = false;
    this.ybSignInRecordModalVisible = false;
  }

  saveNewSignIn() {
    this.patientSignInComponent.saveSignIn();
  }

  onSignInSaved($event: any) {
    this.reloadPatientSignInList();
  }

  settlementClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.settlementClickedEvent.emit(ret);
    });
  }

  cancelSignOutClicked(patientSignIn: any) {
    this.patientService.cancelSignOut(patientSignIn.uuid)
      .subscribe(response => {
        this.patientService.getSignInDetail(patientSignIn.uuid).subscribe(
          response => {
            if (response) {
              patientSignIn.status = response.content.status;
              this.message.create("success", "取消出院成功");
            }
          },
          error => {
            this.message.create("error", error.error.message);
            this.isLoading = false;
          }
        );

      });

  }

  prescriptionClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.prescriptionClickedEvent.emit(ret);
    });
  }

  feeListClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.feeListClickedEvent.emit(ret);
    });
  }

  nursingRecordListClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.nursingRecordListClickedEvent.emit(ret);
    });
  }

  tempRecordListClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.tempRecordListClickedEvent.emit(ret);
    });
  }

  medicalRecordClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.medicalRecordClickedEvent.emit(ret);
    });
  }

  allowModifySignInDetail() {
    if (this.sessionService.getUserPermission().superAdmin)
      return true;
    if (this.sessionService.getUserPermission().commonComponent.patient.allowSignIn) {
      return this.patientSignInComponent.allowModify();
    }
    return false;

  }

  printQrCode(patientSignIn: any) {
    this.qrCodeBase64 = undefined;
    this.selectedPatientSignIn = patientSignIn;
    this.patientService.getQrCode(patientSignIn.uuid).subscribe(
      response => {
        if (response) {
          //console.log(response.content);
          this.qrCodeModalVisible = true;
          this.qrCodeBase64 = response.content;
        }
      }
    );
  }

  getSafeQrCodeBase64() {
    return this.sanitizer.bypassSecurityTrustUrl(this.qrCodeBase64);
  }

  printQrCodeClicked() {
    this.handleCancel();
    this.printService.onPrintClicked.emit({
      name: 'patientQrCode',
      data: {qrCode: this.qrCodeBase64, patientName: this.selectedPatientSignIn.patientName}
    });
  }

  printSignInDetailClicked() {
    this.patientService.getSignInDetail(this.selectedPatientSignIn.uuid).subscribe(
      response => {
        if (response) {
          this.handleCancel();
          this.printService.onPrintClicked.emit({
            name: 'patientSignInDetail',
            data: response.content,
          });
        }
      }
    );
  }


  uploadFee(patientSignIn: any) {
    this.isLoading = true;
    this.ybService.uploadPatientFee(patientSignIn.uuid)
      .toPromise().then(response => {
      this.isLoading = false;
      this.message.create("success", "费用上传完毕");
      this.loadPatientSignInList();
    })
      .catch(error => {
        this.processError(error);
      });
  }

  deleteAllUploadFee(patientSignIn: any) {
    this.modal.confirm({
      nzContent: '点击确认会删除所有医保端已经上传完成的费用',
      nzOnOk: () => {
        this.isLoading = true;
        this.ybService.deleteAllUploadFee(patientSignIn.uuid)
          .toPromise().then(response => {
          this.isLoading = false;
          this.message.create("success", "医保端费用已删除");
          this.loadPatientSignInList();
        })
          .catch(error => {
            this.processError(error);
          });
      }
    });
  }

  feeCheck(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.feeCheckClickedEvent.emit(ret);
    });
  }

  internalAutoFeeClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.internalChargeAutoFeeListClickedEvent.emit(ret);
    });
  }

  internalChargeFeeListClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.internalChargeFeeListClickedEvent.emit(ret);
    });
  }

  internalPaymentListClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.internalChargePaymentListClickedEvent.emit(ret);
    });
  }

  loadSignInDetail(patientSignInId: any) {
    return new Promise((resolve) => {
      this.loadingDetail = true;
      this.patientService.getSignInDetail(patientSignInId).subscribe(
        response => {
          this.loadingDetail = false;
          resolve(response.content);
        }
      );
    });
  }


  centerFeeValidation(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.centerFeeValidationClickedEvent.emit(ret);
    });
  }

  printInvoice(patientSignIn: any) {
    this.isLoading = true;
    this.feeService.getCurrentInvoiceNumber().toPromise()
      .then(response => {
        this.currentInvoiceNumber = response.content;
        this.printInvoiceModalVisible = true;
        this.selectedPatientSignIn = patientSignIn
        this.isLoading = false;
      })
  }

  generateInvoice() {
    this.printInvoiceModalVisible = false;
    this.feeService.generateInvoice(this.selectedPatientSignIn.uuid, this.currentInvoiceNumber).toPromise()
      .then(response => {
        this.currentInvoiceNumber = undefined;
        this.selectedPatientSignIn = undefined;
        this.printService.onPrintClicked.emit({
          name: 'invoice',
          data: response.content
        });
      })
  }

  selfYBSignIn(signInId: any) {
    this.isLoading = true;
    this.ybService.selfYBSignIn(signInId).toPromise()
      .then(response => {
        this.isLoading = false;
        this.message.create("success", "自费病人登记完成");
      })
      .catch(error => {
        this.processError(error);
      })
  }

  cancelYBSignIn(signInId: any) {
    this.isLoading = true;
    let clientServerInfo = {};
    this.ybService.getLocalIpInfo()
      .toPromise().then(response => {
      clientServerInfo["clientUrl"] = response.content;
      clientServerInfo["employeeId"] = this.sessionService.loginUser.uuid;
      clientServerInfo["employeeName"] = this.sessionService.loginUser.name;
      this.hisCancelSignIn(clientServerInfo, signInId);
    })
      .catch(error => {
        this.processError(error);
      });
  }

  private hisCancelSignIn(clientServerInfo: any, signInId: any) {
    this.ybService.cancelYBSignIn(clientServerInfo, signInId).toPromise()
      .then(response => {
        this.isLoading = false;
        this.message.create("success", "医保入院取消成功");
      })
      .catch(error => {
        this.processError(error);
      })
  }


  ybSignInRecordClicked(patientSignIn: any) {
    this.ybSignInRecordComponent.resetUI(patientSignIn);
    this.ybSignInRecordModalVisible = true;
  }

  drgRecordClicked(patientSignIn: any) {
    this.loadSignInDetail(patientSignIn.uuid).then((ret) => {
      this.drgRecordClickedEvent.emit(ret);
    });
  }

  cloneToNewSignIn(patientSignIn: any) {
    this.modal.confirm({
      nzContent: `确认复制${patientSignIn.patientName}的入院证`,
      nzOnOk: () => {
        this.isLoading = true;
        this.patientService.clonePatientSignIn(patientSignIn.uuid)
          .toPromise().then(response => {
          this.reloadPatientSignInList();
          this.selectedPatientSignIn = response.content;
          this.patientSignInComponent.resetUi(response.content);
          this.signInModalVisible = true;
          this.isLoading = false;
        })
          .catch(error => {
            this.processError(error);
          });
      }
    });
  }


}

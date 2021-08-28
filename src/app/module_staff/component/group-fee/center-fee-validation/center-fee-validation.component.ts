import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {PatientService} from "../../../../service/patient.service";
import * as globals from "../../../../../globals";
import {PatientFeeDetailComponent} from "../patient-fee-detail/patient-fee-detail.component";
import {SettlementSummaryComponent} from "../../group-yb/settlement-summary/settlement-summary.component";

@Component({
  selector: 'app-center-fee-validation',
  templateUrl: './center-fee-validation.component.html',
  styleUrls: ['./center-fee-validation.component.css']
})
export class CenterFeeValidationComponent implements OnInit {

  @Input() patientSignIn: any;
  @ViewChild(SettlementSummaryComponent, {static: true}) settlementSummary: SettlementSummaryComponent;
  preSettling: any = false;
  uploadingFee: any = false;
  confirmModal?: NzModalRef;
  deletingAllFee: any = false;
  downloadingFee: any = false;
  isLoading: any = false;
  centerFeeList: any;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  allHisFeeDownloaded: any = false;
  allCenterFeeValidated: any = false;
  private validatingFeeDetail: boolean = false;

  constructor(private ybService: YbTzService,
              private message: NzMessageService,
              private modal: NzModalService,
              private patientService: PatientService,
  ) {
  }

  ngOnInit() {
    this.refresh();
  }


  deleteAllFeeClicked() {
    this.confirmModal = this.modal.confirm({
      nzTitle: '删除所有已上传至医保的费用',
      nzContent: '继续会删除所有已经上传的费用，所有费用需要重新上传。如果和医保有出入的费用明细不是非常多，请比较明细使用单条删除！点击确认继续执行删除！',
      nzOnOk: () => {
        this.deleteAllFee()
      }
    });
  }

  deleteAllFee() {
    this.deletingAllFee = true;
    this.ybService.deleteAllUploadFee(this.patientSignIn.uuid)
      .toPromise().then(response => {
      this.deletingAllFee = false;
      this.patientService.getSignInDetail(this.patientSignIn.uuid).subscribe(
        response => {
          if (response) {
            this.patientSignIn = response.content;
            //this.settlementSummary.patientSignIn = this.patientSignIn;
            this.message.create("success", "医保端所有费用已经删除");
            this.reloadDownloadedFeeList();
          }
        }
      );
    })
      .catch(error => {
        this.deletingAllFee = false;
        this.message.create("error", error.error.message);
      });
  }

  downloadFeeClicked() {
    this.confirmModal = this.modal.confirm({
      nzTitle: '下载医保费用明细',
      nzContent: '如果病人费用较多会需要较长时间下载，按确认开始下载',
      nzOnOk: () => {
        this.downloadFee()
      }
    });
  }

  downloadFee() {
    this.downloadingFee = true;
    this.ybService.downloadPatientFee(this.patientSignIn.uuid)
      .toPromise().then(response => {
      this.downloadingFee = false;
      this.message.create("success", "下载成功");
      this.reloadDownloadedFeeList();
    })
      .catch(error => {
        this.downloadingFee = false;
        this.message.create("error", error.error.message);
      });
  }


  reloadDownloadedFeeList() {
    let filter = {patientSignInId: this.patientSignIn.uuid};
    this.isLoading = true;
    this.ybService.loadDownloadedFeeList(filter, this.currentPageIndex)
      .toPromise().then(response => {
      this.isLoading = false;
      if (response) {
        this.centerFeeList = response.content;
        this.totalDataCount = response.totalCount;
        this.checkHisFeeDownloaded();
      }
    })
      .catch(error => {
        this.isLoading = false;
        this.message.create("error", error.error.message);
      });
  }

  deleteCenterFee(data: any) {
    this.isLoading = true;
    this.ybService.deleteCenterFee(data.uuid)
      .toPromise().then(response => {
      this.isLoading = false;
      this.patientService.getSignInDetail(this.patientSignIn.uuid).subscribe(
        response => {
          if (response) {
            this.patientSignIn = response.content;
            //this.settlementSummary.patientSignIn = this.patientSignIn;
            this.message.create("success", "删除成功");
            this.reloadDownloadedFeeList();
          }
        }
      );
    })
      .catch(error => {
        this.isLoading = false;
        this.message.create("error", error.error.message);
      });
  }

  refresh() {
    this.patientService.getSignInDetail(this.patientSignIn.uuid).subscribe(
      response => {
        if (response) {
          this.patientSignIn = response.content;

          //this.settlementSummary.patientSignIn = this.patientSignIn;
        }
      }
    );
    this.reloadDownloadedFeeList()
  }

  getUserGuidInfo() {
    if (this.patientSignIn) {
      if (this.patientSignIn.pendingFeeAmount > 0)
        return '有待传费用，请先上传所有费用，若上传后待传费用没有变为0元，请至费用清单检查没有成功上传的费用'
      else if (!this.patientSignIn.preSettlement)
        return '没有预结信息，请点击医保预结进行预结算'
      else if (this.patientSignIn.preSettlement.zje != this.patientSignIn.totalFeeAmount)
        return '预结总金额与系统记录总金额不符，请尝试重新预结算'
      else if (!this.allHisFeeDownloaded)
        return '存在未下载的医保中心费用，请点击下载已上传的费用'
      else if (!this.allCenterFeeValidated)
        return '下载的中心费用与HIS费用核对有错误，请检查最下方的医保端费用与本地系统费用明细对比列表'
    }
    return '费用明细核对准确，现在可以关闭对账页面，打开出院处理，点击病区核费完成并通知医生。';
  }

  getUserGuidInfoType() {
    if (this.patientSignIn) {
      if (this.patientSignIn.pendingFeeAmount > 0)
        return 'warning'
      else if (!this.patientSignIn.preSettlement)
        return 'warning'
      else if (this.patientSignIn.preSettlement.zje != this.patientSignIn.totalFeeAmount)
        return 'warning'
      else if (!this.allHisFeeDownloaded)
        return 'warning'
      else if (!this.allCenterFeeValidated)
        return 'error'
    }

    return 'success';
  }

  private checkHisFeeDownloaded() {
    this.validatingFeeDetail = true;
    this.ybService.allHisFeeDownloaded(this.patientSignIn.uuid)
      .toPromise().then(response => {
      this.allHisFeeDownloaded = response.content;
      this.validatingFeeDetail = false;
      if (this.allHisFeeDownloaded)
        this.checkAllCenterFeeValid()

    })
      .catch(error => {
        this.validatingFeeDetail = false;
        this.message.create("error", error.error.message);
      });
  }

  private checkAllCenterFeeValid() {
    this.validatingFeeDetail = true;
    this.ybService.allCenterFeeValidated(this.patientSignIn.uuid)
      .toPromise().then(response => {
      this.allCenterFeeValidated = response.content;
      this.validatingFeeDetail = false;
    })
      .catch(error => {
        this.validatingFeeDetail = false;
        this.message.create("error", error.error.message);
      });
  }
}

import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PatientService} from "../../../../service/patient.service";
import {PatientSignInSelectComponent} from "../patient-sign-in-select/patient-sign-in-select.component";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {PatientSignInInfoComponent} from "../patient-sign-in-Info/patient-sign-in-info.component";
import {PatientSignOutComponent} from "../patient-sign-out/patient-sign-out.component";
import {SessionService} from "../../../../service/session.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {BasicService} from "../../../../service/basic.service";
import * as globals from "../../../../../globals";

@Component({
  selector: 'app-ward-list',
  templateUrl: './ward-list.component.html',
  styleUrls: ['./ward-list.component.css']
})
export class WardListComponent implements OnInit {
  wardList: any = [];
  @Output() prescriptionClickedEvent = new EventEmitter<any>();
  @Output() feeListClickedEvent = new EventEmitter<any>();
  @Output() autoFeeListClickedEvent = new EventEmitter<any>();
  @Output() nursingRecordListClickedEvent = new EventEmitter<any>();
  @Output() tempRecordListClickedEvent = new EventEmitter<any>();
  @Output() medicalRecordClickedEvent = new EventEmitter<any>();
  @Output() centerFeeValidationClickedEvent = new EventEmitter<any>();
  @Output() drgRecordClickedEvent = new EventEmitter<any>();
  patientSignInVisible: any;
  bedToAssign: any;
  patientList: any;
  @ViewChild(PatientSignInSelectComponent, {static: true}) signInSelectComponent: PatientSignInSelectComponent;
  selectedWardRoomPanelIndex: number = 0;
  selectedWardPanelIndex: number = 0;
  collapsed: any = false;

  @ViewChild(PatientSignInInfoComponent, {static: true}) patientSignInInfo: PatientSignInInfoComponent;
  signOutModalVisible: any = false;

  @ViewChild(PatientSignOutComponent, {static: true}) patientSignOutComponent: PatientSignOutComponent;
  isLoading: any = false;
  hideEmptyBed: any = true;
  selectedBed: any;
  currentBedTreatment: any;

  @Output() internalChargeFeeListClickedEvent = new EventEmitter<any>();
  @Output() internalChargeAutoFeeListClickedEvent = new EventEmitter<any>();
  @Output() feeCheckClickedEvent = new EventEmitter<any>();


  //Todo 颜色信息赢改为数据库结构
  nursingLevelColourList = [
    {name: "Ⅰ级护理", colour: "pink"},
    {name: "Ⅱ级护理", colour: "yellow"},
    {name: "Ⅲ级护理", colour: "orange"},
    {name: "特级护理", colour: "red"}];
  bedFeeSetupModalVisible: any = false;
  selectionTablePageSize = globals.selectionPageSize;
  treatmentListTotalCount: any;
  pageCount: any;
  treatmentList: any;
  selectedTreatment: any;
  uiPermission: any;
  searchCode: any;
  timer: any;


  constructor(private patientService: PatientService,
              private message: NzMessageService,
              public sessionService: SessionService,
              private ybService: YbTzService,
              private basicService: BasicService,
              private modal: NzModalService,
  ) {
  }

  ngOnInit() {
    this.uiPermission = this.sessionService.getUserPermission().commonComponent.patientSignIn;
    this.loadWardList(false);

    this.timer = setInterval(() => {
      this.loadWardList(false);
    }, 600000)
  }


  loadWardList(reset:any = false) {
    if(reset)
      this.searchCode = undefined;

    this.isLoading = true;
    let wardFilter = {
      hideEmptyBed: this.hideEmptyBed,
      searchCode: this.searchCode,
    };
    if (!this.sessionService.getUserPermission().fullWardPermission)
      wardFilter["wardIdList"] = this.sessionService.loginUser.wardIdList;

    this.patientService.getWardList(wardFilter)
      .subscribe(response => {
          if (response) {
            this.wardList = response.content;
            this.isLoading = false;
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }


  prescriptionClicked(currentSignIn: any) {
    this.prescriptionClickedEvent.emit(currentSignIn);
  }


  feeListClicked(currentSignIn: any) {
    this.feeListClickedEvent.emit(currentSignIn);
  }

  autoFeeListClicked(currentSignIn: any) {
    this.autoFeeListClickedEvent.emit(currentSignIn);
  }

  selectSignIn(wardRoomBed: any) {
    this.bedToAssign = wardRoomBed;
    this.patientSignInVisible = true;
    this.signInSelectComponent.loadPatientSignInList();
  }

  selectSignInClose() {
    this.patientSignInVisible = false;
  }

  assignBed(selectedSignIn: any) {
    this.signInSelectComponent.busy = true;
    this.patientService.assignSignInBed({patientSignInId: selectedSignIn.uuid, bedId: this.bedToAssign.uuid})
      .subscribe(response => {
          if (response) {
            this.message.create("success", "床位分配成功")
            this.loadWardList(false);
            this.patientSignInVisible = false;
          }
          this.signInSelectComponent.busy = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.signInSelectComponent.busy = false;
        });
  }

  wardPanelActiveChanged(isActive: boolean, panelIndex: number) {
    if (isActive)
      this.selectedWardPanelIndex = panelIndex;
    else
      this.selectedWardPanelIndex = 0;
  }

  roomPanelActiveChanged(isActive: boolean, panelIndex: number) {
    if (isActive)
      this.selectedWardRoomPanelIndex = panelIndex;
    else
      this.selectedWardRoomPanelIndex = 0;
  }

  wardRoomBedCardClicked(wardRoomBed: any) {
    this.patientSignInInfo.resetDisplayInfo(wardRoomBed.currentSignIn);
    this.selectedBed = wardRoomBed
  }


  tempRecordListClicked(currentSignIn: any) {
    this.tempRecordListClickedEvent.emit(currentSignIn);
  }

  nursingRecordListClicked(currentSignIn: any) {
    this.nursingRecordListClickedEvent.emit(currentSignIn);
  }

  signOutClicked(currentSignIn: any) {
    this.patientSignOutComponent.resetUi(currentSignIn);
    this.signOutModalVisible = true;
  }

  okButtonClicked() {
    this.patientSignOutComponent.processSignOut();
  }

  handleCancel() {
    this.signOutModalVisible = false;
    this.bedFeeSetupModalVisible = false;
  }

  cancelSignOutClicked(currentSignIn: any) {
    this.patientService.cancelSignOut(currentSignIn.uuid)
      .subscribe(response => {
        this.patientService.getSignInDetail(currentSignIn.uuid).subscribe(
          response => {
            if (response) {
              currentSignIn.status = response.content.status;
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

  onSignOutRequestSaved(patientSignIn: any) {
    // this.patientService.getSignInDetail(patientSignIn.uuid).subscribe(
    //   response => {
    //     if (response) {
    //       //this.signOutModalVisible = false;
    //
    //     }
    //   },
    //   error => {
    //     this.message.create("error", error.error.message);
    //     this.isLoading = false;
    //   }
    // );
    this.loadWardList();
  }

  medicalRecordClicked(currentSignIn: any) {
    this.medicalRecordClickedEvent.emit(currentSignIn);
  }

  getNursingLevelColour(nursingLevel: any) {
    let nursingLevelColour;
    if (nursingLevel) {
      let matchedNursingLevel = this.nursingLevelColourList.find(c => c.name == nursingLevel.name);
      if (matchedNursingLevel)
        nursingLevelColour = matchedNursingLevel.colour;
      //console.log(nursingLevelColour);
    }
    return nursingLevelColour;
  }


  onMouseOverCard(wardRoomBed: any) {
    this.selectedBed = wardRoomBed;
  }

  bedFeeSetupClicked(wardRoomBed: any) {
    this.bedFeeSetupModalVisible = true;
    this.selectedTreatment = undefined;
    this.currentBedTreatment = undefined;
    if (wardRoomBed.treatmentId) {
      this.basicService.getTreatment(wardRoomBed.treatmentId)
        .subscribe(response => {
          this.currentBedTreatment = response.content;
        });
    }
    if (!this.treatmentList)
      this.searchTreatment({pageNumber: 0});
  }

  saveBedFeeSetupClicked() {
    let pram = {}
    pram["bedId"] = this.selectedBed.uuid;
    pram["treatmentId"] = this.selectedTreatment.uuid;
    this.basicService.updateBedTreatment(pram).subscribe(response => {
      if (response.content) {
        this.currentBedTreatment = response.content;
        this.selectedBed.treatmentId = this.currentBedTreatment.uuid;
        this.message.create("success", "床位费用更新成功");
      }
    });
  }

  searchTreatment(dynamicSelectEvent: any) {
    let treatmentFilter = {enabled: true, feeTypeName: '床位费'};
    this.basicService.getSelectionPagedTreatmentList(treatmentFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content);
          this.treatmentListTotalCount = response.totalCount;
          this.pageCount = response.totalPages;
        }
      });
  }

  private buildItemDynamicSelectionValueList(selectTreatmentDropdownData: any) {
    for (let treatment of selectTreatmentDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(treatment.name);
      dynamicItemValueList.push(treatment.listPrice);
      treatment["label"] = dynamicItemValueList[0];
      treatment["valueList"] = dynamicItemValueList;
    }
    this.treatmentList = selectTreatmentDropdownData;
  }

  internalAutoFeeClicked(patientSignIn: any) {
    this.internalChargeAutoFeeListClickedEvent.emit(patientSignIn);
  }

  internalChargeFeeListClicked(patientSignIn: any) {
    this.internalChargeFeeListClickedEvent.emit(patientSignIn);
  }

  feeCheckListClicked(patientSignIn: any) {
    this.feeCheckClickedEvent.emit(patientSignIn);
  }

  showButton(buttonPermission: any, allowCreateNew: boolean, allowedStatus: any) {
    if (!this.sessionService.getUserPermission().commonComponent.patientSignIn[buttonPermission])
      return false
    if (this.patientSignOutComponent != null) {
      let patientSignIn = this.patientSignOutComponent.patientSignIn;
      if (!patientSignIn.signOutReq)
        return allowCreateNew;
      else {
        if (allowedStatus.find(s => s == patientSignIn.signOutReq.status))
          return true;
      }
    }
    return false;
  }

  onSignOutRequestDeleted() {
    this.signOutModalVisible = false;
    this.loadWardList();
  }


  downloadCenterFeeClicked(patientSignIn) {
    this.modal.confirm({
      nzTitle: '下载医保费用明细',
      nzContent: '如果病人费用较多会需要较长时间下载，按确认开始下载',
      nzOnOk: () => {
        this.downloadFee(patientSignIn)
      }
    });
  }

  downloadFee(patientSignIn) {
    this.isLoading = true;
    this.ybService.downloadPatientFee(patientSignIn.uuid)
      .toPromise().then(response => {
      this.isLoading = false;
      this.message.create("success", "下载成功");
    })
      .catch(error => {
        this.isLoading = false;
        this.message.create("error", error.error.message);
      });
  }

  deleteAllUploadFeeClicked(patientSignIn: any) {
    this.modal.confirm({
      nzContent: '点击确认会删除所有医保端已经上传完成的费用',
      nzOnOk: () => {
        this.isLoading = true;
        this.ybService.deleteAllUploadFee(patientSignIn.uuid)
          .toPromise().then(response => {
          this.isLoading = false;
          this.message.create("success", "医保端费用已删除");
          this.loadWardList();
        })
          .catch(error => {
            this.processError(error);
          });
      }
    });
  }

  uploadFeeClicked(patientSignIn: any) {
    this.isLoading = true;
    this.ybService.uploadPatientFee(patientSignIn.uuid)
      .toPromise().then(response => {
      this.isLoading = false;
      this.message.create("success", "费用上传完毕");
      this.loadWardList();
    })
      .catch(error => {
        this.processError(error);
      });
  }

  centerFeeValidationClicked(patientSignIn: any) {
    this.centerFeeValidationClickedEvent.emit(patientSignIn);
  }

  private processError(error: any) {
    this.message.create("error", error.error.message);
    this.isLoading = false;
  }

  drgRecordClicked(patientSignIn: any) {
    this.drgRecordClickedEvent.emit(patientSignIn);
  }

  signOutCurrentBek(currentSignIn: any) {
    this.patientService.signOutCurrentBed(currentSignIn.uuid)
      .toPromise().then(response => {
      this.message.create("success", "操作成功");
      this.loadWardList();
    })
      .catch(error => {
        this.processError(error);
      });
  }
}

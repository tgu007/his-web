import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PrescriptionService} from "../../../../service/prescription.service";
import {NzDropdownMenuComponent, NzMessageService, NzModalService} from "ng-zorro-antd";
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";
import {PreDefinedPrescriptionGroupComponent} from "../pre-defined-prescription-group/pre-defined-prescription-group.component";

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
})
export class PrescriptionListComponent implements OnInit {
  @Input() patientSignIn: any;
  @Input() isOneOff: any; //是否是临时医嘱
  prescriptionList: any[] = [];
  listOfSelectedPrescriptionStatus: any;
  mapOfCheckedId: { [key: string]: boolean } = {};
  mapOfExpandData: { [key: string]: boolean } = {};
  @Output() onNewPrescriptionEvent = new EventEmitter<any>();
  @Output() onEditPrescriptionEvent = new EventEmitter<any>();
  @Output() onResumeEditPrescriptionEvent = new EventEmitter<any>();
  currentPageIndex: any = 1;
  allChecked: any;
  collapsed: any = true;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  isLoading: any = false;
  confirmStatus: any = '已提交'
  totalPrescriptionListCount: any;
  tablePageSize: any = 25;
  showPagination: any = false;
  anyPrescriptionInEdit: any = false;
  printButtonText: any = '打印';
  editCache: any;

  // patientInfoCollapse: any = false;
  filterDescription: any;
  filterDateRange: any;
  orderDesc: any = true;
  showAdjustQuantity: any = false;
  preDefinedGroupModalVisible: any = false;
  startDateInEdit: any = false;
  changedDateList: any = [];
  cloning: any = false;

  @ViewChild(PreDefinedPrescriptionGroupComponent, {static: true}) preDefinedPrescriptionGroup: PreDefinedPrescriptionGroupComponent;
  public preDefinedMedicineGroupModalVisible: boolean = false;


  constructor(private prescriptionService: PrescriptionService, private message: NzMessageService,
              public datePipe: DatePipe,
              public sessionService: SessionService,
              public printService: PrintService,
              private modal: NzModalService,
  ) {
    this.subscribeNewPrescription();
  }

  ngOnInit() {
    if (this.patientSignIn.status == "已出院")
      this.listOfSelectedPrescriptionStatus = ['已停用'];
    else {
      this.listOfSelectedPrescriptionStatus = ['已提交', '执行中', '已停用', '待停用'];
      if (this.sessionService.getUserPermission().commonComponent.patientSignIn.prescription.allowEdit)
        this.listOfSelectedPrescriptionStatus.push('已创建');
    }
    if (!this.isOneOff)
      this.subscribePatientPrescriptionList()
  }

  subscribePatientPrescriptionList() {
    this.isLoading = true;
    let filter = {
      prescriptionStatusList: this.listOfSelectedPrescriptionStatus,
      oneOff: this.isOneOff,
      patientSignInIdList: [this.patientSignIn.uuid],
      description: this.filterDescription,
      orderByDesc: this.orderDesc
    }

    if (this.filterDateRange != undefined) {
      filter["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filter["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }


    this.prescriptionService.getPagedPatientPrescriptionList(filter, this.currentPageIndex, this.tablePageSize)
      .subscribe(response => {
          if (response) {
            this.prescriptionList = response.content;
            this.totalPrescriptionListCount = response.totalCount;
            if (response.totalPages > 1)
              this.showPagination = true;
            this.mapOfCheckedId = {};
            this.allChecked = false;
            this.editCache = {};
            for (let prescription of response.content)
              for (let log of prescription.changeLogRespDtoList)
                this.editCache[log.uuid] = {inEdit: false};

          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );
  }

  private subscribeNewPrescription() {
    this.prescriptionService.onPrescriptionSavedEvent.subscribe(newPrescription => {
      this.subscribePatientPrescriptionList();
    });
  }


  disablePrescription(prescription: any) {
    let action = 'disable'
    let message = '停嘱确认：'
    if (prescription)
      message += prescription.description;
    this.modal.confirm({
      nzContent: message,
      nzOnOk: () => {
        this.updatePrescriptionStatus(prescription, action);
      }
    });
  }

  confirmDisablePrescription(prescription: any) {
    let action = 'disable_confirm'
    this.updatePrescriptionStatus(prescription, action);
  }

  cancelPrescription(prescription: any) {
    if (prescription) {
      this.prescriptionService.getFeeCount(prescription.uuid)
        .subscribe(response => {
            let message = `${prescription.description}当前有${response.content}条费用，作废后产生都费用都将被退费，按确认执行！`
            this.popUpCancelDialog(prescription, message);
          },
          error => {
            this.message.create("error", error.error.message);
          });
    } else {
      let message = `所有作废的医嘱所产生的费用都将被退费，按确认执行！`
      this.popUpCancelDialog(prescription, message);
    }
  }

  private popUpCancelDialog(prescription: any, message: any) {
    this.modal.confirm({
      nzContent: message,
      nzOnOk: () => {
        this.updatePrescriptionStatus(prescription, 'cancel');
      }
    });
  }


  restoreDisablePrescription(prescription: any) {
    this.prescriptionService.restoreDisabledPrescription(prescription.uuid)
      .subscribe(response => {
          this.message.create("success", '恢复成功');
          this.subscribePatientPrescriptionList();
        },
        error => {
          this.message.create("error", error.error.message);
        });
  }

  updatePrescriptionStatus(prescription: any, actionName: any) {
    let prescriptionIdList: any[] = [];
    if (prescription)
      prescriptionIdList.push(prescription.uuid);
    else
      prescriptionIdList = this.getSelectedPrescriptionList();

    if (prescriptionIdList.length > 0) {
      this.prescriptionService.updatePrescriptionStatus({prescriptionIdList: prescriptionIdList}, actionName)
        .subscribe(response => {
            this.subscribePatientPrescriptionList();
            this.message.create("success", `操作成功`);
          },
          error => {
            this.message.create("error", error.error.message
            );
          });
    }
  }


  groupPrescription(group: boolean) {
    let selectedList = this.getSelectedPrescriptionList(group)
    if (selectedList) {
      this.prescriptionService.setToGroup({group: group, prescriptionIdList: selectedList})
        .subscribe(response => {
            this.subscribePatientPrescriptionList();
            this.message.create("success", `组套设置成功`);
          },
          error => {
            this.message.create("error", error.error.message);
          });
    }
  }

  getSelectedPrescriptionList(checkInSequence: boolean = false) {
    let selectedList: any[] = [];
    let selectedPrescriptionList = this.prescriptionList.filter(prescription => this.mapOfCheckedId[prescription.uuid]);
    if (selectedPrescriptionList.length == 0) {
      this.message.create("warning", `没有选中的医嘱`);
      return undefined;
    }
    let smallestIndex;
    let biggestIndex;
    for (let prescription of selectedPrescriptionList) {
      selectedList.push(prescription.uuid);
      if (checkInSequence) {
        let currentIndex = this.prescriptionList.indexOf(prescription);
        if (smallestIndex == undefined || currentIndex < smallestIndex)
          smallestIndex = currentIndex;
        if (biggestIndex == undefined || currentIndex > biggestIndex)
          biggestIndex = currentIndex;
      }
    }
    if (checkInSequence && biggestIndex - smallestIndex + 1 > selectedPrescriptionList.length) {
      this.message.create("error", `存在不连续的医嘱`);
      return undefined;
    }
    return selectedList;
  }


  newPrescriptionClicked(newPrescriptionType: any) {
    this.anyPrescriptionInEdit = false;
    this.onNewPrescriptionEvent.emit(newPrescriptionType);
  }

  editPrescription(prescription) {
    this.anyPrescriptionInEdit = false;
    this.onEditPrescriptionEvent.emit(prescription);
  }

  checkAll(checked: boolean) {
    this.prescriptionList.forEach(data => {
      this.mapOfCheckedId[data.uuid] = checked;
    });
  }

  copyPrescriptionClicked() {
    if (this.getSelectedPrescriptionList().length == 0)
      return;
    this.collapsed = false;
    this.patientSelectComponent.loadPatientTree({wardIdList: undefined});
  }

  copyPrescription() {
    let selectedPatientIdList = this.patientSelectComponent.getSelectedPatientList();
    if (selectedPatientIdList.length == 0) {
      this.message.create("warning", "没有选择的病人")
      return;
    }
    let prescriptionIdList = this.getSelectedPrescriptionList()
    if (prescriptionIdList.length == 0)
      return;

    let prescriptionListToCopy = {
      prescriptionIdList: prescriptionIdList,
      toPatientIdList: selectedPatientIdList,
    };
    this.cloning = true;
    this.prescriptionService.copyPrescription(prescriptionListToCopy).subscribe(response => {
        this.cloning = false;
        this.message.create("success", "复制成功")
        this.collapsed = true;
      },
      error => {
        this.message.create("error", "复制失败")
        this.collapsed = true;
        this.cloning = false;
      }
    );
  }


  resumePrescriptionEdit() {
    this.onResumeEditPrescriptionEvent.emit();
  }

  cancelResumeEdit() {
    this.anyPrescriptionInEdit = false;
  }

  printClicked() {
    let filter = {
      prescriptionStatusList: this.listOfSelectedPrescriptionStatus,
      oneOff: this.isOneOff,
      patientSignInIdList: [this.patientSignIn.uuid],
    }
    this.isLoading = true;
    this.printButtonText = '加载数据'
    this.prescriptionService.getPatientPrescriptionList(filter)
      .subscribe(response => {
          if (response) {
            let printComponentName = 'prescriptionList';
            if (!this.isOneOff)
              printComponentName = 'longTermPrescriptionList';
            this.printService.onPrintClicked.emit({
              name: printComponentName,
              data: {
                prescriptionList: response.content,
                patientSignIn: this.patientSignIn,
                isOneOff: this.isOneOff,
              }
            });
          }
        },
        error => {
          this.message.create("error", error.error.message);
        },
        () => {
          this.isLoading = false;
          this.printButtonText = '打印'
        }
      );
  }

  editLineControl(logId: any) {
    this.editCache[logId].inEdit = true;
  }

  commitLineControl(log: any) {
    this.editCache[log.uuid].inEdit = false;
    this.isLoading = true;
    this.prescriptionService.adjustLogTime({
      uuid: log.uuid,
      manualDate: this.datePipe.transform(log.whenCreated, 'yyyy-MM-dd HH:mm:ss')
    })
      .subscribe(response => {
          this.subscribePatientPrescriptionList();
        },
        error => {
          this.isLoading = false;
          this.message.create("error", error.error.message);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reload() {
    this.filterDescription = undefined;
    this.subscribePatientPrescriptionList();
  }

  printSlip(data: any, printComponentName) {
    this.isLoading = true;
    this.prescriptionService.getMedicinePrescriptionDetail(data.uuid)
      .subscribe(response => {
          if (response) {
            this.isLoading = false;
            this.printService.onPrintClicked.emit({
              name: printComponentName,
              data: {
                prescription: response.content,
                prescriptionList: data,
                patientSignIn: this.patientSignIn
              }
            });
          }
        },
        error => {
          this.message.create("error", error.error.message);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  printChineseMedicineSlip(data: any) {
    this.isLoading = true;
    this.prescriptionService.getSameGroupPrescriptionList(data.uuid)
      .subscribe(response => {
          if (response) {
            this.isLoading = false;
            this.printService.onPrintClicked.emit({
              name: 'chineseMedicineSlip',
              data: {
                prescriptionList: response.content,
                patientSignIn: this.patientSignIn
              }
            });
          }
        },
        error => {
          this.message.create("error", error.error.message);
        },
        () => {
          this.isLoading = false;
        }
      );

  }

  adjustTreatmentPrescriptionQuantityClicked(data: any) {
    this.showAdjustQuantity = true;
    data.showAdjustQuantity = true;
  }

  cancelQuantityAdjust(data: any) {
    this.showAdjustQuantity = false;
    data.showAdjustQuantity = false;
  }

  confirmQuantityAdjust(data: any) {
    this.showAdjustQuantity = false;
    data.showAdjustQuantity = false;
    let adjustPram = {prescriptionTreatmentId: data.prescriptionDetailId, adjustQuantity: data.adjustQuantity};

    this.isLoading = true;
    this.prescriptionService.adjustPrescriptionTreatmentQuantity(adjustPram).subscribe(response => {
        this.isLoading = false;
        this.message.create("success", '更新成功');
      },
      error => {
        this.isLoading = false;
        this.message.create("error", error.error.message);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  predefinedGroupType:any
  preDefinedClicked(type:any) {
    this.predefinedGroupType = type
    //this.preDefinedPrescriptionGroup.clearUI()
    this.preDefinedGroupModalVisible = true;
  }

  preDefinedMedicineClicked() {
    this.preDefinedMedicineGroupModalVisible = true;
  }

  closeDrawer() {
    this.preDefinedGroupModalVisible = false;
    this.preDefinedMedicineGroupModalVisible = false;
  }

  prescriptionGenerated() {
    this.preDefinedGroupModalVisible = false;
    this.preDefinedMedicineGroupModalVisible = false;
    this.reload();
  }


  getStatusColour(data: any) {
    let colour = null;
    if (data.status == '已创建')
      colour = 'orange';
    else if (data.status == '已停用')
      colour = 'red';
    else if (data.status == '执行中')
      colour = 'green';
    return {'color': colour};
  }

  startEditStartDate() {
    this.startDateInEdit = true;
    this.changedDateList = [];
  }

  saveEditedStartDate() {
    if (this.changedDateList.length < 1) {
      this.message.create("info", '没有更改的时间');
      return;
    }

    this.isLoading = true;
    this.prescriptionService.updateStartDateInBatch(this.changedDateList).subscribe(response => {
        this.isLoading = true;
        this.startDateInEdit = false;
        this.message.create("success", '医嘱开始时间更新成功');
        this.reload();
      },
      error => {
        this.isLoading = false;
        this.message.create("error", error.error.message);
      }
    );
  }

  startDateChanged(data: any) {
    let changedDate = {};
    changedDate["uuid"] = data.uuid;
    changedDate["manualDate"] = this.datePipe.transform(data.startDate, 'yyyy-MM-dd HH:mm:ss')
    this.changedDateList.push(changedDate);
  }


  updateLogToCurrentUser(logId: any) {
    let changeUser = {};
    changeUser["uuid"] = logId;
    changeUser["manualUserId"] = this.sessionService.loginUser.uuid;

    this.isLoading = true;
    this.prescriptionService.updateLogUser(changeUser).subscribe(response => {
        this.isLoading = true;
        this.message.create("success", '更新成功');
        this.reload();
      },
      error => {
        this.isLoading = false;
        this.message.create("error", error.error.message);
      }
    );

  }


  printLabRequest() {
    let selectedPrescriptionList = this.prescriptionList.filter(prescription => this.mapOfCheckedId[prescription.uuid] &&
      prescription.labTest
    );
    if (selectedPrescriptionList.length == 0) {
      this.message.create("warning", `没有选中的医嘱或选中的非化验医嘱`);
      return undefined;
    }
    this.printService.onPrintClicked.emit({
      name: 'labTestRequest',
      data: {
        prescriptionList: selectedPrescriptionList,
        patientSignIn: this.patientSignIn
      }
    });
  }
}

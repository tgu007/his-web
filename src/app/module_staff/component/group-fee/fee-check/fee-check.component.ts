import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FeeService} from "../../../../service/fee.service";
import * as globals from "../../../../../globals";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {BasicService} from "../../../../service/basic.service";
import {PatientFeeDetailComponent} from "../patient-fee-detail/patient-fee-detail.component";
import {PrescriptionService} from "../../../../service/prescription.service";
import {YbTzService} from "../../../../service/yb-tz.service";

@Component({
  selector: 'app-fee-check',
  templateUrl: './fee-check.component.html',
  styleUrls: ['./fee-check.component.css']
})
export class FeeCheckComponent implements OnInit {
  @Input() patientSignIn: any;
  tablePageSize: any = globals.tablePageSize;
  isLoading: boolean;
  dataList: any;
  mapOfExpandData: { [key: string]: boolean } = {};
  filterFeeName: any;
  listOfSelectedFeeType: any;
  feeTypeList: any;
  mapOfExpandEntityData: { [key: string]: boolean } = {};
  listOfSelectedFeeDepartment: any;
  feeDepartmentList: any = [];
  @ViewChild(PatientFeeDetailComponent, {static: true}) patientManualFeeDetailComponent: PatientFeeDetailComponent;
  drawerVisible = false;
  filterDateRange: any = [new Date(), new Date()];
  userDepartmentLoaded: boolean = false;
  otherDepartmentLoaded: boolean = false;
  filterPrescription: any;
  private selectionTablePageSize: any = 5;
  prescriptionListTotalCount: number;
  pageCount: any;
  prescriptionList: any;
  feeTypeListLoaded: any = false;

  constructor(
    private feeService: FeeService,
    private message: NzMessageService,
    private datePipe: DatePipe,
    public sessionService: SessionService,
    private basicService: BasicService,
    private modal: NzModalService,
    public prescriptionService: PrescriptionService,
    private ybService: YbTzService,
  ) {
  }

  ngOnInit() {
    this.subscribeFeeTypeList();
    this.loadDepartmentList();
    this.searchPrescription({input: undefined, pageNumber: 1});
  }

  private subscribeFeeTypeList() {
    this.feeService.getFeeTypeList(this.patientSignIn.uuid)
      .subscribe(response => {
        if (response) {
          this.feeTypeList = response.content;
          this.feeTypeListLoaded = true;
          this.tryInitLoad();
        }
      });
  }

  subscribeFeeCheckList(keepUserExpand = false) {
    this.dataList = undefined
    if (!keepUserExpand) {
      this.mapOfExpandData = {};
      this.mapOfExpandEntityData = {};
    }
    let filterDto = {};
    if (this.listOfSelectedFeeType != undefined && this.listOfSelectedFeeType.length > 0)
      filterDto["feeTypeList"] = this.listOfSelectedFeeType
    if (this.filterFeeName != undefined && this.filterFeeName != "")
      filterDto["searchCode"] = this.filterFeeName
    if (!this.sessionService.loginUser.uiPermission.fullDepartmentPermission)
      filterDto["departmentIdList"] = this.listOfSelectedFeeDepartment;
    if (this.filterPrescription)
      filterDto["prescriptionId"] = this.filterPrescription.uuid;

    if (this.filterDateRange != undefined) {
      filterDto["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filterDto["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }

    this.isLoading = true;
    this.feeService.getFeeCheckList(this.patientSignIn.uuid, filterDto)
      .subscribe(response => {
          if (response) {
            this.dataList = response.content;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );
  }

  levelOneExpendChanged(expandPrescription: any, isExpand: boolean) {
    if (isExpand) {
      for (let prescription of this.dataList)
        if (prescription.uuid != expandPrescription.uuid) {
          this.mapOfExpandData[prescription.uuid] = false;
          for (let entity of prescription.entityList)
            this.mapOfExpandEntityData[entity.id] = false;
        }
    } else {
      for (let entity of expandPrescription.entityList)
        this.mapOfExpandEntityData[entity.id] = false;
    }
  }

  levelTwoExpendChange(prescription: any, expandEntity: any, isExpand: boolean) {
    if (isExpand) {
      for (let entity of prescription.entityList)
        if (entity.id != expandEntity.id)
          this.mapOfExpandEntityData[entity.id] = false;
    }
  }

  cancelSingleFee(fee: any) {
    let feeIdList = [];
    feeIdList.push(fee.uuid);
    let message = `确认退掉选中的单条费用:${fee.name}`;
    this.updateFeeStatus({uuidList: feeIdList}, 'cancel', message)
  }

  cancelFeeList(entity) {
    let feeIdList = entity.feeList.filter(fee => fee.checked).map(fee => fee.uuid);
    if (feeIdList.length == 0) {
      this.message.create("warning", "没有选中的费用");
      return;
    }
    let message = `确认退掉选中的${feeIdList.length}条费用`;
    this.updateFeeStatus({uuidList: feeIdList}, 'cancel', message)
  }

  updateFeeStatus(feeIdList: any, action: any, message: any) {
    this.modal.confirm({
      nzContent: message,
      nzOnOk: () => {
        this.isLoading = true;
        this.feeService.updateFeeStatus(feeIdList, action)
          .subscribe(response => {
              this.isLoading = false;
              this.subscribeFeeCheckList(true);
              this.message.create("success", "退费成功");
            },
            error => {
              this.message.create("error", error.error.message);
              this.isLoading = false;
            }
          );
      }
    });
  }


  private loadDepartmentList() {
    if (this.sessionService.loginUser.uiPermission.fullDepartmentPermission)
      return;
    let userDepartmentFilter = {departmentTreatmentIdList: this.getUserDepartment()};
    this.basicService.getDepartmentList(userDepartmentFilter)
      .subscribe(response => {
        if (response) {
          //this.feeDepartmentList.push(response.content);
          this.feeDepartmentList = this.feeDepartmentList.concat(response.content);
          this.listOfSelectedFeeDepartment = response.content.map(d => d.uuid);
          this.userDepartmentLoaded = true;
          this.tryInitLoad();
        }

      });

    let otherDepartmentType = this.sessionService.loginUser.uiPermission.commonComponent.fee.otherTreatmentDepartment;
    if (otherDepartmentType) {
      this.basicService.getDepartmentList({departmentTreatmentTypeList: otherDepartmentType})
        .subscribe(response => {
          if (response) {
            //this.feeDepartmentList.push(response.content);
            this.feeDepartmentList = this.feeDepartmentList.concat(response.content);
            this.otherDepartmentLoaded = true;
            this.tryInitLoad();
          }
        });
    }

  }

  private getUserDepartment() {
    let permittedDepartmentList = this.sessionService.loginUser.departmentIdList;
    if (permittedDepartmentList.find(d => d == this.patientSignIn.departmentTreatment.uuid)) {
      permittedDepartmentList = [this.patientSignIn.departmentTreatment.uuid]; //如果为病区科室，只需要病区科室即可
      permittedDepartmentList = permittedDepartmentList.concat(this.patientSignIn.previousWardDepartmentIdList);
    }
    return permittedDepartmentList;
  }

  checkAllEntityChanged(entity: any, checked: boolean) {
    entity['selectAll'] = checked;
    entity.feeList.forEach(fee => fee['checked'] = checked);

  }

  cancelPartialFeeClicked(fee: any) {
    fee["showReturnQuantity"] = true;
  }

  cancelPartialCancel(fee: any) {
    fee.showReturnQuantity = false;
  }

  confirmPartialCancel(fee: any) {
    fee.showReturnQuantity = false;
    if (fee.returnQuantity < 1) {
      this.message.create("warning", "退费数量不能小于1");
      return;
    }
    let message = `退除部分费用，原有数量${fee.quantity},退费数量${fee.returnQuantity}`
    this.modal.confirm({
      nzContent: message,
      nzOnOk: () => {
        this.isLoading = true;
        let cancelPram = {feeId: fee.uuid, cancelQuantity: fee.returnQuantity};
        this.feeService.cancelPartialFee(cancelPram)
          .subscribe(response => {
              this.subscribeFeeCheckList(true);
              this.message.create("success", "退费成功");
            },
            error => {
              this.isLoading = false;
              this.message.create("error", error.error.message);
            }
          );
      }
    });


  }

  addNewFee(entityType: any, prescriptionId: any = undefined) {
    this.drawerVisible = true;
    this.patientManualFeeDetailComponent.resetDrawerUI(entityType, prescriptionId);
  }

  close(): void {
    this.drawerVisible = false;
  }

  newFeeCreated() {
    this.subscribeFeeCheckList(true);
    this.close();
  }

  hasEditPermission(fee: any) {
    // if (!this.sessionService.getUserPermission().commonComponent.fee.readonly)
    //   return false;
    if (this.sessionService.getUserPermission().commonComponent.fee.readOnly)
      return false;
    if (this.sessionService.getUserPermission().fullDepartmentPermission)
      return true;
    else if (this.sessionService.loginUser.departmentIdList.includes(fee.departmentId))
      return true;
    else
      return false;
  }

  commitLineControl(fee: any) {
    fee['editingDate'] = false;
    this.isLoading = true;
    this.feeService.timeAdjustment({
      feeId: fee.uuid,
      newTime: this.datePipe.transform(fee.feeDate, 'yyyy-MM-dd HH:mm:ss')
    })
      .subscribe(response => {
          this.subscribeFeeCheckList(true);
        },
        error => {
          this.isLoading = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  editLineControl(fee: any) {
    fee['editingDate'] = true;
  }

  searchPrescription(dynamicSelectEvent: any) {
    let filter = {
      prescriptionStatusList: ['执行中', '已停用'],
      patientSignInIdList: [this.patientSignIn.uuid],
      orderByDesc: true
    }
    if (dynamicSelectEvent.input)
      filter['description'] = dynamicSelectEvent.input

    this.prescriptionService.getPagedPatientPrescriptionList(filter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildPrescriptionDynamicSelectionValueList(response.content);
          this.prescriptionListTotalCount = response.totalCount;
          this.pageCount = response.totalPages;
        }
      });
  }

  private buildPrescriptionDynamicSelectionValueList(selectPrescriptionDropdownData: any) {
    for (let data of selectPrescriptionDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.description);
      dynamicItemValueList.push(data.oneOff ? '临时' : '长期');
      dynamicItemValueList.push(data.startDate);
      dynamicItemValueList.push(data.endDate);
      dynamicItemValueList.push(data.frequency);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.prescriptionList = selectPrescriptionDropdownData;
  }

  selectedPrescriptionChanged() {
    this.subscribeFeeCheckList(true);
  }

  clearFilterPrescription() {
    this.filterPrescription = undefined;
    this.subscribeFeeCheckList(true);
  }

  private tryInitLoad() {
    if (this.otherDepartmentLoaded && this.userDepartmentLoaded && this.feeTypeListLoaded) {
      this.subscribeFeeCheckList(true);
    }
  }

  cancelYBSideFee(fee: any) {
    this.ybService.cancelYBSideFee(fee.uuid)
      .subscribe(response => {
        if (response) {
          this.message.success('医保端费用已删除');
          fee.selfFeeAmount = response.content.selfFeeAmount;
          fee.selfPay = response.content.selfPay;
          fee.selfRatio = response.content.selfRatio;
          fee.uploadStatus = response.content.uploadStatus;
        }
      });
  }
}

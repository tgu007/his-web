import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import * as globals from "../../../../../globals";
import {InventoryService} from "../../../../service/inventory.service";
import {FeeService} from "../../../../service/fee.service";
import {PrescriptionService} from "../../../../service/prescription.service";
import {NzMessageService} from "ng-zorro-antd";
import {BasicService} from "../../../../service/basic.service";
import {DatePipe} from "@angular/common";
import {FormValidator} from "../../../../../validation/FormValidator";
import {SessionService} from "../../../../service/session.service";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as addMinutes from 'date-fns/add_minutes';
import * as addDays from 'date-fns/add_days';
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";
import {PrescriptionListComponent} from "../../group-prescription/prescription-list/prescription-list.component";
import {createElementCssSelector} from "@angular/compiler";

@Component({
  selector: 'app-patient-fee-detail',
  templateUrl: './patient-fee-detail.component.html',
  styleUrls: ['./patient-fee-detail.component.css']
})
export class PatientFeeDetailComponent implements OnInit {
  newManualFeeForm: any;
  feeItemList: any;
  feeItemTotalCount: any;
  selectFeeItemColumnList: any;
  feeType: any;
  @Input() patientSignIn: any;
  @Output() feeCreatedEvent: EventEmitter<any> = new EventEmitter();
  warehouseList: any
  selectedFeeItem;
  prescriptionList: any;
  @Input() isAutoFee: any = false;
  feeItemPageCount: any;
  selectionTablePageSize = globals.selectionPageSize;
  saving: any = false;
  disabledDate = (current: Date): boolean => {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) > 1;
  };
  departmentList: any;
  hideFrequencyControl: any = !this.isAutoFee;
  prescriptionListTotalCount: any = undefined;
  pageCount: any;
  @ViewChild('prescriptionSelect', {static: true}) prescriptionSelect: CommonDynamicSelectComponent;

  //pramEntityId;

  constructor(private fb: FormBuilder, private inventoryService: InventoryService,
              private feeService: FeeService,
              public prescriptionService: PrescriptionService,
              private basicService: BasicService,
              private message: NzMessageService, private datePipe: DatePipe,
              private sessionService: SessionService) {
  }

  ngOnInit() {

    this.loadWarehouseList();
    this.loadDepartmentList();
    this.newManualFeeForm = this.fb.group({
      txtFeeItem: ["", [Validators.required]],
      txtQuantity: [1, [Validators.required]],
      dateFeeDate: [new Date(), null],
      selectPrescription: [undefined, null],
      selectWarehouse: [undefined, null],
      selectDepartment: [undefined, Validators.required],
      selectFrequency: [undefined, null],
      chkSelfPay: [undefined, null],
    });
    this.setControlRequired(this.isAutoFee, "selectFrequency")
    this.setControlRequired(!this.isAutoFee, "selectPrescription")
    if (this.isAutoFee)
      this.prescriptionService.callGetFrequencyListService();


  }


  selectedFeeItemChanged(selectedItem: any) {
    if (selectedItem) {
      if (this.feeType == "诊疗") {
        this.selectedFeeItem = selectedItem;
      } else
        this.selectedFeeItem = selectedItem.stockEntity;
    } else
      this.selectedFeeItem = undefined;

    if (this.selectedFeeItem && this.selectedFeeItem.prescriptionRequired) {
      this.newManualFeeForm.get('selectPrescription')!.setValidators(Validators.required);
      this.newManualFeeForm.get('selectPrescription')!.markAsDirty();
    } else {
      this.newManualFeeForm.get('selectPrescription')!.clearValidators();
      this.newManualFeeForm.get('selectPrescription')!.markAsPristine();
    }
    this.newManualFeeForm.get('selectPrescription')!.updateValueAndValidity();
  }


  searchFeeItem(dynamicSelectEvent: any) {
    if (dynamicSelectEvent == '')
      return;

    if (this.feeType == "药品")
      this.searchInventoryItem(dynamicSelectEvent, 'medicine');
    else if (this.feeType == "耗材")
      this.searchInventoryItem(dynamicSelectEvent, 'item');
    else if (this.feeType == "诊疗")
      this.searchTreatment(dynamicSelectEvent);
  }


  private searchTreatment(dynamicSelectEvent: any) {
    let treatmentFilter = {searchCode: dynamicSelectEvent.input};
    if (this.isAutoFee)
      treatmentFilter["allowAutoFee"] = true;
    else
      treatmentFilter["allowManualFee"] = true;

    this.basicService.getSelectionPagedTreatmentList(treatmentFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content);
          this.feeItemTotalCount = response.totalCount;
          this.feeItemPageCount = response.totalPages;
        }
      });
  }

  private searchInventoryItem(dynamicSelectEvent: any, inventoryEntityType: string) {
    let inventoryEntityFilter = {
      searchCode: dynamicSelectEvent.input,
      stockFilter: {warehouseIdList: [this.newManualFeeForm.value.selectWarehouse]},
      enabled: true
    };
    if (this.feeType == "耗材") {
      inventoryEntityFilter["chargeableItem"] = true;
      if (this.isAutoFee)
        inventoryEntityFilter["allowAutoFee"] = true;
    }
    if (this.feeType == "药品")
      inventoryEntityFilter["needPrescription"] = true;

    this.basicService.getSelectionPagedEntityStockList(inventoryEntityFilter, inventoryEntityType, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content);
          this.feeItemTotalCount = response.totalCount;
          this.feeItemPageCount = response.totalPages;
        }
      });
  }

  private buildItemDynamicSelectionValueList(selectMedicineDropdownData: any) {
    for (let data of selectMedicineDropdownData) {
      let dynamicItemValueList = [];
      let entity;
      if (this.feeType == "药品" || this.feeType == "耗材")
        entity = data.stockEntity;
      else
        entity = data;

      dynamicItemValueList.push(entity.name);
      dynamicItemValueList.push(entity.minSizeUom.name);
      dynamicItemValueList.push(entity.listPriceMinUom);
      if (this.feeType == "药品") {
        dynamicItemValueList.push(entity.departmentModel);
        dynamicItemValueList.push(entity.manufacturer.name);
        dynamicItemValueList.push(data.departmentDisplayQuantity);
      } else if (this.feeType == '耗材') {
        dynamicItemValueList.push(entity.departmentModel);
        dynamicItemValueList.push(entity.manufacturer.name);
        dynamicItemValueList.push(data.departmentDisplayQuantity);
      }

      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.feeItemList = selectMedicineDropdownData;
  }

  resetDrawerUI(entityType: any, pramPrescriptionId: any = undefined) {
    this.newManualFeeForm.reset();
    this.prescriptionSelect.reset();
    this.feeType = entityType;
    this.feeItemList = undefined;
    this.selectedFeeItem = undefined;
    this.hideFrequencyControl = !this.isAutoFee;
    //this.pramEntityId = P

    if (entityType == '药品') {
      this.selectFeeItemColumnList = ['名称', '单位', '价格', '规格', '产地', '库存'];
      this.setControlRequired(true, "selectWarehouse");
    } else if (entityType == "诊疗") {
      this.selectFeeItemColumnList = ['名称', '单位', '价格'];
      this.setControlRequired(false, "selectWarehouse");
    } else if (entityType == "耗材") {
      this.selectFeeItemColumnList = ['名称', '单位', '价格', '规格', '产地', '库存'];
      this.setControlRequired(true, "selectWarehouse");
    }
    this.setControlRequired(this.isAutoFee, "selectFrequency")

    this.newManualFeeForm.patchValue({
      txtQuantity: 1,
      dateFeeDate: new Date(),
      selectPrescription: undefined,
      selectWarehouse: this.warehouseList && this.warehouseList.length == 1 ? this.warehouseList[0].uuid : undefined,
      selectDepartment: this.departmentList && this.departmentList.length == 1 ? this.departmentList[0].uuid : undefined,
      txtFeeItem: undefined,
      selectFrequency: undefined,
    });
    this.callLoadPrescriptionService(undefined, 1, pramPrescriptionId);
  }

  createNewFee() {
    if (!this.newManualFeeForm.valid) {
      FormValidator.validateFormInput(this.newManualFeeForm);
      this.message.create("error", "验证错误");
      return;
    }
    if(!this.selectedFeeItem.listPrice || this.selectedFeeItem.listPrice == 0) {
      this.message.create("error", "价格为0，请先设置价格在进行计费");
      return;
    }

    const data = this.newManualFeeForm.value;
    let newFee = {
      autoFee: this.isAutoFee,
      entityType: this.feeType,
      feeEntityId: this.selectedFeeItem.uuid,
      quantity: data.txtQuantity,
      patientSignInId: this.patientSignIn.uuid,
      prescriptionId: data.selectPrescription ? data.selectPrescription.uuid : undefined,
      warehouseId: data.selectWarehouse,
      feeDate: this.datePipe.transform(data.dateFeeDate, 'yyyy-MM-dd HH:mm:ss'),
      frequencyId: data.selectFrequency,
      selfPay: data.chkSelfPay,
      departmentId: data.selectDepartment,
    }

    this.saving = true;
    this.feeService.createNewFee(newFee)
      .subscribe(response => {
          if (response) {
            this.message.create("success", "创建成功");
            this.feeCreatedEvent.emit();
            this.saving = false;
          }
        },
        error => {
          this.saving = false;
          this.message.create("error", error.error.message);
        });
  }

  private loadWarehouseList() {
    let warehouseFilter = {
      warehouseTypeList: ["病区库房", "科室库房"],
      warehouseIdList: this.sessionService.loginUser.warehouseIdList
    };
    this.basicService.getWarehouseList(warehouseFilter)
      .subscribe(response => {
        if (response) {
          this.warehouseList = response.content.filter(w => w.uuid == this.patientSignIn.departmentTreatment.wardWarehouse.uuid || w.warehouseType != '病区库房');
          //console.log(this.warehouseList, this.patientSignIn);
          if (this.warehouseList.length == 1)
            this.newManualFeeForm.patchValue({
              selectWarehouse: this.warehouseList[0].uuid
            });
        }
      });
  }

  setControlRequired(required, controlName) {
    if (required) {
      this.newManualFeeForm.get(controlName)!.setValidators(Validators.required);
      this.newManualFeeForm.get(controlName)!.markAsDirty();
    } else {
      this.newManualFeeForm.get(controlName)!.clearValidators();
      this.newManualFeeForm.get(controlName)!.markAsPristine();
    }
    this.newManualFeeForm.get(controlName)!.updateValueAndValidity();
  }

  selectedWarehouseChanged() {
    this.newManualFeeForm.patchValue({
      txtQuantity: 1,
      txtFeeItem: undefined,
    });
    this.selectedFeeItem = undefined;
  }

  private loadDepartmentList() {
    let departmentFilter = {};
    if (!this.sessionService.loginUser.uiPermission.fullDepartmentPermission)
      departmentFilter["departmentTreatmentIdList"] = this.sessionService.loginUser.departmentIdList;

    this.basicService.getDepartmentList(departmentFilter)
      .subscribe(response => {
        if (response) {
          this.departmentList = response.content.filter(d => d.uuid == this.patientSignIn.departmentTreatment.uuid || d.type != '病区科室');
          if (this.departmentList.length == 1)
            this.newManualFeeForm.patchValue({
              selectDepartment: this.departmentList[0].uuid
            });
        }
      });
  }

  selectedPrescriptionChanged() {
    if (!this.isAutoFee)
      return;
    //let selectedPrescriptionId = this.newManualFeeForm.value.selectPrescription;
    let selectedPrescription = this.newManualFeeForm.value.selectPrescription;

    // if (selectedPrescriptionId) {
    //   selectedPrescription = this.prescriptionList.find(p => p.uuid == selectedPrescriptionId);
    // }

    if (selectedPrescription && selectedPrescription.type != '文字') {
      this.setControlRequired(false, "selectFrequency")
    } else {
      this.setControlRequired(true, "selectFrequency")
    }
  }

  searchPrescription(dynamicSelectEvent: any) {
    this.callLoadPrescriptionService(dynamicSelectEvent.input, dynamicSelectEvent.pageNumber)
  }

  private callLoadPrescriptionService(searchCode: any, pageNumber: any, prescriptionId: any = undefined) {

    let prescriptionType: any = [];
    if (this.feeType == "药品")
      prescriptionType = ['药品', '药品文字'];
    else if (this.feeType == "耗材")
      prescriptionType = ['药品', '药品文字', '诊疗', '文字'];
    else if (this.feeType == "诊疗")
      prescriptionType = ['药品', '药品文字', '诊疗', '文字'];

    let filter = {
      prescriptionStatusList: ['执行中', '已停用'],
      prescriptionTypeList: prescriptionType,
      patientSignInIdList: [this.patientSignIn.uuid],
      orderByDesc: true
    }

    if (searchCode)
      filter['description'] = searchCode

    if (prescriptionId)
      filter['uuid'] = prescriptionId

    this.prescriptionService.getPagedPatientPrescriptionList(filter, pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildPrescriptionDynamicSelectionValueList(response.content);
          this.prescriptionListTotalCount = response.totalCount;
          this.pageCount = response.totalPages;
          if (prescriptionId) {
            let prescription = this.prescriptionList[0];
            this.patchDefaultPrescriptionValue(prescription);
          }
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

  private patchDefaultPrescriptionValue(prescription: any) {
    let feeDate: any = addMinutes(prescription.startDate, 1)
    //console.log(prescription);
    if (prescription.firstDayQuantityInfo == 0 && prescription.type != '文字') {
      feeDate.setHours(7, 30, 0, 0);
      feeDate = addDays(feeDate, 1);
    }
    feeDate = this.datePipe.transform(feeDate, 'yyyy-MM-dd HH:mm:ss');
    //addMinutes()
    this.newManualFeeForm.patchValue({
      selectPrescription: this.prescriptionList[0],
      dateFeeDate: feeDate,
    });
  }
}

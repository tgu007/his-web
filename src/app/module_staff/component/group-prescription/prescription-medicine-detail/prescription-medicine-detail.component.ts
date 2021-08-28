import {Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from "@angular/forms";
import {PrescriptionService} from "../../../../service/prescription.service";
import {AppService} from "../../../../service/app.service";
import {NzMessageService} from "ng-zorro-antd";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {DatePipe} from "@angular/common";
import * as globals from "../../../../../globals"
import {BasicService} from "../../../../service/basic.service";
import {PrescriptionStatus, PrescriptionChargeableType, PrescriptionType} from "../prescription-enums";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";
import {FormValidator} from "../../../../../validation/FormValidator";


@Component({
  selector: 'app-prescription-medicine-detail',
  templateUrl: './prescription-medicine-detail.component.html',
  styleUrls: ['./prescription-medicine-detail.component.css']
})
export class PrescriptionMedicineDetailComponent implements OnInit {
  newMedicinePrescriptionForm: any;
  medicineList: any;
  selectedMedicine: any;
  loading: any;
  formErrors: Object = {};
  @Input() patientSignIn: any;
  @Input() isOneOff: any;
  // disabledDate = (current: Date): boolean => {
  //   // Can not select days before today and today
  //   return differenceInCalendarDays(current, new Date()) > 0 || differenceInCalendarDays(current, new Date()) < -3;
  // };

  disabledDate = (current: Date): boolean => {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
  medicineListTotalCount: any;
  private initPramLoaded: any = false;
  private pharmacyList: any;
  medicinePrescription;
  @ViewChild(CommonDynamicSelectComponent, {static: true}) medicineSelect: CommonDynamicSelectComponent;
  saving: any = false;
  pageCount: any;
  selectionTablePageSize = globals.selectionPageSize;
  useMethodList: any;
  nzFilterOption = () => true;
  isChineseMedicine: any = false;
  diagnoseList: any;
  diagnoseListTotalCount: any;
  diagnoseListPageCount: any;
  sameGroupMedicineList: Array<{
    id: number,
    medicineControl: { controlInstance: string; medicineList: any, medicineListTotalCount: any, pageCount: any, selectedMedicine: any },
    serveQuantityControl: { controlInstance: string; }
    issueQuantityControl: { controlInstance: string; }
  }> = [];
  frequencyList: any;


  constructor(private fb: FormBuilder, public prescriptionService: PrescriptionService,
              private basicService: BasicService,
              private message: NzMessageService, private datePipe: DatePipe) {
  }


  ngOnInit() {
    this.initForm();


  }

  private initForm() {
    this.newMedicinePrescriptionForm = this.fb.group({
      txtMedicine: ["", [Validators.required]],
      txtServeQuantity: [1, [Validators.required]],
      txtFirstDayQuantity: ["", null],
      selectFrequency: ["", [Validators.required]],
      selectUseMethod: ["", [Validators.required]],
      txtDropSpeed: ["", null],
      txtNote: ["", null],
      dateStartDateTime: [undefined, null],
      chkManualDate: [undefined],
      txtFixedQuantity: [null, null],
      selectDiagnose: [undefined, undefined],
    });
  }

  public submitForm() {

    // FormValidator.validateForm(this.newMedicinePrescriptionForm, this.formErrors, false, 'formMedicinePrescription');
    if (!this.newMedicinePrescriptionForm.valid) {
      FormValidator.validateFormInput(this.newMedicinePrescriptionForm);
      //this.newMedicinePrescriptionForm.
      this.message.create("error", "验证错误");
      return;
    }
    if (this.selectedMedicine.listPrice === 0) {
      this.message.create("warning", "价格为0,请联系医保办调整价格");
      return;
    }


    const data = this.newMedicinePrescriptionForm.value;
    let newPrescription = this.getData(data);
    // this.isSpinning = true;
    this.saving = true;
    this.prescriptionService.saveMedicinePrescription(newPrescription)
      .subscribe(response => {
          this.saving = false;
          this.message.create("success", "创建成功");
          this.resetUi({});
          this.prescriptionService.onPrescriptionSavedEvent.emit();
        },
        error => {
          this.saving = false;
          this.message.create("error", error.error.message);
        });
  }


  getData(data) {

    let sameGroupMedicineList: any = undefined;
    if (this.sameGroupMedicineList.length > 0) {
      sameGroupMedicineList = [];
      for (let row of this.sameGroupMedicineList) {
        let sameGroupMedicineDto = {};
        sameGroupMedicineDto["medicineId"] = data[row.medicineControl.controlInstance].stockEntity.uuid;
        sameGroupMedicineDto["serveQuantity"] = data[row.serveQuantityControl.controlInstance];
        sameGroupMedicineDto["issueQuantity"] = data[row.issueQuantityControl.controlInstance];
        sameGroupMedicineList.push(sameGroupMedicineDto);
      }
    }

    return {
      prescriptionChargeableSaveDto:
        {
          uuid: this.medicinePrescription.prescriptionChargeableId,
          frequencyId: data.selectFrequency,
          firstDayQuantity: data.txtFirstDayQuantity ? data.txtFirstDayQuantity as number : 0,
          manualStartDate: data.chkManualDate ? this.datePipe.transform(data.dateStartDateTime, 'yyyy-MM-dd HH:mm:ss') : undefined,
          prescriptionSaveDto:
            {
              uuid: this.medicinePrescription.uuid,
              prescriptionType: PrescriptionType.Medicine,
              status: PrescriptionStatus.created,
              reference: data.txtNote,
              isOneOff: this.isOneOff,
              patientSignInId: this.patientSignIn.uuid,
              departmentId: this.patientSignIn.departmentTreatment.uuid,
            }
        },
      uuid: this.medicinePrescription.prescriptionDetailId,
      useMethodId: data.selectUseMethod ? data.selectUseMethod as number : undefined,
      dropSpeed: data.txtDropSpeed as string,
      medicineId: this.selectedMedicine.uuid,
      //issueQuantity: this.calculateIssueQuantity(),
      serveQuantity: data.txtServeQuantity,
      fixedQuantity: data.txtFixedQuantity,
      diagnoseId: data.selectDiagnose ? data.selectDiagnose.uuid : undefined,
      batchNewMedicineList: sameGroupMedicineList
    }
  }

  searchMedicine(dynamicSelectEvent: any, rowControl: any = undefined) {
    if (dynamicSelectEvent == '')
      return;

    // if (input.length < 2)
    // return;
    let medicineFilter = {
      enabled: true,
      searchCode: dynamicSelectEvent.input,
      stockFilter: {warehouseIdList: this.pharmacyList}
    };
    //let medicineFilter = {searchCode: input, stockFilter: {warehouseIdList: this.pharmacyList}};
    if (!this.isOneOff)
      medicineFilter["medicineTypeNameList"] = ['中成药', '西药'];

    this.medicineSelect.isLoading = true;
    this.basicService.getSelectionPagedEntityStockList(medicineFilter, 'medicine', dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, rowControl);
          if (rowControl) {
            rowControl.medicineControl.medicineListTotalCount = response.totalCount;
            rowControl.medicineControl.pageCount = response.totalPages;
          } else {
            this.medicineListTotalCount = response.totalCount;
            this.pageCount = response.totalPages;
          }
          this.medicineSelect.isLoading = false;
        }
      });
  }

  private buildItemDynamicSelectionValueList(selectMedicineDropdownData: any, rowControl: any = undefined) {
    for (let data of selectMedicineDropdownData) {
      let dynamicItemValueList = [];
      let entity = data.stockEntity;
      dynamicItemValueList.push(entity.name);
      dynamicItemValueList.push(entity.departmentModel);
      dynamicItemValueList.push(entity.manufacturer.name);
      dynamicItemValueList.push(entity.centerMedicine ? entity.centerMedicine.chargeLevel : undefined);
      dynamicItemValueList.push(entity.listPrice);
      dynamicItemValueList.push(data.departmentDisplayQuantity);
      if (data.stockSummaryList)
        dynamicItemValueList.push(data.stockSummaryList[0].firstExpireDate);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    if (rowControl)
      rowControl.medicineControl.medicineList = selectMedicineDropdownData;
    else
      this.medicineList = selectMedicineDropdownData;
  }

  private loadPharmacyList() {
    let warehouseFilter = {warehouseTypeList: ["药房"]};
    this.basicService.getWarehouseList(warehouseFilter)
      .subscribe(response => {
        if (response) {
          this.pharmacyList = response.content.map(p => p.uuid);
        }
      });
  }

  resetUi(prescription) {
    this.medicineSelect.itemSelect.focus();
    this.formErrors = {};
    this.selectedMedicine = undefined;
    this.medicineList = undefined;
    this.diagnoseList = undefined;
    this.medicinePrescription = prescription;
    this.newMedicinePrescriptionForm.reset();
    this.isChineseMedicine = false;
    for (let row of this.sameGroupMedicineList) {
      this.newMedicinePrescriptionForm.removeControl(row.medicineControl.controlInstance);
      this.newMedicinePrescriptionForm.removeControl(row.serveQuantityControl.controlInstance);
      this.newMedicinePrescriptionForm.removeControl(row.issueQuantityControl.controlInstance);
    }

    this.sameGroupMedicineList = [];
    this.chkManualDateChanged(false);
    if (!this.initPramLoaded) {
      this.loadInitData();
      //this.prescriptionService.callGetUseMethodListService();
      //this.prescriptionService.useMethodObservable.subscribe(response => {
      //this.setDefaultValue();
      //});
      this.loadPharmacyList();
      this.initPramLoaded = true;
    } else
      this.setDefaultValue();
    if (prescription.uuid) {
      this.loadPrescriptionDetail()
    }
    //console.log('new medicine');
    //this.medicineSelect.focusInputBox();
  }

  private loadInitData() {
    this.prescriptionService.getFrequencyList().subscribe(response => {
      if (response) {
        this.frequencyList = response.content;
      }
    });

    this.prescriptionService.getUseMethodList().subscribe(response => {
      if (response) {
        this.useMethodList = response.content;
        this.newMedicinePrescriptionForm.patchValue({
          selectUseMethod: this.useMethodList ? this.useMethodList.find(t => t.defaultSelection === true).id : undefined,
        });

      }
    });
  }

  private setDefaultValue() {
    this.newMedicinePrescriptionForm.patchValue({
      selectUseMethod: this.useMethodList ? this.useMethodList.find(t => t.defaultSelection === true).id : undefined,
    });
  }

  private loadPrescriptionDetail() {
    this.loading = true;
    this.prescriptionService.getMedicinePrescriptionDetail(this.medicinePrescription.uuid)
      .subscribe(response => {
          if (response) {
            this.patchFormValue(response.content);
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.message.create("error", "读取详细信息失败");
        });
  }

  private patchFormValue(medicinePrescriptionDetail: any) {
    this.selectedMedicine = medicinePrescriptionDetail.medicine;
    let medicineArray = [{stockEntity: medicinePrescriptionDetail.medicine}];
    this.buildItemDynamicSelectionValueList(medicineArray);
    if (this.selectedMedicine && this.selectedMedicine.typeDto.name == '中草药')
      this.isChineseMedicine = true;
    else
      this.isChineseMedicine = false;

    let diagnose = medicinePrescriptionDetail.diagnose;
    if (diagnose) {
      let diagnoseArray = [diagnose];
      this.buildDiagnoseDynamicSelectionValueList(diagnoseArray);
    }

    this.newMedicinePrescriptionForm.patchValue({
      txtMedicine: medicineArray[0],
      txtServeQuantity: medicinePrescriptionDetail.serveQuantity,
      txtFirstDayQuantity: medicinePrescriptionDetail.prescriptionChargeable.firstDayQuantity,
      selectFrequency: medicinePrescriptionDetail.prescriptionChargeable.frequency.id,
      //txtIssueQuantity: this.calculateIssueQuantity(),
      selectUseMethod: medicinePrescriptionDetail.useMethod.id,
      txtDropSpeed: medicinePrescriptionDetail.dropSpeed,
      txtNote: medicinePrescriptionDetail.prescriptionChargeable.prescription.reference,
      chkManualDate: medicinePrescriptionDetail.prescriptionChargeable.manualStartDate,
      dateStartDateTime: medicinePrescriptionDetail.prescriptionChargeable.manualStartDate ? medicinePrescriptionDetail.prescriptionChargeable.manualStartDate : undefined,
      txtFixedQuantity: medicinePrescriptionDetail.fixedQuantity,
      selectDiagnose: diagnose
    });
  }

  selectedMedicineChanged(selectedMedicineRow: any) {
    if (selectedMedicineRow)
      this.selectedMedicine = selectedMedicineRow.stockEntity;
    else
      this.selectedMedicine = undefined;
    this.newMedicinePrescriptionForm.patchValue({
      txtMedicine: selectedMedicineRow,
      txtServeQuantity: this.selectedMedicine ? this.selectedMedicine.serveToMinRate : undefined,
    });

    if (this.selectedMedicine && this.selectedMedicine.typeDto.name == '中草药') {
      this.isChineseMedicine = true;
      this.newMedicinePrescriptionForm.get('txtFixedQuantity')!.setValidators(Validators.required);
      this.newMedicinePrescriptionForm.get('txtFixedQuantity')!.markAsDirty();
    } else {
      this.isChineseMedicine = false;
      this.newMedicinePrescriptionForm.get('txtFixedQuantity')!.clearValidators();
      this.newMedicinePrescriptionForm.get('txtFixedQuantity')!.markAsPristine();
    }
    this.newMedicinePrescriptionForm.get('txtFixedQuantity')!.updateValueAndValidity();
  }

  // private setDefaultValue() {
  //   this.useMethodList = this.prescriptionService.useMethodList;
  //
  // }

  chkManualDateChanged(checked: boolean) {
    if (!checked) {
      this.newMedicinePrescriptionForm.get('dateStartDateTime')!.clearValidators();
      this.newMedicinePrescriptionForm.get('dateStartDateTime')!.markAsPristine();
    } else {
      this.newMedicinePrescriptionForm.get('dateStartDateTime')!.setValidators(Validators.required);
      this.newMedicinePrescriptionForm.get('dateStartDateTime')!.markAsDirty();
    }
    this.newMedicinePrescriptionForm.get('dateStartDateTime')!.updateValueAndValidity();
  }


  searchUserMethod(searchCode: string) {
    this.useMethodList = this.prescriptionService.useMethodList.filter(u => u.searchCode.search(searchCode.toLocaleUpperCase()) >= 0);
  }

  getIssueDailyPharmacyQuantity() {
    let issueDailyServeQuantity = this.getIssueDailyServeQuantity();
    if (!issueDailyServeQuantity)
      return undefined;
    return Math.ceil(issueDailyServeQuantity / this.selectedMedicine.serveToMinRate / this.selectedMedicine.departmentConversionRate)
  }

  getIssueDailyServeQuantity() {
    if (!this.selectedMedicine)
      return undefined;
    let serveQuantity = this.newMedicinePrescriptionForm.value.txtServeQuantity;
    if (!serveQuantity)
      return undefined;
    let frequencyId = this.newMedicinePrescriptionForm.value.selectFrequency;
    let frequencyInfo = this.prescriptionService.frequencyList.find(f => f.id == frequencyId)
    if (!frequencyInfo)
      return undefined;

    return serveQuantity * frequencyInfo.frequency;
  }


  getIssueQuantityInfo() {
    let issueDailyServeQuantity = this.getIssueDailyServeQuantity();
    if (!issueDailyServeQuantity)
      return undefined;
    let issueQuantityInfo = this.getIssueDailyPharmacyQuantity() + this.selectedMedicine.departmentUom.name;

    let firstDayQuantity = this.newMedicinePrescriptionForm.value.txtFirstDayQuantity;
    if (firstDayQuantity) {
      let firstDayIssueQuantity = Math.ceil((issueDailyServeQuantity + (firstDayQuantity * this.newMedicinePrescriptionForm.value.txtServeQuantity)) / this.selectedMedicine.serveToMinRate / this.selectedMedicine.departmentConversionRate)
      issueQuantityInfo += ` (首日:${firstDayIssueQuantity}${this.selectedMedicine.departmentUom.name})`;
    }
    return issueQuantityInfo;
  }

  searchDiagnose(dynamicSelectEvent: any) {
    if (dynamicSelectEvent == undefined)
      return;
    let searchFilter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.basicService.getSelectionDiseaseList(searchFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildDiagnoseDynamicSelectionValueList(response.content);
          this.diagnoseListTotalCount = response.totalCount;
          this.diagnoseListPageCount = response.totalPages;
        }
      });
  }

  private buildDiagnoseDynamicSelectionValueList(selectDiagnoseDropDownData: any) {
    for (let data of selectDiagnoseDropDownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.code);
      dynamicItemValueList.push(data.name);
      data["label"] = dynamicItemValueList[1];
      data["valueList"] = dynamicItemValueList;
    }
    this.diagnoseList = selectDiagnoseDropDownData;
  }

  hideDiagnoseSelection() {
    if (this.selectedMedicine && this.selectedMedicine.attribute) {
      let attributeName = this.selectedMedicine.attribute.name;
      if (attributeName == '一类精神' || attributeName == '二类精神' || attributeName == '麻醉')
        return false;
    }
    return true;
  }

  frequencyChanged(frequencyId: any) {
    if (this.isOneOff && frequencyId) {
      let frequency = this.prescriptionService.frequencyList.find(f => f.id == frequencyId);

      if (frequency) {
        let firstDayQuantity = 1;
        if (frequency.code == 'once')
          firstDayQuantity = undefined;
        this.newMedicinePrescriptionForm.patchValue({
          txtFirstDayQuantity: firstDayQuantity
        });
      }
    }
  }

  addSameGroupMedicine() {
    const id = this.sameGroupMedicineList.length > 0 ? this.sameGroupMedicineList[this.sameGroupMedicineList.length - 1].id + 1 : 0;

    const medicineRowControl = {
      id,
      medicineControl: {
        controlInstance: `groupMedicine${id}`,
        medicineList: [],
        medicineListTotalCount: 0,
        pageCount: 0,
        selectedMedicine: undefined
      },
      serveQuantityControl:
        {
          controlInstance: `groupMedicineServeQuantity${id}`,
        },
      issueQuantityControl:
        {
          controlInstance: `groupMedicineIssueQuantity${id}`,
        }
    }
    const index = this.sameGroupMedicineList.push(medicineRowControl);

    this.newMedicinePrescriptionForm.addControl(
      this.sameGroupMedicineList[index - 1].medicineControl.controlInstance,
      new FormControl(null, Validators.required)
    );

    this.newMedicinePrescriptionForm.addControl(
      this.sameGroupMedicineList[index - 1].serveQuantityControl.controlInstance,
      new FormControl(null, Validators.required)
    );

    this.newMedicinePrescriptionForm.addControl(
      this.sameGroupMedicineList[index - 1].issueQuantityControl.controlInstance,
      new FormControl(null, null)
    );
  }

  removeRowControl(row: any, e: MouseEvent) {
    if (e)
      e.preventDefault();
    const index = this.sameGroupMedicineList.indexOf(row);
    this.sameGroupMedicineList.splice(index, 1);
    this.newMedicinePrescriptionForm.removeControl(row.medicineControl.controlInstance);
    this.newMedicinePrescriptionForm.removeControl(row.serveQuantityControl.controlInstance);
    this.newMedicinePrescriptionForm.removeControl(row.issueQuantityControl.controlInstance);
  }


  selectedSameGroupMedicineChanged(row: any, selectSameGroupMedicine: any) {
    if (selectSameGroupMedicine)
      row.medicineControl.selectedMedicine = selectSameGroupMedicine;
    else
      row.medicineControl.selectedMedicine = undefined;
    //console.log(row.medicineControl.controlInstance);
    //this.newMedicinePrescriptionForm.controls[row.medicineControl.controlInstance].patchValue(selectSameGroupMedicine);
    //console.log(this.newMedicinePrescriptionForm);
  }


  getGroupMedicineUom(i: number, uomType:any) {
    let selectedMedicine = this.sameGroupMedicineList[i].medicineControl.selectedMedicine;
    if (selectedMedicine)
      return selectedMedicine["stockEntity"][uomType].name;
  }

}

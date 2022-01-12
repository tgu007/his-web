import {Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NzMessageService, NzSelectComponent} from "ng-zorro-antd";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";
import {FormArray, FormBuilder, FormControl, Validators} from "@angular/forms";
import {BasicService} from "../../../../service/basic.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import * as globals from "../../../../../globals";

@Component({
  selector: 'app-treatment-detail',
  templateUrl: './treatment-detail.component.html',
  styleUrls: ['./treatment-detail.component.css']
})
export class TreatmentDetailComponent implements OnInit {
  treatmentDetailForm: any;
  minUomList: any;
  treatment: any;
  pramInitialized: any = false;
  @Output() treatmentSavedEvent = new EventEmitter<any>();
  feeTypeList: any;
  isSaving: any = false;
  @ViewChildren(NzSelectComponent)
  nzSelectComponentList: QueryList<NzSelectComponent>;
  nzFilterOption = () => true;
  centerTreatmentList: any;
  @ViewChild(CommonDynamicSelectComponent, {static: true}) centerTreatmentSelect: CommonDynamicSelectComponent;
  centerTreatmentListTotalCount: number;
  centerTreatmentListPageCount: any;
  dropDownColumnList: any;
  recoveryTypeList: any;
  departmentList: any;
  departmentTypeList: any = ['病区科室', '康复科室', '放射科', '检验科', '病理科', 'B超室'];
  labTreatmentTypeList: any;
  labSampleTypeList: any;
  childTreatmentControlList: Array<{ id: number; controlInstance: string; treatmentList: any, treatmentListTotalCount: any, pageCount: any, selectedTreatment: any }> = [];
  selectionTablePageSize = globals.selectionPageSize;

  constructor(private fb: FormBuilder, private basicService: BasicService,
              private message: NzMessageService,
              private ybService: YbTzService) {
  }

  ngOnInit() {
    this.dropDownColumnList = ['名称', '开始日期', '结束日期', '类别', '自付比例', '中心编码'];
    this.treatmentDetailForm = this.fb.group({
      txtCode: [undefined, null],
      txtName: ["", [Validators.required]],
      txtSearchCode: ["", undefined],
      selectMinUom: ["", [Validators.required]],
      chkEnabled: ["", null],
      selectFeeType: ["", [Validators.required]],
      selectCenterTreatment: [null, [Validators.required]],
      selectDepartmentType: ["", [Validators.required]],
      selectDefaultDepartment: ["", null],
      selectRecoveryType: ["", null],
      numberDuration: ["", null],
      chkAllowMultiExecution: ["", null],
      selectLabTreatmentType: ["", null],
      selectLabSampleType: ["", null],
      chkCombo: ["", false]
    });

  }


  initializeSelectionList() {
    this.basicService.getTreatmentDetailInitializeSelectionList()
      .subscribe(response => {
        if (response) {
          this.minUomList = response.content.minUomList;
          this.feeTypeList = response.content.feeTypeList;
          this.recoveryTypeList = response.content.recoverTypeList;
          this.departmentList = response.content.departmentTreatmentList;
          this.labTreatmentTypeList = response.content.labTreatmentTypeList;
          this.labSampleTypeList = response.content.labSampleTypeList;
          this.pramInitialized = true;
          this.initializeFormData();
        }
      });
  }

  private initializeFormData() {
    if (this.treatment) {
      this.patchFormValue();
    }else
      this.treatmentDetailForm.patchValue({
        chkCombo: false
      });
  }

  resetUI(treatment: any) {
    this.treatmentDetailForm.reset();
    this.treatment = treatment;
    for (let childTreatmentControl of this.childTreatmentControlList) {
      this.treatmentDetailForm.removeControl(childTreatmentControl.controlInstance);
    }
    this.sortedControlList = [];
    this.childTreatmentControlList = [];
    this.centerTreatmentList = undefined;
    if (this.pramInitialized == false)
      this.initializeSelectionList();
    else {
      this.initializeFormData();
    }
  }

  saveTreatment() {
    //FormValidator.validateForm(this.medicineDetailForm, this.formErrors, false, 'formMedicinePrescription');
    if (!this.treatmentDetailForm.valid) {
      FormValidator.validateFormInput(this.treatmentDetailForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.treatmentDetailForm.getRawValue();
    let treatment = this.getData(data);
    //console.log(item);
    this.isSaving = true;
    this.basicService.saveTreatment(treatment)
      .subscribe(response => {
          this.isSaving = false;
          if (response) {
            this.treatment = response.content;
            //this.message.create("success", "保存成功");
            // if (this.treatment.ybUploadError)
            //   this.message.create("warning", "医保未上传，请检查错误信息");
            this.treatmentDetailForm.patchValue({
              txtCode: this.treatment.code,
              txtSearchCode: this.treatment.searchCode
            });
            if (this.treatment.ybUploadError)
            {
              this.isSaving = false;
              this.treatmentSavedEvent.emit();
              this.message.create("warning", "保存成功，但医保未上传，请检查错误信息");
            }

            else {
              if (this.treatment.ybMatchStatus == '待上传') {
                this.message.create("success", "保存成功，开始匹配");
                this.matchTreatment();
              } else {
                this.isSaving = false;
                this.message.create("success", "保存成功");
                this.treatmentSavedEvent.emit();
              }
            }
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", error.error.message);
        });
  }

  matchTreatment() {
    this.isSaving = true;
    this.ybService.matchTreatment(this.treatment.uuid)
      .subscribe(response => {
          this.message.success("诊疗项目匹配成功");
          this.treatmentSavedEvent.emit();
          this.isSaving = false;
        },
        error => {
          this.isSaving = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  getData(data) {
    let childTreatmentIdList: any[] = [];
    if ((<FormArray>this.treatmentDetailForm.controls)["chkCombo"].value) {
      for (let childTreatmentControl of this.childTreatmentControlList) {
        childTreatmentIdList.push((<FormArray>this.treatmentDetailForm.controls)[childTreatmentControl.controlInstance].value.uuid);
      }
    }


    return {
      uuid: this.treatment ? this.treatment.uuid : undefined,
      name: data.txtName,
      searchCode: data.txtSearchCode,
      feeTypeId: data.selectFeeType,
      minSizeUomId: data.selectMinUom,
      enabled: !data.chkEnabled,
      centerTreatmentId: data.selectCenterTreatment ? data.selectCenterTreatment.uuid : undefined,
      departmentTreatmentType: data.selectDepartmentType,
      defaultDepartmentId: data.selectDefaultDepartment,
      duration: data.numberDuration,
      recoveryTypeId: data.selectRecoveryType,
      allowMultiExecution: data.chkAllowMultiExecution,
      labTreatmentTypeId: data.selectLabTreatmentType,
      labSampleTypeId: data.selectLabSampleType,
      combo: data.chkCombo,
      childTreatmentIdList: childTreatmentIdList
    }
  }

  private patchFormValue() {
    if (this.treatment.centerTreatment) {
      let centerTreatmentArray = [this.treatment.centerTreatment];
      this.buildItemDynamicSelectionValueList(centerTreatmentArray);
    }

    this.treatmentDetailForm.patchValue({
      txtCode: this.treatment.code,
      txtName: this.treatment.name,
      selectFeeType: this.treatment.feeType.id,
      txtSearchCode: this.treatment.searchCode,
      selectMinUom: this.treatment.minSizeUom.uuid,
      chkEnabled: !this.treatment.enabled,
      selectCenterTreatment: this.treatment.centerTreatment ? this.treatment.centerTreatment : undefined,
      selectDepartmentType: this.treatment.executeDepartmentType,
      selectDefaultDepartment: this.treatment.defaultExecuteDepartment ? this.treatment.defaultExecuteDepartment.uuid : undefined,
      numberDuration: this.treatment.duration,
      selectRecoveryType: this.treatment.recoveryType ? this.treatment.recoveryType.id : undefined,
      chkAllowMultiExecution: this.treatment.allowMultiExecution,
      selectLabTreatmentType: this.treatment.labTreatmentType ? this.treatment.labTreatmentType.id : undefined,
      selectLabSampleType: this.treatment.labSampleType ? this.treatment.labSampleType.id : undefined,
      chkCombo: this.treatment.combo
    });

    if (this.treatment.combo && this.treatment.childTreatmentList) {
      for (let treatment of this.treatment.childTreatmentList) {
        this.addChildTreatmentControl(treatment);
      }
    }

  }

  private buildItemDynamicSelectionValueList(selectCenterTreatmentDropdownData: any) {
    //let dynamicItemList: any = [];
    for (let data of selectCenterTreatmentDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.name);
      dynamicItemValueList.push(data.startDate);
      dynamicItemValueList.push(data.endDate);
      dynamicItemValueList.push(data.chargeLevel);
      dynamicItemValueList.push(data.payRatio);
      dynamicItemValueList.push(data.code2);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.centerTreatmentList = selectCenterTreatmentDropdownData;
  }

  addUOM(inputUom: any, uomType: string, uomSelectionList: any, controlName: any) {
    const value = inputUom.value;
    if (value == '' || value == undefined)
      return
    this.basicService.quickAddUom({name: value, uomType: uomType}).subscribe(response => {
      if (response) {
        if (!uomSelectionList.find(p => p.uuid == response.content.uuid)) {
          uomSelectionList.push(response.content);
        }
        this.treatmentDetailForm.controls[controlName].patchValue(response.content.uuid);
        let openedSelectComponent = this.nzSelectComponentList.find(s => s.open);
        if (openedSelectComponent)
          openedSelectComponent.closeDropDown();
      }
    });
  }

  searchCenterTreatment(dynamicSelectEvent: any) {
    if (dynamicSelectEvent == '')
      return;

    let searchCode = {searchCode: dynamicSelectEvent.input};
    this.centerTreatmentSelect.isLoading = true;
    this.ybService.getSelectionCenterTreatmentList(searchCode, dynamicSelectEvent.pageNumber, 5)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content);
          this.centerTreatmentListTotalCount = response.totalCount;
          this.centerTreatmentSelect.isLoading = false;
          this.centerTreatmentListPageCount = response.totalPages;
        }
      });
  }

  selectedCenterTreatmentChanged(selectedCenterTreatmentRow: any) {
    this.treatmentDetailForm.patchValue({
      selectCenterTreatment: selectedCenterTreatmentRow,
    });
  }

  sortedControlList: any = []

  reArrangeChildTreatmentControlList() {
    this.sortedControlList = [];
    let rowCount;
    let colIndex;
    for (let index = 0; index < this.childTreatmentControlList.length; index++) {
      colIndex = index % 3;
      if (colIndex == 0) {
        let rowArray: any = [];
        this.sortedControlList.push(rowArray)
      }
      rowCount = this.sortedControlList.length;
      let control = this.childTreatmentControlList[index];
      this.sortedControlList[rowCount - 1].push(control);
    }
  }

  addChildTreatmentControl(treatment: any = undefined) {
    const id = this.childTreatmentControlList.length > 0 ? this.childTreatmentControlList[this.childTreatmentControlList.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `childTreatment${id}`,
      treatmentList: treatment ? [treatment] : [],
      treatmentListTotalCount: treatment ? 1 : 0,
      pageCount: treatment ? 1 : 0,
      selectedTreatment: treatment ? treatment : undefined
    };
    const index = this.childTreatmentControlList.push(control);

    this.treatmentDetailForm.addControl(
      this.childTreatmentControlList[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );

    if (treatment) {
      let addedControl: FormControl = this.treatmentDetailForm.controls[control.controlInstance];
      addedControl.patchValue(treatment);
      this.buildChildDynamicSelectionValueList(control, [treatment]);
    }

    this.reArrangeChildTreatmentControlList();
  }

  removeChildTreatmentControl(control: any, e: MouseEvent = undefined) {
    if (e)
      e.preventDefault();
    const index = this.childTreatmentControlList.indexOf(control);
    this.childTreatmentControlList.splice(index, 1);
    this.treatmentDetailForm.removeControl(control.controlInstance);
    this.reArrangeChildTreatmentControlList();
  }

  searchTreatment(control: any, dynamicSelectEvent: any) {
    if (dynamicSelectEvent == '')
      return;
    let treatmentFilter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.basicService.getSelectionPagedTreatmentList(treatmentFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildChildDynamicSelectionValueList(control, response.content);
          control.treatmentListTotalCount = response.totalCount;
          control.pageCount = response.totalPages;
        }
      });

  }

  private buildChildDynamicSelectionValueList(control: any, selectTreatmentDropdownData: any) {
    for (let treatment of selectTreatmentDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(treatment.name);
      dynamicItemValueList.push(treatment.listPrice);
      treatment["label"] = dynamicItemValueList[0];
      treatment["valueList"] = dynamicItemValueList;
    }
    control.treatmentList = selectTreatmentDropdownData;
  }

  selectedTreatmentChanged(control: any, selectedTreatment: any) {
    if (selectedTreatment)
      control.selectedTreatment = selectedTreatment;
    else
      control.selectedTreatment = undefined;

  }
}



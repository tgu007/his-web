import {Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from "@angular/forms";
import {NzMessageService, NzSelectComponent} from "ng-zorro-antd";
import {BasicService} from "../../../../service/basic.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import {YbTzService} from "../../../../service/yb-tz.service";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";

@Component({
  selector: 'app-medicine-detail',
  templateUrl: './medicine-detail.component.html',
  styleUrls: ['./medicine-detail.component.css']
})
export class MedicineDetailComponent implements OnInit {
  medicineDetailForm: any;
  typeList: any;
  functionTypeList: any;
  storageTypeList: any;
  levelList: any;
  attributeList: any;
  DoseTypeList: any;
  pharmacyUomList: any;
  serveUomList: any;
  warehouseUomList: any;
  minUomList: any;
  medicine: any;
  pramInitialized: any = false;
  @Output() medicineSavedEvent = new EventEmitter<any>();
  @ViewChildren(NzSelectComponent)
  nzSelectComponentList: QueryList<NzSelectComponent>;

  nzFilterOption = () => true;
  feeTypeList: any;
  isSaving: any = false;
  manufacturerList: any = [];
  addingManufacture: any = false;
  centerMedicineList: any;
  @ViewChild(CommonDynamicSelectComponent, {static: true}) centerMedicineSelect: CommonDynamicSelectComponent;
  centerMedicineListTotalCount: number;
  centerMedicineListPageCount: any;
  dropDownColumnList: any;
  private rematchRequired: boolean = false;


  constructor(private fb: FormBuilder, private basicService: BasicService,
              private message: NzMessageService,
              private ybService: YbTzService) {
  }

  ngOnInit() {
    this.dropDownColumnList = ['名称', '开始日期', '结束日期', '剂型', '规格', '产地', '类别', '自付比例', '中心编码', '价格'];
    this.medicineDetailForm = this.fb.group({
      txtCode: [undefined, null],
      txtName: ["", [Validators.required]],
      selectType: ["", null],
      selectStorageType: ["", null],
      txtSearchCode: ["", ""],
      selectFunctionType: ["", null],
      selectLevel: ["", null],
      selectAttribute: ["", null],
      selectDoseType: ["", [Validators.required]],
      selectMinUom: ["", [Validators.required]],
      numberServeSize: ["", [Validators.required]],
      selectServeUom: ["", [Validators.required]],
      selectWarehouseUom: ["", [Validators.required]],
      numberWarehouseSize: ["", [Validators.required]],
      txtWarehouseModel: ["", null],
      selectPharmacyUom: ["", [Validators.required]],
      numberPharmacySize: ["", [Validators.required]],
      txtPharmacyModel: ["", null],
      chkCanSplit: [false, null],
      chkSkinTest: [false, null],
      chkNeedPrescription: [false, null],
      chkEnabled: [false, null],
      selectFeeType: ["", [Validators.required]],
      chkSelfPay: [false, null],
      selectManufacturer: ["", [Validators.required]],
      selectCenterMedicine: [null, [Validators.required]],
      chkFFSign: [false, null]
    });
  }

  public initializeSelectionList() {
    this.basicService.getMedicineDetailInitializeSelectionList()
      .subscribe(response => {
        if (response) {
          this.typeList = response.content.typeDtoList;
          this.functionTypeList = response.content.functionTypeDtoList;
          this.storageTypeList = response.content.storageTypeDtoList;
          this.levelList = response.content.levelDtoList;
          this.attributeList = response.content.attributeDtoList;
          this.DoseTypeList = response.content.formDtoList;
          this.pharmacyUomList = response.content.pharmacyUomDtoList;
          this.minUomList = response.content.minUomDtoList;
          this.serveUomList = response.content.serveUomDtoList;
          this.warehouseUomList = response.content.warehouseUomDtoList;
          this.feeTypeList = response.content.feeTypeList;
          this.pramInitialized = true;
          this.initializeFormData();
        }
      });
  }

  public saveMedicine() {
    //FormValidator.validateForm(this.medicineDetailForm, this.formErrors, false, 'formMedicinePrescription');
    if (!this.medicineDetailForm.valid) {
      FormValidator.validateFormInput(this.medicineDetailForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.medicineDetailForm.getRawValue();
    let medicine = this.getData(data);
    this.isSaving = true;
    this.basicService.saveMedicine(medicine)
      .subscribe(response => {
          if (response) {
            this.medicine = response.content;
            this.medicineDetailForm.patchValue({
              txtCode: this.medicine.code,
              txtSearchCode: this.medicine.searchCode
            });
            // if (this.medicine.ybUploadError)
            //   this.message.create("warning", "保存成功，但医保未上传，请检查错误信息");
            // else {
            //
            // }
            //if(this.medicine.ybMatchStatus.ybUploadResult)
            if (this.medicine.ybUploadError) {
              this.isSaving = false;
              this.medicineSavedEvent.emit();
              this.message.create("warning", "保存成功，但医保未上传，请检查错误信息");
            } else {
              if (this.medicine.ybMatchStatus == '待上传' || this.rematchRequired) {
                this.message.create("success", "保存成功，开始匹配");
                this.matchMedicine();
              } else {
                this.isSaving = false;
                this.message.create("success", "保存成功");
                this.medicineSavedEvent.emit();
              }
            }
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", error.error.message);
        }
      );
  }

   matchMedicine() {
    this.isSaving = true;
    this.ybService.matchMedicine(this.medicine.uuid)
      .subscribe(response => {
          this.message.success("药品匹配成功");
          this.medicineSavedEvent.emit();
          this.isSaving = false;
        },
        error => {
          this.isSaving = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  getData(data) {
    return {
      uuid: this.medicine ? this.medicine.uuid : undefined,
      name: data.txtName,
      searchCode: data.txtSearchCode ? data.txtSearchCode : "",
      typeId: data.selectType,
      feeTypeId: data.selectFeeType,
      storageTypeId: data.selectStorageType ? data.selectStorageType : undefined,
      functionTypeId: data.selectFunctionType ? data.selectFunctionType : undefined,
      levelId: data.selectLevel ? data.selectLevel : undefined,
      attributeId: data.selectAttribute ? data.selectAttribute : undefined,
      doseTypeId: data.selectDoseType ? data.selectDoseType : undefined,
      enabled: !data.chkEnabled,
      canSplit: data.chkCanSplit,
      skinTest: data.chkSkinTest,
      needPrescription: data.chkNeedPrescription,
      minSizeUomId: data.selectMinUom,
      serveSizeUomId: data.selectServeUom,
      departmentUomId: data.selectPharmacyUom,
      warehouseUomId: data.selectWarehouseUom,
      departmentModel: data.txtPharmacyModel,
      warehouseModel: data.txtWarehouseModel,
      serveToMinRate: data.numberServeSize,
      departmentToMinRate: data.numberPharmacySize,
      warehouseToMinRate: data.numberWarehouseSize,
      manufacturerId: data.selectManufacturer,
      selfPay: data.chkSelfPay,
      centerMedicineId: data.selectCenterMedicine && !data.chkSelfPay ? data.selectCenterMedicine.uuid : undefined,
      ffSign: data.chkFFSign
    }
  }

  resetUI(medicine: any) {
    this.medicineDetailForm.reset();
    this.rematchRequired = false;
    this.medicine = medicine;
    this.setUomControlsState(true);
    this.manufacturerList = undefined;
    this.centerMedicineList = undefined;
    if (this.pramInitialized == false)
      this.initializeSelectionList();
    else {
      this.initializeFormData();
    }
    this.subscribeControlChange();
  }

  private initializeFormData() {
    if (this.medicine) {
      this.patchFormValue();
      this.checkMedicineAllowEdit();
      this.medicineDetailForm.controls.chkSelfPay.disable();
    } else {
      this.setDefaultValue();
      this.medicineDetailForm.controls.chkSelfPay.enable();
    }
  }

  private setDefaultValue() {
    let defaultTypeId = this.typeList.find(t => t.defaultSelection === true).id;
    this.medicineDetailForm.patchValue({
      selectType: defaultTypeId,
      selectFeeType: this.feeTypeList.find(t => t.parent.id === defaultTypeId).id,
    });

  }

  private minUOMChanged(minUomId) {
    if (!minUomId)
      return;
    let minUom = this.minUomList.find(u => u.uuid == minUomId)
    if (!minUom)
      return;

    this.tryFindSameUom(this.pharmacyUomList, minUom, 'selectPharmacyUom', 'numberPharmacySize');
    this.tryFindSameUom(this.warehouseUomList, minUom, 'selectWarehouseUom', 'numberWarehouseSize');
    this.tryFindSameUom(this.serveUomList, minUom, 'selectServeUom', 'numberServeSize');
  }

  private tryFindSameUom(uomList: any, minUom: any, updateUomControlName: any, updateConversionControlName: any) {
    let currentUomValue = this.medicineDetailForm.controls[updateUomControlName].value
    if (!currentUomValue) {
      let nameMatchedUom = uomList.find(u => u.name == minUom.name);
      if (nameMatchedUom) {
        this.medicineDetailForm.controls[updateUomControlName].patchValue(nameMatchedUom.uuid);
        this.medicineDetailForm.controls[updateConversionControlName].patchValue(1);
      }
    }
  }

  private subscribeControlChange() {
    this.subscribeUomControl('selectWarehouseUom', 'numberWarehouseSize');
    this.subscribeUomControl('selectPharmacyUom', 'numberPharmacySize');
    this.subscribeUomControl('selectServeUom', 'numberServeSize');
    this.subscribeUomControl('numberWarehouseSize');
    this.subscribeUomControl('numberPharmacySize');
    this.subscribeUomControl('numberServeSize');

    this.medicineDetailForm.get('selectMinUom').valueChanges.subscribe(data => {
      this.minUOMChanged(data);
      this.trySetModelInfo();
    });

    let selectTypeControl = this.medicineDetailForm.get('selectType');
    selectTypeControl.valueChanges.subscribe(data => {
      if (selectTypeControl.pristine)
        return;
      let matchedFeeType = this.feeTypeList.find(t => t.parent.id === data);
      this.medicineDetailForm.controls['selectFeeType'].patchValue(matchedFeeType ? matchedFeeType.id : undefined);
    });

  }


  private subscribeUomControl(uomControlName: any, conversionControlName: any = undefined) {
    const uomControl = this.medicineDetailForm.controls[uomControlName];
    uomControl.valueChanges.subscribe(data => {
      if (uomControl.pristine)
        return;
      if (conversionControlName)
        this.medicineDetailForm.controls[conversionControlName].patchValue(undefined);
      this.trySetModelInfo();
    });
  }

  private trySetModelInfo() {
    const pharmacyModelControl = this.medicineDetailForm.controls['txtPharmacyModel'];
    const warehouseModelControl = this.medicineDetailForm.controls['txtWarehouseModel'];
    if (pharmacyModelControl.value && warehouseModelControl.value)
      return;

    const serveUomControl = this.medicineDetailForm.controls['selectServeUom'];
    if (!serveUomControl.value)
      return

    const serveSizeControl = this.medicineDetailForm.controls['numberServeSize'];
    if (!serveSizeControl.value)
      return

    const minUomControl = this.medicineDetailForm.controls['selectMinUom'];
    if (!minUomControl.value)
      return

    const pharmacyUomControl = this.medicineDetailForm.controls['selectPharmacyUom'];
    if (!pharmacyUomControl.value)
      return

    const pharmacySizeControl = this.medicineDetailForm.controls['numberPharmacySize'];
    if (!pharmacySizeControl.value)
      return


    //console.log
    let commonModel = serveSizeControl.value + this.serveUomList.find(u => u.uuid == serveUomControl.value).name;
    let appendString = pharmacySizeControl.value + this.minUomList.find(u => u.uuid == minUomControl.value).name;
    if (appendString != commonModel)
      commonModel += '*' + appendString;

    let pharmacyModel = commonModel;
    appendString = '1' + this.pharmacyUomList.find(u => u.uuid == pharmacyUomControl.value).name;
    if (appendString != pharmacyModel)
      pharmacyModel += '*' + appendString;
    if (!pharmacyModelControl.value)
      pharmacyModelControl.patchValue(pharmacyModel);

    const warehouseUomControl = this.medicineDetailForm.controls['selectWarehouseUom'];
    if (!warehouseUomControl.value)
      return

    const warehouseSizeControl = this.medicineDetailForm.controls['numberWarehouseSize'];
    if (!warehouseSizeControl.value)
      return

    let warehouseModel = commonModel;
    appendString = warehouseSizeControl.value + this.pharmacyUomList.find(u => u.uuid == pharmacyUomControl.value).name;
    if (appendString != commonModel)
      warehouseModel += '*' + appendString;
    appendString = '1' + this.warehouseUomList.find(u => u.uuid == warehouseUomControl.value).name;
    if (appendString != warehouseModel)
      warehouseModel += '*' + appendString;
    if (!warehouseModelControl.value)
      warehouseModelControl.patchValue(warehouseModel);
  }


  setUomControlsState(enable: boolean) {
    if (enable) {
      this.medicineDetailForm.controls.selectMinUom.enable();
      this.medicineDetailForm.controls.selectPharmacyUom.enable();
      this.medicineDetailForm.controls.selectWarehouseUom.enable();
      this.medicineDetailForm.controls.numberWarehouseSize.enable();
      this.medicineDetailForm.controls.numberPharmacySize.enable();
      this.medicineDetailForm.controls.selectManufacturer.enable();
      //this.centerMedicineSelect.setDisabledState(false);

    } else {
      this.medicineDetailForm.controls.selectMinUom.disable();
      this.medicineDetailForm.controls.selectPharmacyUom.disable();
      this.medicineDetailForm.controls.selectWarehouseUom.disable();
      this.medicineDetailForm.controls.numberWarehouseSize.disable();
      this.medicineDetailForm.controls.numberPharmacySize.disable();
      this.medicineDetailForm.controls.selectManufacturer.disable();
      //this.centerMedicineSelect.setDisabledState(true);
    }

  }

  private patchFormValue() {
    if (this.medicine.manufacturer)
      this.manufacturerList = [this.medicine.manufacturer];
    if (this.medicine.centerMedicine) {
      let centerMedicineArray = [this.medicine.centerMedicine];
      this.buildItemDynamicSelectionValueList(centerMedicineArray);
    } else
      this.chkSelfPayChanged(true);


    this.medicineDetailForm.patchValue({
      txtCode: this.medicine.code,
      txtName: this.medicine.name,
      selectType: this.medicine.typeDto.id,
      selectFeeType: this.medicine.feeType.id,
      selectStorageType: this.medicine.storageType ? this.medicine.storageType.id : undefined,
      txtSearchCode: this.medicine.searchCode,
      selectFunctionType: this.medicine.functionType ? this.medicine.functionType.id : undefined,
      selectLevel: this.medicine.level ? this.medicine.level.id : undefined,
      selectAttribute: this.medicine.attribute ? this.medicine.attribute.id : undefined,
      selectDoseType: this.medicine.doseType ? this.medicine.doseType.id : undefined,
      selectMinUom: this.medicine.minSizeUom ? this.medicine.minSizeUom.uuid : undefined,
      numberServeSize: this.medicine.serveToMinRate,
      selectServeUom: this.medicine.serveSizeUom ? this.medicine.serveSizeUom.uuid : undefined,
      selectWarehouseUom: this.medicine.warehouseUom ? this.medicine.warehouseUom.uuid : undefined,
      numberWarehouseSize: this.medicine.warehouseConversionRate,
      txtWarehouseModel: this.medicine.warehouseModel,
      selectPharmacyUom: this.medicine.departmentUom ? this.medicine.departmentUom.uuid : undefined,
      numberPharmacySize: this.medicine.departmentConversionRate,
      txtPharmacyModel: this.medicine.departmentModel,
      chkCanSplit: this.medicine.canSplit,
      chkSkinTest: this.medicine.skinTest,
      chkNeedPrescription: this.medicine.needPrescription,
      chkEnabled: !this.medicine.enabled,
      chkSelfPay: this.medicine.selfPay,
      selectManufacturer: this.medicine.manufacturer ? this.medicine.manufacturer.uuid : undefined,
      selectCenterMedicine: this.medicine.centerMedicine ? this.medicine.centerMedicine : undefined,
      chkFFSign: this.medicine.ffSign
    });
  }


  searchManufacturer(input: string) {
    if (input == '')
      return;
    let searchCodeDto = {searchCode: input};
    this.basicService.getManufacturerList(searchCodeDto, 'medicine')
      .subscribe(response => {
        if (response) {
          this.manufacturerList = response.content
        }
      });
  }

  private checkMedicineAllowEdit() {
    if (!this.medicine.uuid)
      return;
    this.basicService.checkMedicineAllowEdit(this.medicine.uuid).subscribe(response => {
      if (response) {
        this.setUomControlsState(response.content)
      }
    });
  }


  saveNewManufacture(inputElement: any) {
    const inputValue = inputElement.value;
    if (inputValue == '' || inputValue == undefined)
      return

    this.addingManufacture = true;
    let manufacture = {name: inputValue};
    this.basicService.quickAddManufacture(manufacture, 'medicine').toPromise()
      .then(response => {
        this.manufacturerList = [response.content];
        this.medicineDetailForm.controls["selectManufacturer"].patchValue(response.content.uuid);
        let openedSelectComponent = this.nzSelectComponentList.find(s => s.open);
        if (openedSelectComponent)
          openedSelectComponent.closeDropDown();
        this.addingManufacture = false;
      })
      .catch(error => {
        this.addingManufacture = false;
        this.message.create("error", error.error.message);
      })
  }

  addUOM(inputUom: any, uomType: string, uomSelectionList: any, controlName: any) {
    const value = inputUom.value;
    if (value == '' || value == undefined)
      return
    this.basicService.quickAddUom({name: value, uomType: uomType}).subscribe(response => {
      if (response) {
        if (!uomSelectionList.find(p => p.uuid == response.content.uuid)) {
          //uomSelectionList = [...uomSelectionList, response.content]
          uomSelectionList.push(response.content);
        }
        this.medicineDetailForm.controls[controlName].patchValue(response.content.uuid);
        let openedSelectComponent = this.nzSelectComponentList.find(s => s.open);
        if (openedSelectComponent)
          openedSelectComponent.closeDropDown();
      }
    });
  }

  getConversionInfo(uomControlName: any, conversionControlName: any, uomList: any, reverseRatio: any = false) {
    const data = this.medicineDetailForm.getRawValue();
    if (data.selectMinUom && data[uomControlName] && data[conversionControlName]) {
      let minUom = this.minUomList.find(u => u.uuid == data.selectMinUom)
      let uom = uomList.find(u => u.uuid == data[uomControlName])
      if (minUom && uom && minUom.name != uom.name)
        return `=${data[conversionControlName]}${reverseRatio ? uom.name : minUom.name}`;
    } else
      return undefined;
  }

  getWarehouseConversionInfo() {
    return this.getConversionInfo('selectWarehouseUom', 'numberWarehouseSize', this.warehouseUomList);
  }

  getServeConversionInfo() {
    return this.getConversionInfo('selectServeUom', 'numberServeSize', this.serveUomList, true);
  }

  getPharmacyConversionInfo() {
    return this.getConversionInfo('selectPharmacyUom', 'numberPharmacySize', this.pharmacyUomList);
  }


  searchCenterMedicine(dynamicSelectEvent: any) {
    if (dynamicSelectEvent == '')
      return;

    let searchCode = {searchCode: dynamicSelectEvent.input};
    this.centerMedicineSelect.isLoading = true;
    this.ybService.getSelectionCenterMedicineList(searchCode, dynamicSelectEvent.pageNumber, 5)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content);
          this.centerMedicineListTotalCount = response.totalCount;
          this.centerMedicineSelect.isLoading = false;
          this.centerMedicineListPageCount = response.totalPages;
        }
      });
  }

  private buildItemDynamicSelectionValueList(selectCenterMedicineDropdownData: any) {
    //let dynamicItemList: any = [];
    for (let data of selectCenterMedicineDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.name);
      dynamicItemValueList.push(data.startDate);
      dynamicItemValueList.push(data.endDate);
      dynamicItemValueList.push(data.doseType);
      dynamicItemValueList.push(data.model);
      dynamicItemValueList.push(data.manufacture);
      dynamicItemValueList.push(data.chargeLevel);
      dynamicItemValueList.push(data.payRatio);
      dynamicItemValueList.push(data.code2);
      dynamicItemValueList.push(data.listPrice);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.centerMedicineList = selectCenterMedicineDropdownData;
  }

  selectedCenterMedicineChanged(selectedCenterMedicineRow: any) {
    this.rematchRequired = true;
    this.medicineDetailForm.patchValue({
      selectCenterMedicine: selectedCenterMedicineRow,
    });
  }

  chkSelfPayChanged(checked: boolean) {
    if (checked) {
      this.medicineDetailForm.get('selectCenterMedicine')!.clearValidators();
      this.medicineDetailForm.get('selectCenterMedicine')!.markAsPristine();
    } else {
      this.medicineDetailForm.get('selectCenterMedicine')!.setValidators(Validators.required);
      this.medicineDetailForm.get('selectCenterMedicine')!.markAsDirty();
    }
    this.medicineDetailForm.get('selectCenterMedicine')!.updateValueAndValidity();
  }


}

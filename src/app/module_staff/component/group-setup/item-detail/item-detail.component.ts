import {Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {NzMessageService, NzSelectComponent} from "ng-zorro-antd";
import {BasicService} from "../../../../service/basic.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";
import {YbTzService} from "../../../../service/yb-tz.service";

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  itemDetailForm: any;
  wareHouseTypeList: any;
  storageTypeList: any;
  minUomList: any;
  warehouseUomList: any;
  item: any;
  pramInitialized: any = false;
  @Output() itemSavedEvent = new EventEmitter<any>();
  feeTypeList: any;
  private allowEdit: any = true;
  isSaving: any = false;
  departmentUomList: any;
  @ViewChildren(NzSelectComponent)
  nzSelectComponentList: QueryList<NzSelectComponent>;
  nzFilterOption = () => true;

  manufacturerList: any = [];
  addingManufacture: any = false;
  centerTreatmentList: any;
  @ViewChild(CommonDynamicSelectComponent, {static: true}) centerTreatmentSelect: CommonDynamicSelectComponent;
  centerTreatmentListTotalCount: number;
  centerTreatmentListPageCount: any;
  dropDownColumnList: any;

  constructor(private fb: FormBuilder, private basicService: BasicService,
              private message: NzMessageService,
              private ybService: YbTzService) {
  }

  ngOnInit() {
    this.dropDownColumnList = ['名称', '开始日期', '结束日期', '规格', '类别', '自付比例', '中心编码'];
    this.itemDetailForm = this.fb.group({
      txtCode: [undefined, null],
      txtName: ["", [Validators.required]],
      selectWarehouseType: ["", [Validators.required]],
      selectStorageType: ["", null],
      txtSearchCode: ["", undefined],
      selectMinUom: ["", [Validators.required]],
      chkEnabled: ["", null],
      selectWarehouseUOM: ["", [Validators.required]],
      numberWarehouseSize: [1, [Validators.required]],
      txtWarehouseModel: ["", null],
      selectDepartmentUOM: ["", [Validators.required]],
      numberDepartmentSize: [1, [Validators.required]],
      txtDepartmentModel: ["", null],
      selectFeeType: ["", [Validators.required]],
      chkSelfPay: [false, null],
      selectManufacturer: ["", [Validators.required]],
      selectCenterTreatment: [null, [Validators.required]]
    });

  }

  initializeSelectionList() {
    this.basicService.getItemDetailInitializeSelectionList()
      .subscribe(response => {
        if (response) {
          this.wareHouseTypeList = response.content.warehouseList;
          this.storageTypeList = response.content.storageTypeList;
          this.minUomList = response.content.minUomList;
          this.departmentUomList = response.content.departmentUomList;
          this.warehouseUomList = response.content.warehouseUomList;
          this.feeTypeList = response.content.feeTypeList;
          this.pramInitialized = true;
          this.initializeFormData();
        }
      });
  }

  private initializeFormData() {
    if (this.item) {
      this.patchFormValue();
      this.checkItemAllowEdit();
      this.itemDetailForm.controls.chkSelfPay.disable();
    } else {
      this.setDefaultValue();
      this.itemDetailForm.controls.chkSelfPay.enable();
    }
  }

  resetUI(item: any) {
    this.itemDetailForm.reset();
    this.item = item;
    this.setUomControlsState(true);
    this.manufacturerList = undefined;
    this.centerTreatmentList = undefined;
    if (this.pramInitialized == false)
      this.initializeSelectionList();
    else {
      this.initializeFormData();
    }
    this.listenToUomChange();
  }

  private setDefaultValue() {
    this.itemDetailForm.patchValue({
      selectWarehouseType: this.wareHouseTypeList.find(t => t.defaultSelection === true).id,
      selectStorageType: this.storageTypeList.find(t => t.defaultSelection === true).id,
      selectFeeType: this.feeTypeList.find(t => t.defaultSelection === true).id,
    });
    this.itemDetailForm.get('selectMinUom').valueChanges.subscribe(data => {
      this.minUOMchanged(data)
    });
  }

  setUomControlsState(enable: boolean) {
    if (enable) {
      this.itemDetailForm.controls.selectMinUom.enable();
      this.itemDetailForm.controls.selectDepartmentUOM.enable();
      this.itemDetailForm.controls.selectWarehouseUOM.enable();
      this.itemDetailForm.controls.numberWarehouseSize.enable();
      this.itemDetailForm.controls.numberDepartmentSize.enable();
    } else {
      this.itemDetailForm.controls.selectMinUom.disable();
      this.itemDetailForm.controls.selectDepartmentUOM.disable();
      this.itemDetailForm.controls.selectWarehouseUOM.disable();
      this.itemDetailForm.controls.numberWarehouseSize.disable();
      this.itemDetailForm.controls.numberDepartmentSize.disable();
    }

  }

  saveItem() {
    //FormValidator.validateForm(this.medicineDetailForm, this.formErrors, false, 'formMedicinePrescription');
    if (!this.itemDetailForm.valid) {
      FormValidator.validateFormInput(this.itemDetailForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.itemDetailForm.getRawValue();
    let item = this.getData(data);
    //console.log(item);
    this.isSaving = true;
    this.basicService.saveItem(item)
      .subscribe(response => {
          this.isSaving = false;
          if (response) {
            this.item = response.content;

            // if (this.item.ybUploadError)
            //   this.message.create("warning", "医保未上传，请检查错误信息");
            this.itemDetailForm.patchValue({
              txtCode: this.item.code,
              txtSearchCode: this.item.searchCode
            });

            if (this.item.ybUploadError) {
              this.isSaving = false;
              this.message.create("warning", "保存成功，但医保未上传，请检查错误信息");
              this.itemSavedEvent.emit();
            } else {
              if (this.item.ybMatchStatus == '待上传') {
                this.message.create("success", "保存成功，开始匹配");
                this.matchItem();
              } else {
                this.isSaving = false;
                this.message.create("success", "保存成功");
                this.itemSavedEvent.emit();
              }
            }
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", error.error.message);
        });
  }

  private matchItem() {
    this.isSaving = true;
    this.ybService.matchItem(this.item.uuid)
      .subscribe(response => {
          this.message.success("耗材匹配成功");
          this.itemSavedEvent.emit();
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
      uuid: this.item ? this.item.uuid : undefined,
      name: data.txtName,
      searchCode: data.txtSearchCode,
      warehouseTypeId: data.selectWarehouseType,
      storageTypeId: data.selectStorageType ? data.selectStorageType : undefined,
      feeTypeId: data.selectFeeType,
      minSizeUomId: data.selectMinUom,
      warehouseUomId: data.selectWarehouseUOM,
      departmentUomId: data.selectDepartmentUOM,
      warehouseModel: data.txtWarehouseModel,
      enabled: !data.chkEnabled,
      departmentModel: data.txtDepartmentModel,
      warehouseToMinRate: data.numberWarehouseSize,
      departmentToMinRate: data.numberDepartmentSize,
      manufacturerId: data.selectManufacturer,
      selfPay: data.chkSelfPay,
      centerTreatmentId: data.selectCenterTreatment && !data.chkSelfPay ? data.selectCenterTreatment.uuid : undefined
    }
  }

  private patchFormValue() {
    if (this.item.manufacturer)
      this.manufacturerList = [this.item.manufacturer];
    if (this.item.centerTreatment) {
      let centerTreatmentArray = [this.item.centerTreatment];
      this.buildItemDynamicSelectionValueList(centerTreatmentArray);
    } else
      this.chkSelfPayChanged(true);

    this.itemDetailForm.patchValue({
      txtCode: this.item.code,
      txtName: this.item.name,
      selectWarehouseType: this.item.warehouseType.id,
      selectFeeType: this.item.feeType.id,
      selectStorageType: this.item.storageType ? this.item.storageType.id : undefined,
      txtSearchCode: this.item.searchCode,
      selectMinUom: this.item.minSizeUom.uuid,
      chkEnabled: !this.item.enabled,
      selectWarehouseUOM: this.item.warehouseUom ? this.item.warehouseUom.uuid : undefined,
      numberWarehouseSize: this.item.warehouseConversionRate,
      txtWarehouseModel: this.item.warehouseModel,
      selectDepartmentUOM: this.item.departmentUom ? this.item.departmentUom.uuid : undefined,
      numberDepartmentSize: this.item.departmentConversionRate,
      txtDepartmentModel: this.item.departmentModel,
      chkSelfPay: this.item.selfPay,
      selectManufacturer: this.item.manufacturer ? this.item.manufacturer.uuid : undefined,
      selectCenterTreatment: this.item.centerTreatment ? this.item.centerTreatment : undefined
    });
  }

  private checkItemAllowEdit() {
    this.basicService.checkItemAllowEdit(this.item.uuid).subscribe(response => {
      if (response) {
        this.allowEdit = response.content;
        this.setUomControlsState(this.allowEdit)
      }
    });
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
        this.itemDetailForm.controls[controlName].patchValue(response.content.uuid);
        let openedSelectComponent = this.nzSelectComponentList.find(s => s.open);
        if (openedSelectComponent)
          openedSelectComponent.closeDropDown();
      }
    });
  }


  private minUOMchanged(minUOMId: any) {
    if (!minUOMId)
      return;
    let minUom = this.minUomList.find(u => u.uuid == minUOMId)
    if (!minUom)
      return;

    this.tryFindSameUom(this.departmentUomList, minUom, 'selectDepartmentUOM', 'numberDepartmentSize');
    this.tryFindSameUom(this.warehouseUomList, minUom, 'selectWarehouseUOM', 'numberWarehouseSize');
  }

  private tryFindSameUom(uomList: any, minUom: any, updateUomControlName: any, updateConversionControlName: any) {
    let currentUomValue = this.itemDetailForm.controls[updateUomControlName].value
    if (!currentUomValue) {
      let nameMatchedUom = uomList.find(u => u.name == minUom.name);
      if (nameMatchedUom) {
        this.itemDetailForm.controls[updateUomControlName].patchValue(nameMatchedUom.uuid);
        this.itemDetailForm.controls[updateConversionControlName].patchValue(1);
      }
    }
  }

  private listenToUomChange() {
    const warehouseUom = this.itemDetailForm.get('selectWarehouseUOM');
    this.subscribeUomControl(warehouseUom, 'numberWarehouseSize');

    const departmentUOM = this.itemDetailForm.get('selectDepartmentUOM');
    this.subscribeUomControl(departmentUOM, 'numberDepartmentSize');
  }

  private subscribeUomControl(uomControl: any, conversionControlName: any) {
    uomControl.valueChanges.subscribe(data => {
      if (uomControl.pristine)
        return;
      this.itemDetailForm.controls[conversionControlName].patchValue(undefined);
    });
  }


  getWarehouseConversionInfo() {
    return this.getConversionInfo('selectWarehouseUOM', 'numberWarehouseSize', this.warehouseUomList);
  }

  getDepartmentConversionInfo() {
    return this.getConversionInfo('selectDepartmentUOM', 'numberDepartmentSize', this.departmentUomList);
  }

  getConversionInfo(uomControlName: any, conversionControlName: any, uomList: any) {
    const data = this.itemDetailForm.getRawValue();
    if (data.selectMinUom && data[uomControlName] && data[conversionControlName]) {
      let minUom = this.minUomList.find(u => u.uuid == data.selectMinUom)
      let uom = uomList.find(u => u.uuid == data[uomControlName])
      if (minUom && uom && minUom.name != uom.name)
        return `=${data[conversionControlName]}${minUom.name}`;
    } else
      return undefined;
  }

  searchManufacturer(input: string) {
    if (input == '')
      return;
    let searchCodeDto = {searchCode: input};
    this.basicService.getManufacturerList(searchCodeDto, 'item')
      .subscribe(response => {
        if (response) {
          this.manufacturerList = response.content
        }
      });
  }


  saveNewManufacture(inputElement: any) {
    const inputValue = inputElement.value;
    if (inputValue == '' || inputValue == undefined)
      return

    this.addingManufacture = true;
    let manufacture = {name: inputValue};
    this.basicService.quickAddManufacture(manufacture, 'item').toPromise()
      .then(response => {
        this.manufacturerList = [response.content];
        this.itemDetailForm.controls["selectManufacturer"].patchValue(response.content.uuid);
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

  private buildItemDynamicSelectionValueList(selectCenterTreatmentDropdownData: any) {
    //let dynamicItemList: any = [];
    for (let data of selectCenterTreatmentDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.name);
      dynamicItemValueList.push(data.startDate);
      dynamicItemValueList.push(data.endDate);
      dynamicItemValueList.push(data.model);
      dynamicItemValueList.push(data.chargeLevel);
      dynamicItemValueList.push(data.payRatio);
      dynamicItemValueList.push(data.code2);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.centerTreatmentList = selectCenterTreatmentDropdownData;
  }

  selectedCenterTreatmentChanged(selectedCenterTreatmentRow: any) {
    this.itemDetailForm.patchValue({
      selectCenterTreatment: selectedCenterTreatmentRow,
    });
  }

  chkSelfPayChanged(checked: boolean) {
    if (checked) {
      this.itemDetailForm.get('selectCenterTreatment')!.clearValidators();
      this.itemDetailForm.get('selectCenterTreatment')!.markAsPristine();
    } else {
      this.itemDetailForm.get('selectCenterTreatment')!.setValidators(Validators.required);
      this.itemDetailForm.get('selectCenterTreatment')!.markAsDirty();
    }
    this.itemDetailForm.get('selectCenterTreatment')!.updateValueAndValidity();
  }

}

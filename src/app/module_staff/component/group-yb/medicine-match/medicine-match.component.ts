import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {formControlRowTable} from "../../group-common/formControlRowTable";
import {NzMessageService, NzSelectComponent} from "ng-zorro-antd";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {YbTzService} from "../../../../service/yb-tz.service";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";

@Component({
  selector: 'app-medicine-match',
  templateUrl: './medicine-match.component.html',
  styleUrls: ['./medicine-match.component.css']
})
export class MedicineMatchComponent extends formControlRowTable implements OnInit {
  isSaving: any = false;
  medicine: any;
  medicineMatchForm: any;
  dropDownColumnList: any;

  constructor(message: NzMessageService,
              private fb: FormBuilder,
              public datePipe: DatePipe,
              public ybService: YbTzService
  ) {
    super(message);
  }

  ngOnInit() {
    this.medicineMatchForm = this.fb.group({
      matchList: this.fb.array([])
    });
    this.setLineArray(<FormArray>this.medicineMatchForm.controls['matchList']);
    this.dropDownColumnList = ['名称', '开始日期', '结束日期', '剂型', '规格', '产地', '类别'];
  }

  protected newLineControl() {
    return this.fb.group({
      selectCenterMedicine: [null, Validators.required],
      txtStartDate: [null, Validators.required],
      txtEndDate: [null, Validators.required],
      txtStatus: [null, Validators.required],
    });
  }

  resetUI(medicine: any) {
    this.medicineMatchForm.reset();
    this.medicine = medicine;
    this.loadMatchList();
    this.resetUi();
  }

  public getData() {
    let medicineMatch = {medicineId: this.medicine.uuid}
    let matchList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      let match = {
        centerMedicineId: rowControl.value.selectCenterMedicine.uuid,
        startDate: this.datePipe.transform(rowControl.value.txtStartDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(rowControl.value.txtEndDate, 'yyyy-MM-dd'),
        status: rowControl.value.txtStatus
      };
      matchList.push(match);
    }
    medicineMatch["matchList"] = matchList;
    return medicineMatch;
  }

  saveMatch() {
    let medicineMatch = this.getData();
    this.isSaving = true;
    this.ybService.saveMedicineMatch(medicineMatch)
      .subscribe(response => {
          this.isSaving = false;
          this.message.create("success", "保存成功");
        },
        error => {
          this.isSaving = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  private loadMatchList() {
    this.ybService.loadMatchList(this.medicine.uuid)
      .subscribe(response => {
          for (let line of response.content) {
            this.addLineControl(false);
            let rowIndex = this.lineArray.controls.length - 1;
            let matchLineControl = this.lineArray.controls [rowIndex];

            matchLineControl.patchValue({
              selectCenterMedicine: line.centerMedicine,
              txtStartDate: line.startDate,
              txtEndDate: line.endDate,
              txtStatus: line.status
            });
          }
        }
      );
  }

  searchCenterMedicine(dynamicSelectEvent: any, index: number) {
    if (dynamicSelectEvent == '')
      return;
    //console.log(dynamicSelectEvent.pageNumber);
    this.callLoadMedicineService(dynamicSelectEvent.input, index, dynamicSelectEvent.pageNumber);
  }

  private buildItemDynamicSelectionValueList(selectEntityDropdownData: any, rowIndex: number) {
    //let dynamicItemList: any = [];
    for (let data of selectEntityDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.name);
      dynamicItemValueList.push(data.startDate);
      dynamicItemValueList.push(data.endDate);
      dynamicItemValueList.push(data.doseType);
      dynamicItemValueList.push(data.model);
      dynamicItemValueList.push(data.manufacture);
      dynamicItemValueList.push(data.chargeLevel);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.editCache[rowIndex].rowSelectionList["entityList"] = selectEntityDropdownData;
  }

  private callLoadMedicineService(searchCodeString: any, index: number, pageNumber: any) {
    let searchCode = {searchCode: searchCodeString};
    this.ybService.getSelectionCenterMedicineList(searchCode, pageNumber, 5)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, index);
          this.editCache[index].rowSelectionList["dataListTotalCount"] = response.totalCount;
          this.editCache[index].rowSelectionList["dataListPageCount"] = response.totalPages;
        }
      });
  }

  addLineControlClicked() {
    this.addLineControl();
    let rowIndex = this.lineArray.controls.length - 1;
    this.callLoadMedicineService(this.medicine.name, rowIndex, 1);
  }

  selectedMedicineChanged(selectedMedicine: any, rowIndex: number) {
    this.lineArray.controls [rowIndex]
      .patchValue(
        {
          txtStartDate: selectedMedicine.startDate,
          txtEndDate: selectedMedicine.endDate,
          txtStatus: '无记录'
        }
      );
  }
}

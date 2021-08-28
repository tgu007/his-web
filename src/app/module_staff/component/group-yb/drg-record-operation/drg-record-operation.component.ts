import {Component, Input, OnInit} from '@angular/core';
import {formControlRowTable} from "../../group-common/formControlRowTable";
import * as globals from "../../../../../globals";
import {NzMessageService} from "ng-zorro-antd";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {BasicService} from "../../../../service/basic.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-drg-record-operation',
  templateUrl: './drg-record-operation.component.html',
  styleUrls: ['./drg-record-operation.component.css']
})
export class DrgRecordOperationComponent extends formControlRowTable implements OnInit {
  @Input() drgRecordForm: any
  selectionTablePageSize = globals.selectionPageSize;
  operationLevelList: any = undefined;
  operatorList: any = undefined;


  constructor(message: NzMessageService,
              private fb: FormBuilder,
              public ybService: YbTzService,
              private datePipe: DatePipe,
  ) {
    super(message);
  }

  ngOnInit() {
    this.setLineArray(<FormArray>this.drgRecordForm.controls['operationList']);
  }

  protected newLineControl() {
    let newLineControl = this.fb.group({
      chkMain: [false, Validators.required],
      chkYYX: [false, Validators.required],
      txtICD9Code: [undefined, Validators.required],
      operationStartDate: [undefined, Validators.required],
      operationEndDate: [undefined, Validators.required],
      selectOperationLevel: [undefined, Validators.required],
      selectICD9: [undefined, Validators.required],
      selectOperator: [undefined, Validators.required],
    });
    newLineControl.patchValue({
      selectOperationLevel: this.operationLevelList.find(t => t.defaultSelection === true).uuid
    });
    return newLineControl;
  }

  selectionChanged(lineControl: any) {
    lineControl.controls["txtICD9Code"].patchValue(lineControl.controls["selectICD9"].value.code);
  }

  searchIcd9(dynamicSelectEvent: any, rowIndex: any) {
    if (dynamicSelectEvent == undefined)
      return;
    let searchFilter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.ybService.getSelectionIcd9List(searchFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, rowIndex);
          this.editCache[rowIndex].rowSelectionList['dataCount'] = response.totalCount;
          this.editCache[rowIndex].rowSelectionList['pageCount'] = response.totalPages;
        }
      });
  }

  buildItemDynamicSelectionValueList(selectEntityDropdownData: any, rowIndex: number) {
    for (let data of selectEntityDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.code);
      dynamicItemValueList.push(data.name);
      data["label"] = dynamicItemValueList[1];
      data["valueList"] = dynamicItemValueList;
    }
    this.editCache[rowIndex].rowSelectionList["dataList"] = selectEntityDropdownData;
  }

  getData() {
    let operationList: any[] = [];
    let operation: any;
    for (let rowControl of this.lineArray.controls) {
      operation = {
        mainOperation: rowControl.value.chkMain,
        yyxOperation: rowControl.value.chkYYX,
        icd9Code: rowControl.value.txtICD9Code,
        operationStartDate: this.datePipe.transform(rowControl.value.operationStartDate, 'yyyy-MM-dd HH:mm:ss'),
        operationEndDate: this.datePipe.transform(rowControl.value.operationEndDate, 'yyyy-MM-dd HH:mm:ss'),
        operationLevelId: rowControl.value.selectOperationLevel,
        icd9Id: rowControl.value.selectICD9.uuid,
        operatorId: rowControl.value.selectOperator,
      }
      operationList.push(operation);
    }
    return operationList;
  }

  patchOperationListValue(operationList: any) {
    for (let operation of operationList) {
      let rowControl = this.addLineControl(false);
      let rowIndex = this.lineArray.controls.length - 1;
      let itemArray = [operation.icd9];
      this.buildItemDynamicSelectionValueList(itemArray, rowIndex)
      rowControl.patchValue({
        chkMain: operation.mainOperation,
        chkYYX: operation.yyxOperation,
        txtICD9Code: operation.icd9.code,
        operationStartDate: operation.operationStartDate,
        operationEndDate: operation.operationEndDate,
        selectOperationLevel:  operation.operationLevel.uuid,
        selectICD9:  operation.icd9,
        selectOperator:  operation.operator?operation.operator.uuid :undefined,
        }
      );
    }
  }
}

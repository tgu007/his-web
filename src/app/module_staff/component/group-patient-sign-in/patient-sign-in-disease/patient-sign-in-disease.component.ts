import {Component, Input, OnInit} from '@angular/core';
import {formControlRowTable} from "../../group-common/formControlRowTable";
import {NzMessageService} from "ng-zorro-antd";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {BasicService} from "../../../../service/basic.service";
import * as globals from "../../../../../globals";

@Component({
  selector: 'app-patient-sign-in-disease',
  templateUrl: './patient-sign-in-disease.component.html',
  styleUrls: ['./patient-sign-in-disease.component.css']
})
export class PatientSignInDiseaseComponent extends formControlRowTable implements OnInit {
  @Input() patientSignInForm;
  selectionTablePageSize = globals.selectionPageSize;

  constructor(message: NzMessageService,
              private fb: FormBuilder,
              private basicService: BasicService,
  ) {
    super(message);
  }

  ngOnInit() {
    this.setLineArray(<FormArray>this.patientSignInForm.controls['diseaseList']);
  }

  searchDisease(dynamicSelectEvent: any, rowIndex: number) {
    if (dynamicSelectEvent == undefined)
      return;
    let searchFilter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.basicService.getSelectionDiseaseList(searchFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, rowIndex);
          this.editCache[rowIndex].rowSelectionList["diseaseListTotalCount"] = response.totalCount;
          this.editCache[rowIndex].rowSelectionList["diseaseListPageCount"] = response.totalPages;
        }
      });
  }

  protected newLineControl() {
    return this.fb.group({
      selectDisease: [undefined, Validators.required]
    });
  }

  private buildItemDynamicSelectionValueList(selectEntityDropdownData: any, rowIndex: number) {
    for (let data of selectEntityDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.code);
      dynamicItemValueList.push(data.name);
      dynamicItemValueList.push(data.type);
      data["label"] = dynamicItemValueList[1];
      data["valueList"] = dynamicItemValueList;
    }
    this.editCache[rowIndex].rowSelectionList["diseaseList"] = selectEntityDropdownData;
  }

  getData() {
    let diseaseIdList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      diseaseIdList.push(rowControl.value.selectDisease.uuid);
    }
    return diseaseIdList;
  }


  patchTableFromValue(diagnoseList: any) {
    for (let diagnose of diagnoseList) {
      let rowControl = this.addLineControl(false);
      let rowIndex = this.lineArray.controls.length - 1;
      let itemArray = [diagnose];
      this.buildItemDynamicSelectionValueList(itemArray, rowIndex)
      rowControl.patchValue({
          selectDisease: itemArray[0]
        }
      );
    }
  }
}

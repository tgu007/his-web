import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PrescriptionService} from "../../../../service/prescription.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";
import {formControlRowTable} from "../../group-common/formControlRowTable";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BasicService} from "../../../../service/basic.service";

@Component({
  selector: 'app-pre-defined-prescription-group',
  templateUrl: './pre-defined-prescription-group.component.html',
  styleUrls: ['./pre-defined-prescription-group.component.css']
})
export class PreDefinedPrescriptionGroupComponent extends formControlRowTable implements OnInit {
  preDefinedGroup: any = undefined;
  preDefinedGroupList: any = [];
  preDefinedGroupListTotalCount: any;
  preDefinedGroupListPageCount: any;
  @ViewChild(CommonDynamicSelectComponent, {static: true}) preDefinedGroupSelectComponent: CommonDynamicSelectComponent;
  private selectionTablePageSize: any = 5;
  lineBusy: any = false;
  hasUserChange: any = false;
  @Input() patientSignIn: any;
  generatingPrescription: any = false;
  @Output() prescriptionGeneratedEvent = new EventEmitter<any>();
  @Input() type: any;
  @Input() oneOff: any;

  constructor(public prescriptionService: PrescriptionService,
              message: NzMessageService,
              public sessionService: SessionService,
              private basicService: BasicService,
              private modal: NzModalService,
              private fb: FormBuilder,) {
    super(message);
  }

  ngOnInit() {
    this.setLineArray(this.fb.array([]));
    this.loadPreDefinedGroupList({type: '诊疗', oneOff:false}, 1);
    this.prescriptionService.callGetFrequencyListService();
  }

  public getTypeDescription() {
    if (this.type == 'treatment')
      return '诊疗';
    else
      return '药品';
  }

  clearUI() {
    // this.preDefinedGroupList = undefined;
    // this.setLineArray(this.fb.array([]));
    // this.preDefinedGroupSelectComponent.reset();
    // this.hasUserChange= false;
    // this.preDefinedGroup = undefined;
  }

  protected newLineControl() {
    this.hasUserChange = true;
    return this.fb.group({
      txtLineId: [undefined, undefined],
      selectTreatment: [undefined, Validators.required],
      selectFrequency: [undefined, Validators.required],
      numberFirstDayQuantity: [undefined, undefined],
      numberQuantity: [1, Validators.required]
    });
  }

  searchPredefinedGroup(dynamicSelectEvent: any) {
    if (dynamicSelectEvent == '')
      return;
    let filter = {enabled: true, searchCode: dynamicSelectEvent.input, type: this.getTypeDescription(), oneOff:this.oneOff};
    this.loadPreDefinedGroupList(filter, dynamicSelectEvent.pageNumber);

  }

  private loadPreDefinedGroupList(filter: any, pageNumber: any) {
    this.prescriptionService.getPreDefinedGroupList(filter, pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content);
          this.preDefinedGroupListTotalCount = response.totalCount;
          this.preDefinedGroupListPageCount = response.totalPages;
        }
      });
  }

  selectedGroupChanged() {
    //console.log(this.preDefinedGroup);
    this.hasUserChange = false;
    this.lineBusy = true;
    this.resetUi();
    this.prescriptionService.loadPreDefinedPrescriptionLineList(this.preDefinedGroup.uuid, this.type)
      .subscribe(response => {
          if (response) {
            this.patchTableData(response.content);
            this.hasUserChange = false;
          }
          this.lineBusy = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.lineBusy = false;
        }
      );
  }

  addNewGroup(newGroupName: any) {
    if (newGroupName == '' || newGroupName == undefined) {
      this.message.warning("名字不能为空");
      return;
    }
    let newGroup = {name: newGroupName};
    newGroup["employeeId"] = this.sessionService.loginUser.uuid;
    newGroup["type"] = this.getTypeDescription();
    newGroup["oneOff"] = this.oneOff;

    this.preDefinedGroupSelectComponent.adding = true;
    this.prescriptionService.addNewPredefinedGroup(newGroup)
      .subscribe(response => {
          if (response) {
            let group = [response.content];
            this.buildItemDynamicSelectionValueList(group)
            this.preDefinedGroupListTotalCount = 1;
            this.preDefinedGroupListPageCount = 1;
            this.preDefinedGroup = this.preDefinedGroupList[0];
            this.preDefinedGroupSelectComponent.closeDropDown();
            this.selectedGroupChanged();
          }
          this.preDefinedGroupSelectComponent.adding = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.preDefinedGroupSelectComponent.adding = false;
        }
      );
  }

  private buildItemDynamicSelectionValueList(dropDownData: any) {
    for (let group of dropDownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(group.name);
      dynamicItemValueList.push(group.createdByDoctor.name);
      group["label"] = dynamicItemValueList[0];
      group["valueList"] = dynamicItemValueList;
    }
    this.preDefinedGroupList = dropDownData;
  }


  searchEntity(dynamicSelectEvent: any, rowIndex: number) {
    if (dynamicSelectEvent == '')
      return;

    let filter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.basicService.getSelectionPagedTreatmentList(filter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionTreatmentValueList(response.content, rowIndex);
          this.editCache[rowIndex].rowSelectionList["dataListTotalCount"] = response.totalCount;
          this.editCache[rowIndex].rowSelectionList["dataListPageCount"] = response.totalPages;
        }
      });
  }

  private buildItemDynamicSelectionTreatmentValueList(selectTreatmentDropdownData: any, rowIndex) {
    for (let treatment of selectTreatmentDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(treatment.name);
      dynamicItemValueList.push(treatment.listPrice);
      treatment["label"] = dynamicItemValueList[0];
      treatment["valueList"] = dynamicItemValueList;
    }
    this.editCache[rowIndex].rowSelectionList["entityList"] = selectTreatmentDropdownData;
  }

  saveEntityLineList() {
    if (!this.allLineCommitted())
      return;
    let dataToSave = this.getData();
    this.lineBusy = true;
    this.prescriptionService.savePreDefinePrescriptionLineList(dataToSave)
      .subscribe(response => {
          this.message.success('保存成功');
          this.lineBusy = false;
          this.hasUserChange = false;
        },
        error => {
          this.lineBusy = false;
          this.message.error(error.error.message);
        }
      );
  }

  private getData() {
    let dataToSave = {uuid: this.preDefinedGroup.uuid};
    let treatmentLineList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      // let selectedEntity =  rowControl.value.selectEntity.stockEntity;
      let treatmentLine = {
        uuid: rowControl.value.txtLineId ? rowControl.value.txtLineId : undefined,
        entityId: rowControl.value.selectTreatment.uuid,
        frequencyId: rowControl.value.selectFrequency,
        quantity: rowControl.value.numberQuantity,
        firstDayQuantity: rowControl.value.numberFirstDayQuantity,
      };
      treatmentLineList.push(treatmentLine);
    }
    dataToSave["lineList"] = treatmentLineList;
    return dataToSave;
  }

  editLineControl(rowIndex: number) {
    super.editLineControl(rowIndex);
    this.hasUserChange = true;
  }

  removeLineControl(rowIndex: number) {
    super.removeLineControl(rowIndex);
    this.hasUserChange = true;
  }

  private patchTableData(lineList: any) {
    for (let line of lineList) {
      this.addLineControl(false);
      let rowIndex = this.lineArray.controls.length - 1;

      let treatmentArray = [line.treatment];
      this.buildItemDynamicSelectionTreatmentValueList(treatmentArray, rowIndex);

      let lineControl = this.lineArray.controls [rowIndex];
      lineControl.patchValue({
        txtLineId: line.uuid,
        selectTreatment: treatmentArray[0],
        selectFrequency: line.frequency.id,
        numberFirstDayQuantity: line.firstDayQuantity,
        numberQuantity: line.quantity
      });
    }
  }

  findFrequencyCode(frequencyId: any) {
    if (frequencyId) {
      return this.prescriptionService.frequencyList.find(f => f.id == frequencyId).code;
    }
    return undefined;
  }

  generatePrescription() {
    this.generatingPrescription = true;
    this.prescriptionService.generatePrescription(this.patientSignIn.uuid, this.preDefinedGroup.uuid, this.type)
      .subscribe(response => {
          this.modal.confirm({
            nzContent: '医嘱生成成功,点击确认返回医嘱列表并刷新，继续添加请点击取消',
            nzOnOk: () => {
              this.prescriptionGeneratedEvent.emit();
            }
          });
          this.generatingPrescription = false;
        },
        error => {
          this.generatingPrescription = false;
          this.message.error(error.error.message);
        }
      );
  }


}

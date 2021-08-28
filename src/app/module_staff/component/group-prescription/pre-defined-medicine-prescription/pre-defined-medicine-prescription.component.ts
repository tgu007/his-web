import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {formControlRowTable} from "../../group-common/formControlRowTable";
import {PrescriptionService} from "../../../../service/prescription.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {BasicService} from "../../../../service/basic.service";
import {FormBuilder, Validators} from "@angular/forms";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";

@Component({
  selector: 'app-pre-defined-medicine-prescription',
  templateUrl: './pre-defined-medicine-prescription.component.html',
  styleUrls: ['./pre-defined-medicine-prescription.component.css']
})
export class PreDefinedMedicinePrescriptionComponent  extends formControlRowTable  implements OnInit {
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
  selectFrequency: any;
  totalFixedQuantity: any;

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
    this.loadPreDefinedGroupList({type: '药品', oneOff:true}, 1);
    this.prescriptionService.callGetFrequencyListService();
  }

  protected newLineControl() {
    this.hasUserChange = true;
    return this.fb.group({
      txtLineId: [undefined, undefined],
      selectMedicine: [undefined, Validators.required],
      numberQuantity: [1, Validators.required]
    });
  }

  searchPredefinedGroup(dynamicSelectEvent: any) {
    if (dynamicSelectEvent == '')
      return;
    let filter = {enabled: true, searchCode: dynamicSelectEvent.input, type: '药品', oneOff:true};
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

  selectedGroupChanged() {
    //console.log(this.preDefinedGroup);
    this.hasUserChange = false;
    this.lineBusy = true;
    this.resetUi();
    this.prescriptionService.loadPreDefinedPrescriptionLineList(this.preDefinedGroup.uuid, 'medicine')
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
    newGroup["type"] = '药品';
    newGroup["oneOff"] = true;

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

  searchEntity(dynamicSelectEvent: any, rowIndex: number) {
    if (dynamicSelectEvent == '')
      return;

    let filter = {enabled: true, searchCode: dynamicSelectEvent.input, medicineTypeNameList:['中草药']};
    this.basicService.getSelectionPagedEntityList(filter, 'medicine', dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildDynamicSelectionMedicineValueList(response.content, rowIndex);
          this.editCache[rowIndex].rowSelectionList["dataListTotalCount"] = response.totalCount;
          this.editCache[rowIndex].rowSelectionList["dataListPageCount"] = response.totalPages;
        }
      });
  }

  private buildDynamicSelectionMedicineValueList(selectMedicineDropdownData: any, rowIndex) {
    for (let medicine of selectMedicineDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(medicine.name);
      dynamicItemValueList.push(medicine.listPrice);
      medicine["label"] = dynamicItemValueList[0];
      medicine["valueList"] = dynamicItemValueList;
    }
    this.editCache[rowIndex].rowSelectionList["entityList"] = selectMedicineDropdownData;
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
    let medicineLineList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      // let selectedEntity =  rowControl.value.selectEntity.stockEntity;
      let medicineLine = {
        uuid: rowControl.value.txtLineId ? rowControl.value.txtLineId : undefined,
        entityId: rowControl.value.selectMedicine.uuid,
        quantity: rowControl.value.numberQuantity
      };
      medicineLineList.push(medicineLine);
    }
    dataToSave["lineList"] = medicineLineList;
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

      let medicineArray = [line.medicine];
      this.buildDynamicSelectionMedicineValueList(medicineArray, rowIndex);

      let lineControl = this.lineArray.controls [rowIndex];
      lineControl.patchValue({
        txtLineId: line.uuid,
        selectMedicine: medicineArray[0],
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
    if(!this.totalFixedQuantity)
    {
      this.message.error("请填入要生成多少帖数");
      return
    }

    this.generatingPrescription = true;
    this.prescriptionService.generateMedicinePrescription(this.patientSignIn.uuid, this.preDefinedGroup.uuid, 'medicine', this.totalFixedQuantity)
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

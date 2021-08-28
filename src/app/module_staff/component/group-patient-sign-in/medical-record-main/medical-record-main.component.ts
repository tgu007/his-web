import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {DatePipe} from "@angular/common";
import {PatientService} from "../../../../service/patient.service";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {BasicService} from "../../../../service/basic.service";
import {PrintService} from "../../../../service/print.service";
import * as globals from "../../../../../globals";
import {YbTzService} from "../../../../service/yb-tz.service";

@Component({
  selector: 'app-medical-record-main',
  templateUrl: './medical-record-main.component.html',
  styleUrls: ['./medical-record-main.component.css']
})
export class MedicalRecordMainComponent implements OnInit, AfterViewInit {


  formData: any = {
    input1: {},
    input2: {},
    input3: {},
    input4: {},
    input5: {},
    input6: {},
    input7: {},
    input8: {},
    input9: {},
    input10: {},
    input11: {},
    input12: {},
    input13: {},
    input14: {},
    input15: {},
    input16: {},
    input17: {},
    input18: {},
    input19: {},
    input20: {},
    input21: {},
    input22: {},
    input23: {},
    input24: {},
    input25: {},
    input26: {},
    input27: {},
    input28: {},
    input29: {},
    input30: {},
    input31: {},
    input32: {},
    input33: {},
    input34: {},
    input35: {},
    input36: {},
    input37: {},
    input38: {},
    input39: {},
    input40: {},
    input41: {},
    input42: {},
    input43: {},
    input44: {},
    input45: {},
    input46: {},
    input47: {},
    input48: {},
    input49: {},
    input50: {},
    input51: {},
    input52: {},
    input53: {},
    input54: {},
    input55: {},
    input56: {},
    input57: {},
    input58: {},
    input59: {},
    input60: {},
    input61: {},
    input62: {},
    input63: {},
    input64: {},
    input65: {},
    input66: {},
    input67: {},
    input68: {},
    input69: {},
    input70: {},
    input71: {},
    input72: {},
    input73: {},
    input74: {},
    input75: {},
    input76: {},
    input77: {},
    input78: {},
    input79: {},
    input80: {},
    input81: {},
    input82: {},
    input83: {},
    input84: {},
    input85: {},
    input86: {},
    input87: {},
    input88: {},
    input89: {},
    input90: {},
    input91: {},
    input92: {},
    input93: {},
    input94: {},
    input95: {},
    input96: {},
    input97: {},
    input98: {},
    input99: {},
    input100: {},
    input101: {},
    input102: {},
    input103: {},
    input104: {},
    input105: {},
    input106: {},
    input107: {},
    input108: {},
    input109: {},
    input110: {},
    input111: {},
    input112: {},
    input113: {},
    input114: {},
    input115: {},
    input116: {},
    input117: {},
    input118: {},
    input119: {},
    input120: {},
    input121: {},
    input122: {},
    input123: {},
    input124: {},
    input125: {},
    input126: {},
    input127: {},
    input128: {},
    input129: {},
    input130: {},
    input131: {},
    input132: {},
    input133: {},
    input134: {},
    input135: {},
    input136: {},
    input137: {},
    input138: {},
    input139: {},
    input140: {},
    input141: {},
    input142: {},
    input143: {},
    input144: {},
    input145: {},
    input146: {},
    input147: {},
    input148: {},
    input149: {},
    input150: {},
    input151: {},
    input152: {},
    input153: {},
    input154: {},
    input155: {},
    input156: {},
    input157: {},
    input158: {},
    input159: {},
    input160: {},
    input161: {},
    input162: {},
    input163: {},
    input164: {},
    input165: {},
    input166: {},
    input167: {},
    input168: {},
    input169: {},
    input170: {},
    input171: {},
    input172: {},
    input173: {},
    input174: {},
    input175: {},
    input176: {},
    input177: {},
    input178: {},
    input179: {},
    input180: {},
    input181: {},
    input182: {},
    input183: {},
    input184: {},
    input185: {},
    input186: {},
    input187: {},
    input188: {},
    input189: {},
    input190: {},
    input191: {},
    input192: {},
    input193: {},
    input194: {},
    input195: {},
    input196: {},
    input197: {},
    input198: {},
    input199: {},
    input200: {},
    input201: {},
    input202: {},
    input203: {},
    input204: {},
    input205: {},
    input206: {},
    input207: {},
    input208: {},
    input209: {},
    input210: {},
    input211: {},
    input212: {},
    input213: {},
    input214: {},
    input215: {},
    input216: {},
    input217: {},
    input218: {},
    input219: {},
    input220: {},
    input221: {},
    input222: {},
    input223: {},
    input224: {},
    input225: {},
    input226: {},
    input227: {},
    input228: {},
    input229: {},
    input230: {},
    input231: {},
    input232: {},
    input233: {},
    input234: {},
    input235: {},
    input236: {},
    input237: {}
  };
  _medicalRecord: any;
  @Input() patientSignIn: any;
  @ViewChild('mainMedicalRecordForm', {static: true}) templateFom;
  isBusy: any = false;
  formPristine = true;
  @Output() formPristineChanged = new EventEmitter<any>();
  cachedFormDataString;
  confirmModal?: NzModalRef;
  showInputWithReplaceKey: any = false;
  diseaseSelection: any = {
    selection1: {},
    selection2: {},
    selection3: {},
    selection4: {},
    selection5: {},
    selection6: {},
    selection7: {},
    selection8: {},
    selection9: {},
    selection10: {},
    selection11: {},
    selection12: {}
  };
  //printing:any = false;


  icd9Selection: any = {
    selection1: {},
    selection2: {},
    selection3: {},
    selection4: {},
    selection5: {},
    selection6: {},
    selection7: {},
    selection8: {}

  };
  selectionTablePageSize = globals.selectionPageSize;
  selectionWidth: any = '100%';
  hospitalName: any;


  @Input()
  set medicalRecord(medicalRecord: any) {
    if (!medicalRecord)
      return;

    //只需要加载一次
    if (this._medicalRecord)
      return;

    if (!medicalRecord.uuid) {
      this.createMedicalRecordFromTemplate(medicalRecord);
    } else {
      this.loadMedicalRecord(medicalRecord.uuid);
    }
  }


  constructor(
    private datePipe: DatePipe,
    private patientSignInService: PatientService,
    private message: NzMessageService,
    public sessionService: SessionService,
    private modal: NzModalService,
    public basicService: BasicService,
    public printService: PrintService,
    public ybService: YbTzService
  ) {
    this.hospitalName = sessionService.loginUser.organization.name
  }

  private createMedicalRecordFromTemplate(medicalRecord) {
    let pram = {
      templateId: medicalRecord.templateId,
      patientSignInId: this.patientSignIn.uuid,
      doctorId: this.sessionService.loginUser.uuid
    };
    this.loadRecordFromTemplate(pram)
      .then(jsonContent => {
        medicalRecord.content = jsonContent;
        this._medicalRecord = medicalRecord;
      })
  }

  private loadMedicalRecord(uuid: any) {
    this.patientSignInService.loadMedicalRecord(uuid)
      .subscribe(response => {
          this.isBusy = false;
          if (response) {
            this._medicalRecord = response.content;
            this.cachedFormDataString = response.content.content;
            this.formData = JSON.parse(this.cachedFormDataString);
            for (let index = 0; index < 12; index++) {
              let selectionIndex = index + 1;
              let inputIndex = 48 + index * 3;
              let inputValue = this.formData['input' + inputIndex].value;
              if (inputValue) {
                this.patchDiseaseData('selection' + selectionIndex, inputValue);
              }
            }

            for (let index = 0; index < 8; index++) {
              let selectionIndex = index + 1;
              let inputIndex = 111 + index * 10;
              let inputValue = this.formData['input' + inputIndex].value;
              if (inputValue) {
                this.patchIcd9Data('selection' + selectionIndex, inputValue);
              }
            }
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        });
  }

  ngOnInit() {
  }


  private loadRecordFromTemplate(pram: any) {
    return this.patientSignInService.newMedicalRecordFromTemplate(pram)
      .toPromise()
      .then(
        response => {
          this.cachedFormDataString = response.content.template;
          let jsonContent = JSON.parse(this.cachedFormDataString);
          this.formData = jsonContent;
          return jsonContent;
        });
  }

  saveMedicalRecord() {
    let jsonString = JSON.stringify(this.formData)
    let data = {
      uuid: this._medicalRecord.uuid,
      name: this._medicalRecord.name,
      typeId: this._medicalRecord.typeId,
      content: jsonString,
      patientSignInId: this.patientSignIn.uuid,
      templateId: this._medicalRecord.templateId,
      silenceSave: false
    };


    this.isBusy = true;
    return this.patientSignInService.saveMedicalRecord(data)
      .toPromise()
      .then(response => {
          this.isBusy = false;
          if (response) {
            this.message.create("success", "保存成功");
            this._medicalRecord.uuid = response.content;
            this.markFormPristine();
            this.formPristine = true;
            this.formPristineChanged.emit(false);
            this.cachedFormDataString = jsonString;
            return jsonString;
          }

        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        });
  }

  ngAfterViewInit(): void {
    this.templateFom.form.statusChanges.subscribe(result => {
      if (this.templateFom.form.pristine != this.formPristine) {
        this.formPristine = !this.formPristine;
        this.formPristineChanged.emit(!this.formPristine);
      }
    });
  }


  cancelEdit() {
    this.confirmModal = this.modal.confirm({
      nzTitle: '取消修改',
      nzContent: '新修改的内容将不会被保存，点击确定继续',
      nzOnOk: () => {
        this.formData = JSON.parse(this.cachedFormDataString);
        this.markFormPristine();
      }
    });
  }

  private markFormPristine() {
    Object.keys(this.templateFom.controls).forEach(control => {
      this.templateFom.controls[control].markAsPristine();
    });
  }

  private markFormDirty() {
    Object.keys(this.templateFom.controls).forEach(control => {
      this.templateFom.controls[control].markAsDirty();
    });
  }


  updateRecordSystemValueClicked() {
    this.confirmModal = this.modal.confirm({
      nzTitle: '自动更新',
      nzContent: '从系统获取当前病人最新数据并更新至病案首页，当前页面数据会被保存并且可以被恢复，右边的问号小按钮可以查看哪些输入项会被更新，点击确定继续。',
      nzOnOk: () => {
        this.saveMedicalRecord()
          .then(jsonString => {
            //console.log(jsonString);
            this.updateRecordSystemValue(jsonString);
          })
      }
    });
  }


  private updateRecordSystemValue(jsonString: any) {
    let pram = {
      doctorId: this.sessionService.loginUser.uuid,
      currentPageContent: jsonString,
      patientSignInId: this.patientSignIn.uuid
    }
    this.patientSignInService.updateMainMedicalRecordSystemValue(pram)
      .subscribe(
        response => {
          this.formData = JSON.parse(response.content);
          this.message.create('success', '更新成功');
          this.markFormDirty();
        }
      )
  }

  printClicked() {
    this.printService.onPrintClicked.emit(
      {
        name: 'medicalRecordMain',
        data: this.formData
      });
  }


  searchDisease(dynamicSelectEvent: any, selectionControl: any) {
    if (dynamicSelectEvent == undefined)
      return;
    let searchFilter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.basicService.getSelectionDiseaseList(searchFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, selectionControl, this.diseaseSelection, false);
          this.diseaseSelection[selectionControl]['dataCount'] = response.totalCount;
          this.diseaseSelection[selectionControl]['pageCount'] = response.totalPages;
        }
      });
  }

  private buildItemDynamicSelectionValueList(selectEntityDropdownData: any, selectionControl: any, allSelectionData: any, displayName: any = true) {
    for (let data of selectEntityDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.code);
      dynamicItemValueList.push(data.name);
      if (displayName)
        data["label"] = dynamicItemValueList[1];
      else
        data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    allSelectionData[selectionControl]['list'] = selectEntityDropdownData;
  }

  diseaseSelectionChanged(selectionControl: any, inputControl, relatedControl: any, signInConditionControl: any = false) {
    this.formData[relatedControl].value = this.diseaseSelection[selectionControl]['value'].name;
    this.formData[inputControl].value = this.diseaseSelection[selectionControl]['value'];
    if (!this.formData[signInConditionControl].value)
      this.formData[signInConditionControl].value = '1';
  }

  private patchDiseaseData(selectionDisease: string, value: any) {
    this.buildItemDynamicSelectionValueList([value], selectionDisease, this.diseaseSelection, false)
    this.diseaseSelection[selectionDisease].value = value;
  }

  icd9SelectionChanged(selectionControl: string, inputControl: string, relatedControl: string) {
    this.formData[relatedControl].value = this.icd9Selection[selectionControl]['value'].code;
    this.formData[inputControl].value = this.icd9Selection[selectionControl]['value'];
  }

  searchIcd9(dynamicSelectEvent: any, selectionControl: any) {
    if (dynamicSelectEvent == undefined)
      return;
    let searchFilter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.ybService.getSelectionIcd9List(searchFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, selectionControl, this.icd9Selection);
          this.icd9Selection[selectionControl]['dataCount'] = response.totalCount;
          this.icd9Selection[selectionControl]['pageCount'] = response.totalPages;
        }
      });
  }

  private patchIcd9Data(selectionIcd9: string, value: any) {
    this.buildItemDynamicSelectionValueList([value], selectionIcd9, this.icd9Selection)
    this.icd9Selection[selectionIcd9].value = value;
  }

  selectionValueDeleted(allSelectionData: any, selectionControl: string, inputControl: string, relatedControl: any) {
    allSelectionData[selectionControl]['dataCount'] = 0;
    allSelectionData[selectionControl]['pageCount'] = 0;
    allSelectionData[selectionControl].value = undefined;
    this.formData[inputControl].value = undefined;
    this.formData[relatedControl].value = undefined;
    allSelectionData[selectionControl]['list'] = undefined;
    this.markFormDirty();
  }
}

import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {BasicService} from "../../../../service/basic.service";
import {UEditorComponent} from "ngx-ueditor";
import {DatePipe} from "@angular/common";
import {PatientService} from "../../../../service/patient.service";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {MedicalRecordMainComponent} from "../medical-record-main/medical-record-main.component";
import {PrescriptionService} from "../../../../service/prescription.service";
import {PrintService} from "../../../../service/print.service";
// import pdfMake from "../../../../../../node_modules/pdfmake/build/pdfmake"
// import pdfFonts from  "../../../../../../node_modules/pdfmake/build/vfs_fonts"
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css'],
})
export class MedicalRecordComponent implements OnInit, OnDestroy {
  @Input() patientSignIn: any;
  collapsed: any;
  medicalRecordTypeList: any;
  initialContent: any = "";
  @ViewChild(UEditorComponent, {static: false}) uEditorComponent: UEditorComponent;
  @ViewChild(MedicalRecordMainComponent, {static: true}) mainRecordComponent: MedicalRecordMainComponent;
  selectedMedicalRecordType: any;
  txtDocumentName: any;
  selectedDocument: any;
  inEdit: any = false;
  documentType: any;
  templateSelectionModalVisible: any = false;
  isBusy: any = false;
  modalTemplateList: any;
  selectedTemplateId: any;
  fixedFormatMedicalRecord: any;
  isSiderBusy: any = false;
  confirmModal?: NzModalRef;
  private lastModifiedTime: Date;
  private timer: any;
  editorInitialized: any = false;
  prescriptionLoading: any = false;
  tablePageSize: any = 15;
  orderDesc: any = true;
  lastSavedTime: any = new Date();
  lastTwoKeyEntry;
  addingTag: any = false;
  tagList: any = [];
  oneOff: any = false;

  showLastSignInRecordList = false;
  lastSignInRecordList: any = undefined;

  constructor(public basicService: BasicService,
              public datePipe: DatePipe,
              private patientSignInService: PatientService,
              private message: NzMessageService,
              public sessionService: SessionService,
              private modal: NzModalService,
              private prescriptionService: PrescriptionService,
              public printService: PrintService
  ) {
  }

  ngOnInit() {

    this.loadPatientPrescription();
    this.loadMedicalRecordType();

    this.timer = setInterval(() => {
      if (this.inEdit) {
        if (this.lastModifiedTime)
          this.saveDocumentClicked(false, true); //????????????????????????
        else { //?????????
          let durationFromLastSave = Date.now().valueOf() - this.lastSavedTime.valueOf();
          if (durationFromLastSave > 600000) //??????15???????????????????????????????????????
            this.saveDocumentClicked(true);
        }
      }
    }, 300000) //??????????????????
  }


  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  //?????????
  private loadTemplateList(medicalRecordType: any) {
    this.isBusy = true;
    this.basicService.getMedicalRecordTemplateList({
      enabled: true,
      typeId: medicalRecordType.uuid,
      employee: this.sessionService.loginUser
    })
      .subscribe(response => {
          if (response) {
            medicalRecordType.templateNameList = response.content;
            this.modalTemplateList = response.content;
          }
          this.isBusy = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        });
  }

  medicalRecordTypeExpandChanged(medicalRecordType: any) {
    let typeChanged = this.selectedMedicalRecordType == medicalRecordType
    this.selectedMedicalRecordType = medicalRecordType;
    if (typeChanged) {
      this.selectedDocument = undefined;
      this.txtDocumentName = undefined;
    }

    for (let otherMedicalRecordType of this.medicalRecordTypeList) {
      if (medicalRecordType.uuid != otherMedicalRecordType.uuid)
        otherMedicalRecordType.expand = false;
      else {
        if (medicalRecordType.expand) {
          this.loadMedicalRecordList(medicalRecordType);
        }
      }
    }

    //???????????????????????????????????????
    if (this.uEditorComponent)
      this.setEditorEnableStatus(medicalRecordType, typeChanged);
  }

  private setEditorEnableStatus(medicalRecordType: any, selectedMedicalRecordTypeChanged) {
    if (selectedMedicalRecordTypeChanged)
      this.resetEditor("", false);

  }

  private loadMedicalRecordList(medicalRecordType: any) {
    return this.patientSignInService.loadMedicalRecordList(this.patientSignIn.uuid, medicalRecordType.uuid)
      .toPromise()
      .then(response => {
        if (response) {
          //console.log('??????????????????');
          medicalRecordType["medicalRecordList"] = response.content;
          return response;
        }
      });
  }


  showTemplateSelection(medicalRecordType: any) {
    this.templateSelectionModalVisible = true;
    this.loadTemplateList(medicalRecordType);
  }

  // editMedicalRecordTemplate(medicalRecordTemplate: any) {
  //   this.documentType = 'template';
  //   this.selectedDocument = medicalRecordTemplate;
  //   this.loadTemplateDetail(medicalRecordTemplate.uuid, medicalRecordTemplate.name);
  // }

  newRecordFromTemplate(medicalRecordTemplate: any) {
    this.loadTemplateDetail(medicalRecordTemplate.uuid, this.getWrappedDefaultName(medicalRecordTemplate.name));
  }

  newEmptyMedicalRecord() {
    this.templateSelectionModalVisible = false;
    this.selectedTemplateId = undefined;
    this.resetEditor('', true, this.getWrappedDefaultName(this.selectedMedicalRecordType.name));
  }

  private getWrappedDefaultName(defaultName: any) {
    this.documentType = 'medicalRecord';
    this.selectedDocument = {};
    return this.sessionService.loginUser.name + ' ' + defaultName;
  }

  private loadTemplateDetail(templateId: any, defaultDocumentName: any) {
    let apiObservable: any;
    if (this.documentType == 'template')
      apiObservable = this.basicService.getMedicalRecordTemplate(templateId);
    else if (this.documentType == 'medicalRecord')
      apiObservable = this.patientSignInService.newMedicalRecordFromTemplate({
        templateId: templateId,
        patientSignInId: this.patientSignIn.uuid,
        doctorId: this.sessionService.loginUser.uuid
      });

    if (apiObservable) {
      this.isBusy = true;
      apiObservable.subscribe(response => {
          this.isBusy = false;
          if (response) {
            this.selectedTemplateId = templateId;
            let content = response.content.template;
            if (this.documentType == 'template')
              this.selectedDocument = response.content;
            this.templateSelectionModalVisible = false;
            //console.log(content);
            this.resetEditor(content, true, defaultDocumentName);
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        });
    }


  }

  cancelTemplateSelection() {
    this.templateSelectionModalVisible = false;
  }


  medicalRecordClicked(medicalRecord: any, medicalRecordType: any) {
    if (this.inEdit)
      return;
    this.selectedMedicalRecordType = medicalRecordType;

    if (medicalRecordType.fixedFormat) {
      for (let recordType of this.medicalRecordTypeList) {
        if (recordType.expand)
          recordType.expand = false;
      }
      return;
    }

    this.documentType = 'medicalRecord';
    this.isBusy = true;
    this.patientSignInService.loadMedicalRecord(medicalRecord.uuid)
      .subscribe(response => {
          this.isBusy = false;
          if (response) {
            this.selectedDocument = response.content;
            this.resetEditor(this.selectedDocument.content, false, this.selectedDocument.name);

          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        });
  }

  deleteMedicalRecord(medicalRecordId: any, medicalRecordType: any) {
    this.patientSignInService.deleteMedicalRecord(medicalRecordId)
      .subscribe(response => {
        this.message.create("success", "????????????");
        this.updatePatientMedicalRecordCount(medicalRecordType);
        this.loadMedicalRecordList(medicalRecordType);
        if (this.selectedDocument && this.selectedDocument.uuid == medicalRecordId)
          this.resetEditor("", false);
      });
  }

  //???????????????

  private updatePatientMedicalRecordCount(medicalRecordType: any) {
    this.patientSignInService.updatePatientMedicalRecordCount(medicalRecordType.uuid, this.patientSignIn.uuid)
      .subscribe(response => {
        medicalRecordType.recordCount = response;
      });
  }

  //???????????????
  saveDocumentClicked(autoSave: any = false, silenceSave: any = false) {
    if (!this.txtDocumentName || this.txtDocumentName == '') {
      this.message.create('error', '??????????????????');
      return;
    }
    if (this.documentType == 'medicalRecord')
      this.saveMedicalRecord(autoSave, silenceSave);
    else if (this.documentType == 'template')
      this.updateTemplate();
    else
      return;
  }

  saveMedicalRecord(autoSave: any = false, silenceSave = false) {
    let data = {
      uuid: this.selectedDocument ? this.selectedDocument.uuid : undefined,
      name: this.txtDocumentName,
      typeId: this.selectedMedicalRecordType.uuid,
      content: this.uEditorComponent.Instance.getContent(),
      patientSignInId: this.patientSignIn.uuid,
      templateId: this.selectedDocument.uuid ? this.selectedDocument.templateId : this.selectedTemplateId,
      silenceSave: silenceSave,
    };
    if (data.uuid)
      data["tagList"] = this.tagList;

    if (data.uuid) //????????????????????????????????????????????????????????????????????????
    {
      this.patientSignInService.getLockedInfo(data.uuid)
        .subscribe(response => {
          if (response.content.lockedTime == this.selectedDocument.inEditWhen)
            this.doSaveMedicalRecord(data, autoSave, silenceSave);
          else {
            this.medicalRecordChangedByOthers(response.content);
          }
        });
    } else
      this.doSaveMedicalRecord(data, autoSave, silenceSave);
  }

  private medicalRecordChangedByOthers(changedInfo: any) {
    this.confirmModal = this.modal.confirm({
      nzTitle: '???????????????',
      nzContent: '????????????????????????<br />'
        + '???????????????' + this.selectedDocument["inEditWhen"] + '<br />'
        + '????????????' + this.selectedDocument["inEditBy"] + '<br />' +
        '?????????????????????????????????????????????????????????????????????',
      nzCancelDisabled: true,
      nzOnOk: () => {
        this.inEdit = false;
        this.lastModifiedTime = undefined;
      }
    });
  }

  private doSaveMedicalRecord(data: any, autoSave: any = false, silenceSave = false) {
    this.isBusy = true;
    this.patientSignInService.saveMedicalRecord(data)
      .subscribe(response => {
          if (response) {

            this.selectedDocument.uuid = response.content;
            this.selectedDocument["name"] = this.txtDocumentName;
            this.lastModifiedTime = undefined;
            this.lastSavedTime = new Date();
            if (silenceSave)
              this.message.success("???????????????????????????" + this.datePipe.transform(Date.now(), 'MM-dd HH:mm'));
            else {
              this.selectedDocument["inEdit"] = false;
              this.uEditorComponent.Instance.setDisabled();
              //this.inEdit = false;
              this.loadMedicalRecordList(this.selectedMedicalRecordType);
              this.resetEditor(data.content, false, this.txtDocumentName);
              this.updatePatientMedicalRecordCount(this.selectedMedicalRecordType);
              if (autoSave)
                this.popAutoSavedDialog();
              else
                this.message.create("success", "??????????????????");
              if (!data.uuid) //?????????
                this.startEdit()
              else
                this.collapsed = false;
            }
          }
          this.isBusy = false;
        },
        error => {
          this.message.create("error", '??????????????????????????????');
          this.isBusy = false;
        }
      );
  }

  private popAutoSavedDialog() {
    this.confirmModal = this.modal.confirm({
      nzTitle: '????????????',
      nzContent: '15???????????????????????????????????????<br />',
      nzCancelDisabled: true,
      nzOnOk: () => {
      }
    });
  }

  updateTemplate() {
    let data = {
      uuid: this.selectedDocument.uuid,
      enabled: this.selectedDocument.enabled,
      typeId: this.selectedDocument.recordType.uuid,
      ownedByDoctorId: this.selectedDocument.ownedByDoctorId,
      permissionType: this.selectedDocument.permissionType,
      permittedDepartmentIdList: this.selectedDocument.permittedDepartmentIdList,
      name: this.txtDocumentName,
      template: this.uEditorComponent.Instance.getContent(),
    };

    this.isBusy = true;
    this.basicService.saveTemplate(data)
      .subscribe(response => {
          if (response) {
            this.message.create("success", "??????????????????");
            this.selectedDocument.uuid = response.content;
            this.resetEditor(data.template, false, this.txtDocumentName);
          }
          this.isBusy = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        }
      );

  }


  cancelEditClicked() {
    this.confirmModal = this.modal.confirm({
      nzTitle: '????????????',
      nzContent: '?????????????????????????????????????????????????????????',
      nzOnOk: () => {
        this.resetEditor(this.initialContent, false);
        if (this.documentType == 'medicalRecord' && this.selectedDocument.uuid) {
          this.unlockMedicalRecord(true);
        }
      }
    });

  }

  //?????????????????????


  //??????????????????


  onReady($event: UEditorComponent) {
    console.log('????????????????????????');

    if (!this.editorInitialized) {
      this.uEditorComponent.Instance.setDisabled();

      if (this.selectedMedicalRecordType)
        this.setEditorEnableStatus(this.selectedMedicalRecordType, false);
      this.uEditorComponent.Instance.addListener('contentChange', (editor) => {
        this.lastModifiedTime = new Date();
      });

      this.editorInitialized = true
    }
  }


  private resetEditor(content, inEdit, documentName = "") {
    this.uEditorComponent.Instance.reset();
    this.initialContent = content;
    this.uEditorComponent.Instance.setContent(content, false);
    this.txtDocumentName = documentName;
    this.inEdit = inEdit;
  }


  //????????????????????????
  prescriptionList: any;
  filterDescription: any;

  onMainMedicalRecordInEditChanged(inEdit: any) {
    this.inEdit = inEdit;
  }


  executeEditorCommand(command: string) {
    if (this.uEditorComponent && this.uEditorComponent.Instance)
      this.uEditorComponent.Instance.execCommand(command);
  }

  getConfig() {
    let defaultConfig = this.basicService.ueditor_config;
    return defaultConfig;
  }

  hasEditTemplatePermission(medicalRecordType: any) {
    if (this.sessionService.getUserPermission().fullTemplatePermission)
      return true;
    else if (medicalRecordType && medicalRecordType.permittedRoleIdList.includes(this.sessionService.loginUser.userRole.uuid) > 0)
      return true;
    else
      return false;
  }

  private lockMedicalRecord() {
    let lockPram = {};
    lockPram["medicalRecordId"] = this.selectedDocument.uuid;
    lockPram["lockedBy"] = this.sessionService.loginUser.name;
    this.patientSignInService.lockMedicalRecord(lockPram)
      .subscribe(response => {
          this.selectedDocument["inEdit"] = true;
          this.selectedDocument["inEditBy"] = this.sessionService.loginUser.name;
          this.selectedDocument["inEditWhen"] = response.content.inEditWhen;
          this.txtDocumentName = this.selectedDocument.name
          this.uEditorComponent.Instance.setEnabled();
          this.lastModifiedTime = undefined;
          this.inEdit = true;
          this.lastSavedTime = new Date();
          this.collapsed = true;
          this.loadTagList(this.selectedDocument.uuid);
        }
      );
  }

  private loadTagList(uuid: any) {
    this.patientSignInService.loadMedicalRecordTagList(this.selectedDocument.uuid).toPromise()
      .then(response => {
        this.tagList = response.content;
      });
  }

  private unlockMedicalRecord(changeEditorDiable = false) {
    return this.patientSignInService.unlockMedicalRecord(this.selectedDocument.uuid).toPromise()
      .then(response => {
          this.selectedDocument["inEdit"] = false;
          this.lastModifiedTime = undefined;
          this.collapsed = false;
          if (changeEditorDiable)
            this.uEditorComponent.Instance.setDisabled();
          //this.inEdit = false
        },
        error => {
          this.message.error(error.error.message);
          this.uEditorComponent.Instance.setDisabled();
          //this.inEdit = false
        });
  }


  startEdit() {
    if (this.selectedDocument.inEdit == false) {
      this.lockMedicalRecord();
    } else {
      this.popUnlockDialog();
    }
  }

  private popUnlockDialog() {
    this.confirmModal = this.modal.confirm({
      nzTitle: '???????????????',
      nzContent: '????????????????????????<br />'
        + '???????????????' + this.selectedDocument["inEditWhen"] + '<br />'
        + '????????????' + this.selectedDocument["inEditBy"] + '<br />' +
        '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????<br />??????????????????????????????',
      nzOnOk: () => {
        this.unlockMedicalRecord().then(response => {
          this.lockMedicalRecord();
        });
      }
    });
  }


  loadPatientPrescription() {

    let filter = {
      prescriptionStatusList: ['?????????', '?????????', '?????????'],
      oneOff: this.oneOff,
      patientSignInIdList: [this.patientSignIn.uuid],
      description: this.filterDescription,
      orderByDesc: this.orderDesc
    }

    this.prescriptionLoading = true;
    this.prescriptionService.getPatientPrescriptionDescriptionList(filter)
      .subscribe(response => {
          if (response) {
            this.prescriptionList = response.content;
          }
          this.prescriptionLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.prescriptionLoading = false;
        }
      );
  }

  insertPrescription(data: any) {
    if (this.inEdit)
      this.uEditorComponent.Instance.execCommand('inserthtml', data.description);
  }

  newTimeTag() {
    if (this.inEdit) {
      let newTag = {};
      //newTag["medicalRecordId"] = this.selectedDocument.uuid;
      let tagTime = Date.now();
      let fullTime = this.datePipe.transform(tagTime, 'yyyy-MM-dd HH:mm:ss');
      let formattedTime = this.datePipe.transform(tagTime, 'yyyy-MM-dd HH:mm');
      newTag["tagTime"] = fullTime;
      this.tagList = [...this.tagList, newTag].sort((a, b) => (a.tagTime > b.tagTime ? -1 : 1))
      //let htmlToInsert = "<p class ='timeStamp'>formattedTime</p>"
      this.uEditorComponent.Instance.execCommand('inserthtml', formattedTime);


      // this.addingTag = true;
      // this.patientSignInService.addNewMedicalRecordTag(newTag)
      //   .subscribe(response => {
      //       if (response) {
      //         this.tagList = response.content;
      //
      //       }
      //       this.addingTag = false;
      //     },
      //     error => {
      //       this.message.create("error", "?????????????????????");
      //       this.addingTag = false;
      //     }
      //   );
    }
  }


  deleteTag(data: any) {
    this.tagList = this.tagList.filter(t => t !== data);
  }

  printClicked() {
    // let fullHtml = this.uEditorComponent.Instance.getContent();
    //
    // let docDefinition = {
    //   header: 'C#Corner PDF Header',
    //   content: fullHtml
    // };
    //
    // pdfMake.createPdf(docDefinition).open();
    // return;

    //console.log(this.uEditorComponent.Instance.getContent());
    let fullHtml = this.uEditorComponent.Instance.getContent();
    let indexOfHeaderStart = fullHtml.indexOf('<header>');
    let indexOfHeaderEnd = fullHtml.indexOf('</header>');
    let headerHtml = '<div></div>';

    if (indexOfHeaderStart >= 0 && indexOfHeaderEnd >= 0) {
      headerHtml = fullHtml.substr(indexOfHeaderStart, indexOfHeaderEnd - indexOfHeaderStart + 9);
      fullHtml = fullHtml.replace(headerHtml, '');
    }

    this.printService.onPrintClicked.emit({
      name: 'medicalRecordList',
      data: {
        htmlHeaderString: headerHtml,
        htmlString: fullHtml,
      }
    });
  }

  copyLastSignInMedicalRecord() {
    // this.modal.confirm({
    //   nzContent: '????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
    //   nzOnOk: () => {
    //
    //   }
    // });
    this.isBusy = true;
    this.patientSignInService.getLastSignInMedicalRecordList(this.patientSignIn.uuid)
      .subscribe(response => {
          // this.message.create("success", '?????????????????????');
          // this.loadMedicalRecordType();
          this.showLastSignInRecordList = true;
          this.lastSignInRecordList = response.content;
          this.mapOfCheckedId = {};
          this.isBusy = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        }
      );
  }

  private loadMedicalRecordType() {
    this.isSiderBusy = true;
    this.patientSignInService.getMedicalRecordType(this.patientSignIn.uuid, {})
      .subscribe(response => {
          this.isSiderBusy = false;
          if (response) {
            this.medicalRecordTypeList = response.content;
            let fixedType = this.medicalRecordTypeList.find(t => t.fixedFormat);
            if (fixedType) {
              fixedType.expand = true;
              this.selectedMedicalRecordType = fixedType;
              this.loadMedicalRecordList(fixedType).then(response => {
                this.fixedFormatMedicalRecord = response.content[0];
              });
            }
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isSiderBusy = false;
        });
  }

  cancelClone() {
    this.lastSignInRecordList = undefined;
    this.showLastSignInRecordList = false;
    this.mapOfCheckedId = {};
  }


  mapOfCheckedId: { [key: string]: boolean } = {};

  cloneClicked() {
    let selectedMedicalRecordList = this.lastSignInRecordList.filter(record => this.mapOfCheckedId[record.uuid]).map(r => r.uuid);
    if (selectedMedicalRecordList.length == 0) {
      this.message.create("warning", `?????????????????????`);
      return undefined;
    }

    this.isBusy = true;
    this.patientSignInService.cloneLastSignInMedicalRecord(this.patientSignIn.uuid, selectedMedicalRecordList)
      .subscribe(response => {
          this.message.create("success", '??????????????????');
          this.cancelClone();
          this.loadMedicalRecordType();
          this.isBusy = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        }
      );
  }
}

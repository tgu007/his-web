import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {BasicService} from "../../../../service/basic.service";
import * as globals from "../../../../../globals";
import {YbTzService} from "../../../../service/yb-tz.service";
import {PatientSignInDiseaseComponent} from "../../group-patient-sign-in/patient-sign-in-disease/patient-sign-in-disease.component";
import {DrgRecordOperationComponent} from "../drg-record-operation/drg-record-operation.component";
import {SessionService} from "../../../../service/session.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {error} from "util";

@Component({
  selector: 'app-drg-record',
  templateUrl: './drg-record.component.html',
  styleUrls: ['./drg-record.component.css']
})
export class DrgRecordComponent implements OnInit {
  @Input() patientSignIn: any;
  initPram: any;
  @ViewChild(DrgRecordOperationComponent, {static: true}) drgRecordOperationComponent: DrgRecordOperationComponent;

  drgRecordForm: any;
  diseaseSelection: any = {
    selectSignInDiagnose: {},
    selectSignOutDiagnose: {},
    selectSignOutDiagnose1: {},
    selectSignOutDiagnose2: {},
    selectSignOutDiagnose3: {},
    selectSignOutDiagnose4: {},
    selectSignOutDiagnose5: {},
    selectSignOutDiagnose6: {},
    selectSignOutDiagnose7: {},
    selectSignOutDiagnose8: {},
    selectSignOutDiagnose9: {},
    selectSignOutDiagnose10: {},
    selectSignOutDiagnose11: {},
    selectSignOutDiagnose12: {},
    selectSignOutDiagnose13: {},
    selectSignOutDiagnose14: {},
    selectSignOutDiagnose15: {},
    selectSignOutDiagnose16: {},
  };
  selectionWidth: any = '400px';
  selectionTablePageSize = globals.selectionPageSize;
  isSaving: any = false;
  drgRecord: any = {};


  constructor(private fb: FormBuilder,
              public basicService: BasicService,
              public ybService: YbTzService,
              public sessionService: SessionService,
              private message: NzMessageService,
              private datePipe: DatePipe,
  ) {
    this.drgRecordForm = this.fb.group({
      txtName: [undefined, Validators.required],
      numberHeight: [undefined, null],
      numberWeight: [undefined, null],
      numberBirth: [undefined, null],
      numberPregnant: [undefined, null],
      selectMarriage: [undefined, Validators.required],
      dateNewBornBirthday: [undefined, null],
      newBornWeight: [undefined, null],
      newBornOutWeight: [undefined, null],
      signInDate: [undefined, Validators.required],
      signOutDate: [undefined, Validators.required],
      txtBedNumber: [undefined, Validators.required],
      selectDoctor: [undefined, Validators.required],
      txtBinli: [undefined, null],
      selectAllergyMedicine: [undefined, null],
      selectBloodType: [undefined, null],
      selectBloodTypeRh: [undefined, null],
      txtInfection: [undefined, null],
      selectSignOutMethod: [undefined, null],
      selectSpecialDisease: [undefined, null],
      selectSignInDiagnose: [undefined, Validators.required],
      selectDiseaseInDirection: [undefined, null],
      txtDiagnoseIn: [undefined, Validators.required],
      selectSignOutDiagnose: [undefined, Validators.required],
      selectDiseaseOutDirection: [undefined, null],
      txtDiagnoseOut: [undefined, Validators.required],
      selectSignOutDiagnose1: [undefined, null],
      txtDiagnoseOut1: [undefined, null],
      selectSignOutDiagnose2: [undefined, null],
      txtDiagnoseOut2: [undefined, null],
      selectSignOutDiagnose3: [undefined, null],
      txtDiagnoseOut3: [undefined, null],
      selectSignOutDiagnose4: [undefined, null],
      txtDiagnoseOut4: [undefined, null],
      selectSignOutDiagnose5: [undefined, null],
      txtDiagnoseOut5: [undefined, null],
      selectSignOutDiagnose6: [undefined, null],
      txtDiagnoseOut6: [undefined, null],
      selectSignOutDiagnose7: [undefined, null],
      txtDiagnoseOut7: [undefined, null],
      selectSignOutDiagnose8: [undefined, null],
      txtDiagnoseOut8: [undefined, null],
      selectSignOutDiagnose9: [undefined, null],
      txtDiagnoseOut9: [undefined, null],
      selectSignOutDiagnose10: [undefined, null],
      txtDiagnoseOut10: [undefined, null],
      selectSignOutDiagnose11: [undefined, null],
      txtDiagnoseOut11: [undefined, null],
      selectSignOutDiagnose12: [undefined, null],
      txtDiagnoseOut12: [undefined, null],
      selectSignOutDiagnose13: [undefined, null],
      txtDiagnoseOut13: [undefined, null],
      selectSignOutDiagnose14: [undefined, null],
      txtDiagnoseOut14: [undefined, null],
      selectSignOutDiagnose15: [undefined, null],
      txtDiagnoseOut15: [undefined, null],
      selectSignOutDiagnose16: [undefined, null],
      txtDiagnoseOut16: [undefined, null],
      txtExamNumber: [undefined, null],
      selectExamDepartment: [undefined, null],
      txtExamCode: [undefined, null],
      selectCheckByDoctor: [undefined, null],
      dateExamApplyDate: [undefined, null],
      dateExamReportDate: [undefined, null],
      selectExamBodyPart: [undefined, null],
      selectExamException: [undefined, null],
      txtExamResult: [undefined, null],
      txtMedicalRecordMain: [undefined, Validators.required],
      txtMedicalRecordXBS: [undefined, Validators.required],
      txtMedicalRecordOperation: [undefined, null],
      txtMedicalRecordShuXue: [undefined, null],
      txtMedicalCheckIn: [undefined, undefined],
      txtMedicalRecordTreatment: [undefined, undefined],
      txtMedicalRecordCheckOutCondition: [undefined, undefined],
      selectCheckOutReason: [undefined, undefined],
      txtMedicalRecordOutPrescription: [undefined, undefined],
      operationList: this.fb.array([])
    });
  }

  ngOnInit() {
    this.ybService.getDrgRecordInitPram().subscribe(response => {
      this.initPram = response.content;
      this.drgRecordOperationComponent.operatorList = this.initPram.operatorList;
      this.drgRecordOperationComponent.operationLevelList = this.initPram.operationLevelList;
      if (this.patientSignIn.drgRecordId) {
        this.loadDrgRecord(this.patientSignIn.drgRecordId);
      } else {
        this.setInitValue()
        this.loadMedicalRecordInfo();
      }
    })
  }

  private loadMedicalRecordInfo() {
    this.ybService.loadMedicalRecordInfo(this.patientSignIn.uuid).subscribe(response => {
      this.drgRecordForm.patchValue({
        txtMedicalRecordMain: response.content.mainInfo,
        txtMedicalRecordXBS: response.content.currentCondition,
        txtMedicalRecordOperation: response.content.operationHistory,
        txtMedicalRecordShuXue: response.content.bloodTakenHistory,
        // txtMedicalCheckIn: response.content.signInCondition,
        // txtMedicalRecordTreatment: response.content.treatmentProcess,
        // txtMedicalRecordCheckOutCondition: response.content.singOutCondition,
        // txtMedicalRecordOutPrescription: response.content.signOutPrescription,
      });

      console.log(response.content);
      let diagnoseList = response.content.diagnoseList;
      for (let diagnose of diagnoseList) {
        let index = diagnoseList.indexOf(diagnose) + 1;
        let selectControlName = "selectSignOutDiagnose" + index;
        let txtControlName = "txtDiagnoseOut" + index;
        this.buildItemDynamicSelectionValueList([diagnose], selectControlName, this.diseaseSelection);
        this.drgRecordForm.controls[selectControlName].patchValue(diagnose);
        this.drgRecordForm.controls[txtControlName].patchValue(diagnose.code);
      }

      this.drgRecordOperationComponent.patchOperationListValue(response.content.operationList);
    })
  }

  private setInitValue() {
    let defaultDoctorId = undefined;
    let currentUserId = this.sessionService.loginUser.uuid;
    if (this.initPram.doctorList.map(e => e.uuid).includes(currentUserId))
      defaultDoctorId = currentUserId;

    let signInDiagnose = this.patientSignIn.diagnoseList[0];
    if (signInDiagnose)
      this.buildItemDynamicSelectionValueList([signInDiagnose], "selectSignInDiagnose", this.diseaseSelection);

    let signOutDiagnose = undefined;
    if (this.patientSignIn.signOutReq) {
      signOutDiagnose = this.patientSignIn.signOutReq.diagnoseList[0];
      this.buildItemDynamicSelectionValueList([signOutDiagnose], "selectSignOutDiagnose", this.diseaseSelection);

      //
      // let diagnoseList = this.patientSignIn.signOutReq.diagnoseList
      // if (signOutDiagnose)
      //   diagnoseList.splice(0, 1)
      //
      // for (let extraSignOutDiagnose of diagnoseList) {
      //   let index = diagnoseList.indexOf(extraSignOutDiagnose) + 1;
      //   let selectControlName = "selectSignOutDiagnose" + index;
      //   let txtControlName = "txtDiagnoseOut" + index;
      //   this.buildItemDynamicSelectionValueList([extraSignOutDiagnose], selectControlName, this.diseaseSelection);
      //   this.drgRecordForm.controls[selectControlName].patchValue(extraSignOutDiagnose);
      //   this.drgRecordForm.controls[txtControlName].patchValue(extraSignOutDiagnose.code);
      // }
    }

    this.drgRecordForm.patchValue({
      selectSignOutMethod: this.initPram.signOutMethodList.find(t => t.defaultSelection === true).uuid,
      selectSpecialDisease: this.initPram.specialDiseaseList.find(t => t.defaultSelection === true).uuid,
      selectCheckOutReason: this.initPram.signOutReasonList.find(t => t.defaultSelection === true).uuid,
      selectBloodType: this.initPram.bloodTypeList.find(t => t.defaultSelection === true).uuid,
      selectBloodTypeRh: this.initPram.bloodTypeRhList.find(t => t.defaultSelection === true).uuid,
      selectDoctor: defaultDoctorId,
      selectMarriage: this.initPram.marriageStatusList.find(t => t.defaultSelection === true).id,
      txtName: this.patientSignIn.patient.name,
      signInDate: this.patientSignIn.signInDateTime,
      signOutDate: this.patientSignIn.signOutDate,
      txtBedNumber: this.patientSignIn.currentBedInfo,
      txtDiagnoseIn: signInDiagnose ? signInDiagnose.code : undefined,
      txtDiagnoseOut: signOutDiagnose ? signOutDiagnose.code : undefined,
      selectSignInDiagnose: signInDiagnose,
      selectSignOutDiagnose: signOutDiagnose,
    });
  }

  selectionChanged(changedControl: string, relatedControl: string) {
    this.drgRecordForm.controls[relatedControl].patchValue(this.drgRecordForm.value[changedControl]['code']);
  }

  searchDisease(dynamicSelectEvent: any, selectionControl: any) {
    if (dynamicSelectEvent == undefined)
      return;
    let searchFilter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.basicService.getSelectionDiseaseList(searchFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, selectionControl, this.diseaseSelection);
          this.diseaseSelection[selectionControl]['dataCount'] = response.totalCount;
          this.diseaseSelection[selectionControl]['pageCount'] = response.totalPages;
        }
      });
  }

  buildItemDynamicSelectionValueList(selectEntityDropdownData: any, selectionControl: any, allSelectionData) {
    for (let data of selectEntityDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.code);
      dynamicItemValueList.push(data.name);
      data["label"] = dynamicItemValueList[1];
      data["valueList"] = dynamicItemValueList;
    }
    allSelectionData[selectionControl]['list'] = selectEntityDropdownData;
  }


  saveDrgRecord() {
    if (!this.drgRecordForm.valid) {
      FormValidator.validateFormInput(this.drgRecordForm);
      this.message.create("error", "数据验证失败，有未填的必选项");
      return;
    }

    let data = this.getData();
    this.isSaving = true;
    this.ybService.saveDrgRecord(data).subscribe(response => {
        this.isSaving = false;
        if (response) {
          this.patientSignIn.drgRecordId = response.content;
          this.drgRecord["uuid"] = response.content;
          this.message.success("保存成功");
        }
      },
      error => {
        this.message.error(error.error.message);
        this.isSaving = false;
      }
    );
  }

  private getData() {
    let operationList: any[] = this.drgRecordOperationComponent.getData();
    let formValue = this.drgRecordForm.value;
    let data = {
      uuid: this.patientSignIn.drgRecordId,
      patientSignInId: this.patientSignIn.uuid,
      patientName: formValue.txtName,
      height: formValue.numberHeight,
      weight: formValue.numberWeight,
      numberOfPregnant: formValue.numberPregnant,
      numberOfBirth: formValue.numberBirth,
      marriageStatusId: formValue.selectMarriage,
      newBornBirthDay: this.datePipe.transform(formValue.dateNewBornBirthday, 'yyyy-MM-dd HH:mm:ss'),
      newBornWeight: formValue.newBornWeight,
      newBornOutWeight: formValue.newBornOutWeight,
      signInDate: this.datePipe.transform(formValue.signInDate, 'yyyy-MM-dd HH:mm:ss'),
      signOutDate: this.datePipe.transform(formValue.signOutDate, 'yyyy-MM-dd HH:mm:ss'),
      bedNumber: formValue.txtBedNumber,
      doctorId: formValue.selectDoctor,
      binli: formValue.txtBinli,
      allergyMedicineId: formValue.selectAllergyMedicine,
      bloodTypeId: formValue.selectBloodType,
      bloodRhTypeId: formValue.selectBloodTypeRh,
      infection: formValue.txtInfection,
      signOutMethodId: formValue.selectSignOutMethod,
      specialDiseaseId: formValue.selectSpecialDisease,
      signInDiagnoseId: formValue.selectSignInDiagnose.uuid,
      diseaseInDirectionId: formValue.selectDiseaseInDirection,
      diagnoseInCode: formValue.txtDiagnoseIn,
      signOutDiagnoseId: formValue.selectSignOutDiagnose.uuid,
      diseaseOutDirectionId: formValue.selectDiseaseOutDirection,
      diagnoseOutCode: formValue.txtDiagnoseOut,
      signOutDiagnoseId1: formValue.selectSignOutDiagnose1 ? formValue.selectSignOutDiagnose1.uuid : undefined,
      diagnoseOutCode1: formValue.txtDiagnoseOut1,
      signOutDiagnoseId2: formValue.selectSignOutDiagnose2 ? formValue.selectSignOutDiagnose2.uuid : undefined,
      diagnoseOutCode2: formValue.txtDiagnoseOut2,
      signOutDiagnoseId3: formValue.selectSignOutDiagnose3 ? formValue.selectSignOutDiagnose3.uuid : undefined,
      diagnoseOutCode3: formValue.txtDiagnoseOut3,
      signOutDiagnoseId4: formValue.selectSignOutDiagnose4 ? formValue.selectSignOutDiagnose4.uuid : undefined,
      diagnoseOutCode4: formValue.txtDiagnoseOut4,
      signOutDiagnoseId5: formValue.selectSignOutDiagnose5 ? formValue.selectSignOutDiagnose5.uuid : undefined,
      diagnoseOutCode5: formValue.txtDiagnoseOut5,
      signOutDiagnoseId6: formValue.selectSignOutDiagnose6 ? formValue.selectSignOutDiagnose6.uuid : undefined,
      diagnoseOutCode6: formValue.txtDiagnoseOut6,
      signOutDiagnoseId7: formValue.selectSignOutDiagnose7 ? formValue.selectSignOutDiagnose7.uuid : undefined,
      diagnoseOutCode7: formValue.txtDiagnoseOut7,
      signOutDiagnoseId8: formValue.selectSignOutDiagnose8 ? formValue.selectSignOutDiagnose8.uuid : undefined,
      diagnoseOutCode8: formValue.txtDiagnoseOut8,
      signOutDiagnoseId9: formValue.selectSignOutDiagnose9 ? formValue.selectSignOutDiagnose9.uuid : undefined,
      diagnoseOutCode9: formValue.txtDiagnoseOut9,
      signOutDiagnoseId10: formValue.selectSignOutDiagnose10 ? formValue.selectSignOutDiagnose10.uuid : undefined,
      diagnoseOutCode10: formValue.txtDiagnoseOut10,
      signOutDiagnoseId11: formValue.selectSignOutDiagnose11 ? formValue.selectSignOutDiagnose11.uuid : undefined,
      diagnoseOutCode11: formValue.txtDiagnoseOut11,
      signOutDiagnoseId12: formValue.selectSignOutDiagnose12 ? formValue.selectSignOutDiagnose12.uuid : undefined,
      diagnoseOutCode12: formValue.txtDiagnoseOut12,
      signOutDiagnoseId13: formValue.selectSignOutDiagnose13 ? formValue.selectSignOutDiagnose13.uuid : undefined,
      diagnoseOutCode13: formValue.txtDiagnoseOut13,
      signOutDiagnoseId14: formValue.selectSignOutDiagnose14 ? formValue.selectSignOutDiagnose14.uuid : undefined,
      diagnoseOutCode14: formValue.txtDiagnoseOut14,
      signOutDiagnoseId15: formValue.selectSignOutDiagnose15 ? formValue.selectSignOutDiagnose15.uuid : undefined,
      diagnoseOutCode15: formValue.txtDiagnoseOut15,
      signOutDiagnoseId16: formValue.selectSignOutDiagnose16 ? formValue.selectSignOutDiagnose16.uuid : undefined,
      diagnoseOutCode16: formValue.txtDiagnoseOut16,
      medicalRecordMain: formValue.txtMedicalRecordMain,
      medicalRecordInCondition: formValue.txtMedicalRecordXBS,
      medicalRecordOperationHistory: formValue.txtMedicalRecordOperation,
      medicalRecordBloodTakenHistory: formValue.txtMedicalRecordShuXue,
      // medicalRecordBSignInCondition: formValue.txtMedicalCheckIn,
      // medicalRecordBTreatmentProcess: formValue.txtMedicalRecordTreatment,
      // medicalRecordBSignOutCondition: formValue.txtMedicalRecordCheckOutCondition,
      // signOutReasonId: formValue.selectCheckOutReason,
      // medicalRecordBSignOutPrescription: formValue.txtMedicalRecordOutPrescription,
      operationList: operationList
    }
    return data;
  }

  private loadDrgRecord(drgRecordId: any) {
    this.isSaving = true;
    this.ybService.loadDrgRecord(drgRecordId).subscribe(response => {
        this.isSaving = false;
        if (response) {
          this.drgRecord = response.content;
          this.patchData(response.content);
        }
      },
      error => {
        this.message.error(error.error.message);
        this.isSaving = false;
      }
    );
  }

  private patchData(drgRecord: any) {
    this.drgRecordForm.patchValue({
      txtName: drgRecord.patientName,
      numberHeight: drgRecord.height,
      numberWeight: drgRecord.weight,
      numberBirth: drgRecord.numberOfBirth,
      numberPregnant: drgRecord.numberOfPregnant,
      selectMarriage: drgRecord.marriageStatus.id,
      dateNewBornBirthday: drgRecord.newBornBirthday,
      newBornWeight: drgRecord.newBornWeight,
      newBornOutWeight: drgRecord.newBornOutWeight,
      signInDate: drgRecord.signInDate,
      signOutDate: drgRecord.signOutDate,
      txtBedNumber: drgRecord.bedNumber,
      selectDoctor: drgRecord.doctor.uuid,
      txtBinli: drgRecord.binli,
      selectAllergyMedicine: drgRecord.allergyMedicine ? drgRecord.allergyMedicine.uuid : undefined,
      selectBloodType: drgRecord.bloodType.uuid,
      selectBloodTypeRh: drgRecord.bloodRhType.uuid,
      txtInfection: drgRecord.infection,
      selectSignOutMethod: drgRecord.signOutMethod.uuid,
      selectSpecialDisease: drgRecord.specialDisease.uuid,
      selectDiseaseInDirection: drgRecord.diseaseInDirection ? drgRecord.diseaseInDirection.uuid : undefined,
      selectDiseaseOutDirection: drgRecord.diseaseOutDirection ? drgRecord.diseaseOutDirection.uuid : undefined,
      txtMedicalRecordMain: drgRecord.medicalRecordMain,
      txtMedicalRecordXBS: drgRecord.medicalRecordInCondition,
      txtMedicalRecordOperation: drgRecord.medicalRecordOperationHistory,
      txtMedicalRecordShuXue: drgRecord.medicalRecordBloodTakenHistory,
      // txtMedicalCheckIn: drgRecord.medicalRecordBSignInCondition,
      // txtMedicalRecordTreatment: drgRecord.medicalRecordBTreatmentProcess,
      // txtMedicalRecordCheckOutCondition: drgRecord.medicalRecordBSignOutCondition,
      // selectCheckOutReason: drgRecord.signOutReason.uuid,
      // txtMedicalRecordOutPrescription: drgRecord.medicalRecordBSignOutPrescription,
    });

    this.patchDiagnoseData(drgRecord['signInDiagnose'], 'selectSignInDiagnose', 'txtDiagnoseIn')
    this.patchDiagnoseData(drgRecord['signOutDiagnose'], 'selectSignOutDiagnose', 'txtDiagnoseOut')

    for (let i = 1; i <= 16; i++) {
      let dataName = 'signOutDiagnose' + i;
      let selectionControlName = 'selectSignOutDiagnose' + i;
      let codeControlName = 'txtDiagnoseOut' + i;
      if (drgRecord[dataName])
        this.patchDiagnoseData(drgRecord[dataName], selectionControlName, codeControlName)
    }


    this.drgRecordOperationComponent.patchOperationListValue(drgRecord.operationList);
  }

  private patchDiagnoseData(data: any, selectionControlName: string, codeControlName: string) {
    let itemArray = [data];
    this.buildItemDynamicSelectionValueList(itemArray, selectionControlName, this.diseaseSelection)
    this.drgRecordForm.controls[selectionControlName].patchValue(data);
    this.drgRecordForm.controls[codeControlName].patchValue(data.code);
  }

  uploadDrgRecord() {
    this.isSaving = true;
    this.ybService.uploadDrgRecord(this.drgRecord.uuid).subscribe(response => {
        this.isSaving = false;
        this.drgRecord = response.content;
        this.message.success("病案上传成功");
      },
      error => {
        this.message.error(error.error.message);
        this.isSaving = false;
      }
    );
  }

  cancelDrgRecord() {
    this.isSaving = true;
    this.ybService.cancelDrgRecord(this.drgRecord.uuid).subscribe(response => {
        this.isSaving = false;
        this.drgRecord = response.content;
        this.message.success("病案作废成功");
      },
      error => {
        this.message.error(error.error.message);
        this.isSaving = false;
      }
    );
  }
}


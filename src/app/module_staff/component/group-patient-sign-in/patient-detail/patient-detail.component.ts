import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PatientService} from "../../../../service/patient.service";
import {AppService} from "../../../../service/app.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import en from '@angular/common/locales/en';
import {formatDate, registerLocaleData} from "@angular/common";
import {OrderDetailTableComponent} from "../../group-inventory/order-detail-table/order-detail-table.component";
import {PatientDetailContactComponent} from "../patient-detail-contact/patient-detail-contact.component";
import {NzMessageService} from "ng-zorro-antd";
import {HttpClient} from "@angular/common/http";
import {YbTzService} from "../../../../service/yb-tz.service";

registerLocaleData(en);

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})

export class PatientDetailComponent implements OnInit {
  formErrors: Object = {};
  patientDetailForm: any;
  genderList: any;
  ethnicList: any;
  marriageStatusList: any;
  occupationList: any;
  idTypeList: any;
  pramInitialized: any = false;
  @Output() newPatientSaved = new EventEmitter<any>();
  patient: any;
  @ViewChild(PatientDetailContactComponent, {static: true}) patientContactTableComponent: PatientDetailContactComponent;
  isSaving = false;
  readingIcCard: any = false;


  constructor(private fb: FormBuilder,
              private patientService: PatientService, private appService: AppService,
              private message: NzMessageService,
              private ybService: YbTzService,
  ) {
  }

  ngOnInit() {

    this.appService.validationErrors.subscribe(err => {
      if (err) {
        this.formErrors = err;
      }
    });
    this.patientDetailForm = this.fb.group({
      txtName: [undefined, [Validators.required]],
      selectGender: ["", [Validators.required]],
      dateBirthday: ["", [Validators.required]],
      selectEthnic: ["", [Validators.required]],
      selectMarriageStatus: ["", [Validators.required]],
      selectOccupation: [null, null],
      txtIdNumber: [undefined, [Validators.required]],
      selectIdType: ["", [Validators.required]],
      txtDomicile: [undefined, [Validators.required]],
      txtAddressResidential: [undefined, [Validators.required]],
      txtWorkUnit: [undefined, null],
      txtNativePlace: [undefined, null],
      txtBirthPlace: [undefined, null],
      patientContacts: this.fb.array([])
    });
  }

  patchPatientDetailData() {
    this.patientDetailForm.patchValue({
      txtName: this.patient.name,
      selectGender: this.patient.genderDto.id,
      dateBirthday: this.patient.birthday,
      selectEthnic: this.patient.ethnicDto.id,
      selectMarriageStatus: this.patient.marriageStatusDto.id,
      selectOccupation: this.patient.occupationDto.id,
      txtIdNumber: this.patient.idNumber,
      selectIdType: this.patient.idTypeDto.id,
      txtDomicile: this.patient.domicile,
      txtAddressResidential: this.patient.address,
      txtWorkUnit: this.patient.placeOfWork,
      txtBirthPlace: this.patient.birthPlace,
      txtNativePlace: this.patient.nativePlace,
    });
    this.patientContactTableComponent.patchTableFromValue(this.patient.patientContactDtoList);
  }

  public getData() {
    let patientContactList: any[] = this.patientContactTableComponent.getData();
    const data = this.patientDetailForm.value;
    return {
      uuid: this.patient ? this.patient.uuid : undefined,
      name: data.txtName,
      birthday: formatDate(data.dateBirthday, 'yyyy-MM-dd', 'zh-Hans'),
      ethnicDto: {id: data.selectEthnic},
      marriageStatusDto: {id: data.selectMarriageStatus},
      occupationDto: {id: data.selectOccupation},
      idTypeDto: {id: data.selectIdType},
      idNumber: data.txtIdNumber,
      domicile: data.txtDomicile,
      address: data.txtAddressResidential,
      placeOfWork: data.txtWorkUnit,
      genderDto: {id: data.selectGender},
      currentPatient: this.patient ? this.patient.currentPatient : false,
      patientContactDtoList: patientContactList,
      birthPlace: data.txtBirthPlace,
      nativePlace: data.txtNativePlace,
    };
  }

  initializeSelectionList() {
    this.patientService.getPatientInitializeSelectionList()
      .subscribe(response => {
        if (response) {
          this.genderList = response.content.find(dicType => dicType.code == "性别").dictionaryDtoList;
          this.ethnicList = response.content.find(dicType => dicType.code == "民族").dictionaryDtoList;
          this.marriageStatusList = response.content.find(dicType => dicType.code == "婚姻状况").dictionaryDtoList;
          this.occupationList = response.content.find(dicType => dicType.code == "职业").dictionaryDtoList;
          this.idTypeList = response.content.find(dicType => dicType.code == "证件类型").dictionaryDtoList;
          this.pramInitialized = true;
          if (this.patient)
            this.patchPatientDetailData();
          else
            this.setDefaultValue();
        }
      });
  }


  resetUi(patient: any) {
    this.formErrors = {};
    this.patient = patient;
    this.patientDetailForm.reset();
    this.patientContactTableComponent.resetUi();
    this.initializeSelectionList();
  }

  savePatient() {
    //FormValidator.validateForm(this.patientDetailForm, this.formErrors, false, 'formPatientDetail');
    if (!this.patientContactTableComponent.allLineCommitted())
      return;
    if (!this.patientDetailForm.valid) {
      FormValidator.validateFormInput(this.patientDetailForm);
      this.message.create("error", `验证错误`);
      return;
    }

    let patientDetail = this.getData();
    if (patientDetail.patientContactDtoList.length < 1) {
      this.message.create("error", "至少添加一个联系人");
      return;
    }

    this.isSaving = true;
    this.patientService.savePatient(patientDetail)
      .subscribe(response => {
          if (response) {
            patientDetail.uuid = response;
            this.newPatientSaved.emit(patientDetail);
            this.message.create("success", "保存成功");
            this.isSaving = false;
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  private setDefaultValue() {
    this.patientDetailForm.patchValue({
      selectGender: this.genderList.find(t => t.defaultSelection === true).id,
      selectEthnic: this.ethnicList.find(t => t.defaultSelection === true).id,
      selectMarriageStatus: this.marriageStatusList.find(t => t.defaultSelection === true).id,
      selectOccupation: this.occupationList.find(t => t.defaultSelection === true).id,
      selectIdType: this.idTypeList.find(t => t.defaultSelection === true).id,
      txtBirthPlace: '湖南省衡阳市',
      txtNativePlace: '湖南省',
    });
  }

  // readIcCard() {
  //   this.readingIcCard = true;
  //   // this.ybService.getLocalIpInfo()
  //   //   .toPromise().then(response => {
  //   //
  //   // })
  //   //   .catch(error => {
  //   //
  //   //     this.message.create("error", error.error.message);
  //   //     this.readingIcCard = false;
  //   //   });
  //
  //   //let clientUrl = {clientUrl: response.content};
  //   let clientUrl = {clientUrl: undefined};
  //   //clientUrl["clientUrl"] = undefined;
  //   this.ybService.readIcCard(clientUrl).toPromise()
  //     .then(response => {
  //       this.readingIcCard = false;
  //       //this.patchCardInfo(response);
  //     })
  //     .catch(error => {
  //       this.message.create("error", error.error.message);
  //       this.readingIcCard = false;
  //     })
  // }

  private patchCardInfo(ybInfo: any) {
    let gender = this.genderList.find(g => g.extraInfo == ybInfo.xb);
    this.patientDetailForm.patchValue({
      txtName: ybInfo.xm,
      selectGender: gender ? gender.id : undefined,
      dateBirthday: ybInfo.birthday,
      txtIdNumber: ybInfo.zjbh,
      txtWorkUnit: ybInfo.dwmc,
    });
  }
}

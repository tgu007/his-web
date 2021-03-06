import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PatientService} from "../../../../service/patient.service";
import {NzMessageService, NzModalService, NzSelectComponent} from "ng-zorro-antd";
import {PatientDetailContactComponent} from "../patient-detail-contact/patient-detail-contact.component";
import {PatientSignInDiseaseComponent} from "../patient-sign-in-disease/patient-sign-in-disease.component";
import {SessionService} from "../../../../service/session.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import {YbTzService} from "../../../../service/yb-tz.service";
import {HttpClient} from "@angular/common/http";
import {BasicService} from "../../../../service/basic.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-patient-sign-in-detail',
  templateUrl: './patient-sign-in-detail.component.html',
  styleUrls: ['./patient-sign-in-detail.component.css']
})
export class PatientSignInDetailComponent implements OnInit {
  patientSignInForm: any;
  patientSignIn: any;
  initializePrams: any;
  @Output() newSignInSaved = new EventEmitter<any>();
  @ViewChild(PatientSignInDiseaseComponent, {static: true}) patientSignInDiseaseTableComponent: PatientSignInDiseaseComponent;
  patientSignInId;
  readingIcCard: any = false;
  isSaving: any = false;
  isLoading: any = false;
  @ViewChildren(NzSelectComponent)
  nzSelectComponentList: QueryList<NzSelectComponent>;


  constructor(private fb: FormBuilder, private patientService: PatientService,
              private message: NzMessageService,
              private sessionService: SessionService,
              private ybService: YbTzService,
              private modal: NzModalService,
              private basicService: BasicService,
              private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    //this.initializeSelectionList();
    this.patientSignInForm = this.fb.group({
      selectSignInMethod: ["", [Validators.required]],
      selectNursingLevel: ["", [Validators.required]],
      selectPatientCondition: ["", [Validators.required]],
      selectDepartment: ["", [Validators.required]],
      txtOwingLimit: [0, null],
      selectDoctor: ["", [Validators.required]],
      selectInsuranceType: ["", [Validators.required]],
      txtReference: ["", null],
      selectDrgGroup: ["", undefined],
      selectFromHospital: ["", null],
      diseaseList: this.fb.array([]),
      dateSignIn: ["", [Validators.required]],
      selectMedType: ["", [Validators.required]],
      //selectInsuranceArea: ["", [Validators.required]],
    });
  }

  public initializeSelectionList(patientSignInLoaded: boolean) {

    this.patientService.getSignInInitializeSelectionList()
      .subscribe(response => {
        if (response) {
          this.initializePrams = response.content;
          this.filterDepartment();
          this.setDefaultValue(patientSignInLoaded);
        }
      });

  }

  public getData() {
    let diseaseIdList: any[] = this.patientSignInDiseaseTableComponent.getData();
    const data = this.patientSignInForm.value;
    return {
      uuid: this.patientSignIn.uuid,
      patientId: this.patientSignIn.patient.uuid,
      signInMethodId: data.selectSignInMethod,
      nursingLevelId: data.selectNursingLevel,
      owingLimit: data.txtOwingLimit,
      patientConditionId: data.selectPatientCondition,
      departmentId: data.selectDepartment,
      doctorId: data.selectDoctor,
      insuranceTypeId: data.selectInsuranceType,
      reference: data.txtReference,
      drgGroupId: data.selectDrgGroup,
      fromHospitalId: data.selectFromHospital,
      diseaseIdList: diseaseIdList,
      signInDate: this.datePipe.transform(data.dateSignIn, 'yyyy-MM-dd HH:mm:ss'),
      medTypeId: data.selectMedType,
      //insuranceAreaId: data.selectInsuranceArea,
    };
  }


  saveSignIn() {
    if (!this.patientSignInForm.valid) {
      FormValidator.validateFormInput(this.patientSignInForm);
      this.message.create("error", "????????????");
      return;
    }

    let newSignIn = this.getData();
    if (newSignIn.diseaseIdList.length < 1) {
      this.message.create("error", "????????????????????????");
      return;
    }
    //let newinsuranceType = this.initializePrams.insuranceTypeList.find(t => t.id === newSignIn.insuranceTypeId);

    if (this.patientSignIn && this.patientSignIn.status == '?????????'
      && this.patientSignIn.departmentTreatment.uuid != newSignIn.departmentId) {
      this.modal.confirm({
        nzContent: '???????????????????????????????????????????????????????????????',
        nzOnOk: () => {
          this.executeSaveSignInService(newSignIn);
        }
      });
    } else
      this.executeSaveSignInService(newSignIn);

    //console.log(this.patientSignIn);

  }

  private executeSaveSignInService(newSignIn: any) {
    this.isSaving = true;
    this.patientService.saveSignIn(newSignIn)
      .toPromise().then(
      response => {
        this.resetUi(response.content, true);
        this.newSignInSaved.emit(newSignIn);
        this.message.create("success", "????????????");
        //this.patientSignIn = response.content;
        this.isSaving = false;
        //console.log(this.isSaving);
      })
      .catch(error => {
        this.processError(error);
      });
  }

  insuranceToSelfPay() {
    this.isSaving = true;
    this.ybService.insuranceToSelfPay(this.patientSignIn.uuid).toPromise()
      .then(response => {
        this.isSaving = false;
        this.message.create("success", "?????????????????????");
        this.resetUi(response.content, true);
      })
      .catch(error => {
        this.processError(error);
      });
  }

  selfPayToInsurance() {
    this.isSaving = true;
    this.ybService.getLocalIpInfo().toPromise().then(
      response => {
        let clientIpUrl = {clientUrl: response.content}
        this.ybService.selfPayToInsurance(this.patientSignIn.uuid, clientIpUrl).toPromise()
          .then(response => {
            this.isSaving = false;
            this.message.create("success", "?????????????????????");
            this.resetUi(response.content, true);
          })
          .catch(error => {
            this.processError(error);
          });
      }
    );
  }


  resetUi(patientSignIn: any, patientSignInLoaded = false) {
    this.patientSignInForm.reset();
    this.patientSignInDiseaseTableComponent.resetUi();
    this.patientSignIn = patientSignIn;
    if (this.initializePrams == undefined)
      this.initializeSelectionList(patientSignInLoaded);
    else
      this.setDefaultValue(patientSignInLoaded);


    // if (this.patientSignIn.uuid)
    //   if (patientSignInLoaded)
    //     this.patchPatientSignInData();
    //   else
    //     this.loadPatientSignInDetail();
  }


  private loadPatientSignInDetail() {
    this.isLoading = true;
    this.patientService.getSignInDetail(this.patientSignIn.uuid)
      .subscribe(response => {
        if (response)
          this.patientSignIn = response.content;
        this.patchPatientSignInData();
        this.isLoading = false;
      });
  }

  private setDefaultValue(patientSignInLoaded: boolean) {
    let defaultDoctorId = undefined;
    let currentUserId = this.sessionService.loginUser.uuid;
    if (this.initializePrams.employeeList.map(e => e.uuid).includes(currentUserId))
      defaultDoctorId = currentUserId;

    let departmentList = this.initializePrams.departmentTreatmentList;
    this.patientSignInForm.patchValue({
      selectSignInMethod: this.initializePrams.signInMethodList.find(t => t.defaultSelection === true).id,
      selectNursingLevel: this.initializePrams.careLevelList.find(t => t.defaultSelection === true).id,
      selectInsuranceType: this.initializePrams.insuranceTypeList.find(t => t.defaultSelection === true).id,
      selectPatientCondition: this.initializePrams.patientConditionList.find(t => t.defaultSelection === true).id,
      selectDoctor: defaultDoctorId,
      selectDepartment: departmentList.length > 0 ? departmentList[0].uuid : undefined,
      selectDrgGroup: undefined,
      selectFromHospital: undefined,
      dateSignIn: new Date(),
      selectMedType: this.initializePrams.medTypeList.find(t => t.defaultSelection === true).id,
     // selectInsuranceArea: this.initializePrams.insuranceAreaList.find(t => t.defaultSelection === true).id,
    });

    if (this.patientSignIn.uuid)
      if (patientSignInLoaded)
        this.patchPatientSignInData();
      else
        this.loadPatientSignInDetail();
  }


  patchPatientSignInData() {
    this.patientSignInForm.patchValue({
      selectSignInMethod: this.patientSignIn.signInMethod.id,
      selectNursingLevel: this.patientSignIn.nursingLevel.id,
      selectPatientCondition: this.patientSignIn.patientCondition.id,
      selectDepartment: this.patientSignIn.departmentTreatment.uuid,
      txtOwingLimit: this.patientSignIn.owingLimit,
      selectDoctor: this.patientSignIn.doctor.uuid,
      txtReference: this.patientSignIn.reference,
      selectInsuranceType: this.patientSignIn.insuranceType.id,
      selectDrgGroup: this.patientSignIn.drgGroup ? this.patientSignIn.drgGroup.uuid : undefined,
      selectFromHospital: this.patientSignIn.fromHospital ? this.patientSignIn.fromHospital.uuid : undefined,
      dateSignIn: this.patientSignIn.signInDateTime,
      selectMedType: this.patientSignIn.medType.id,
      //selectInsuranceArea: this.patientSignIn.insuranceArea.id,
    });
    this.patientSignInDiseaseTableComponent.patchTableFromValue(this.patientSignIn.diagnoseList);
  }

  private filterDepartment() {
    //????????????????????????????????????
    const uiPermission = this.sessionService.getUserPermission();
    if (!uiPermission.fullDepartmentPermission)
      this.initializePrams.departmentTreatmentList = this.initializePrams.departmentTreatmentList
        .filter(d => this.sessionService.loginUser.departmentIdList.includes(d.uuid));
  }

  allowModify() {
    if (this.patientSignIn) {
      if (this.patientSignIn.uuid) {
        if (this.patientSignIn.status == '?????????' || this.patientSignIn.status == '?????????')
          return false;

        return this.patientSignIn.createdById == this.sessionService.loginUser.accountId ||
          this.patientSignIn.doctor.uuid == this.sessionService.loginUser.uuid;

      } else
        return true;
    } else
      return true;
  }

  // readIcCard() {
  //   this.readingIcCard = true;
  //   this.ybService.readIcCard().toPromise()
  //     .then(response => {
  //       let cardInfo = response.content;
  //       if (cardInfo.xm != '?????????') { //Mock
  //         if (cardInfo.xm != this.patientSignIn.patient.name) {
  //           this.message.create("error", "????????????????????????????????????");
  //           this.readingIcCard = false;
  //           return;
  //         }
  //       }
  //       cardInfo["uuid"] = this.patientSignIn.cardInfoId;
  //       cardInfo["patientSignInId"] = this.patientSignIn.uuid;
  //       this.ybService.saveIcCardInfo(cardInfo).toPromise()
  //         .then(response => {
  //           this.patientSignIn["cardInfoId"] = response;
  //           this.message.create("success", "????????????");
  //           this.readingIcCard = false;
  //           this.newSignInSaved.emit(undefined);
  //         })
  //         .catch(error => {
  //           this.processError(error);
  //         })
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       this.processError(error);
  //     })
  //
  // }

  processError(error: any) {
    this.message.create("error", error.error.message);
    this.isSaving = false;
    this.readingIcCard = false;
  }

  //todo Need to improve this method shouldn't hardcoad
  isSelfPay() {
    if (!this.patientSignInForm.value || !this.initializePrams)
      return true;
    let selectedInsuranceTypeId = this.patientSignInForm.value.selectInsuranceType;

    if (selectedInsuranceTypeId && this.initializePrams.insuranceTypeList) {
      let selectedInsuranceType = this.initializePrams.insuranceTypeList.find(t => t.id === selectedInsuranceTypeId);
      if (selectedInsuranceType.extraInfo == 'readCard')
        return false;
    }
    return true;
  }


  addFromHospital(fromHospital: HTMLInputElement) {
    this.basicService.quickAddFromHospital({
      name: fromHospital.value,
    }).subscribe(response => {
      if (response) {
        this.initializePrams.fromHospitalList = [response.content];
        this.patientSignInForm.patchValue(
          {
            selectFromHospital: response.content.uuid,
          });
        let openedSelectComponent = this.nzSelectComponentList.find(s => s.open);
        if (openedSelectComponent)
          openedSelectComponent.closeDropDown();
      }
    });
  }

  allowChangeInsuranceType() {
    if (this.patientSignIn && this.patientSignIn.uuid == undefined) //?????????
      return false;
    else if (this.patientSignIn && this.patientSignIn.status != '?????????' && !this.patientSignIn.selfPay)
      return true;

    return false;
    //this.patientSignIn?.status =='?????????'
  }
}

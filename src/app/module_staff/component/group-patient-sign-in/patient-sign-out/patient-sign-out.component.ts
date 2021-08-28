import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {PatientService} from "../../../../service/patient.service";
import {BasicService} from "../../../../service/basic.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import {PatientSignInDiseaseComponent} from "../patient-sign-in-disease/patient-sign-in-disease.component";
import {SessionService} from "../../../../service/session.service";
import * as addMinutes from 'date-fns/add_minutes';

@Component({
  selector: 'app-patient-sign-out',
  templateUrl: './patient-sign-out.component.html',
  styleUrls: ['./patient-sign-out.component.css']
})
export class PatientSignOutComponent implements OnInit {
  patientSignIn: any;
  patientSignOutForm: any;
  signOutReasonList: any = [];
  @Output() signOutRequestSavedEvent = new EventEmitter<any>();
  @ViewChild(PatientSignInDiseaseComponent, {static: true}) patientSignInDiseaseTableComponent: PatientSignInDiseaseComponent;
  initializePrams: any;
  saving: any = false;
  @Output() signOurRequestDeleteEvent = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
              private message: NzMessageService, private datePipe: DatePipe,
              private patientService: PatientService,
              private basicService: BasicService,
              private sessionService: SessionService,
              private modal: NzModalService,) {
  }

  ngOnInit() {
    let signOutDate =  addMinutes(new Date(), 30)
    this.patientSignOutForm = this.fb.group({
      selectSignOutReason: [undefined, [Validators.required]],
      dateSignOutDate: [signOutDate, [Validators.required]],
      txtAdvise: [undefined, undefined],
      txtReference: [undefined, undefined],
      selectDepartment: ["", [Validators.required]],
      selectDoctor: ["", [Validators.required]],
      diseaseList: this.fb.array([])
    });

    // this.basicService.getSignOutReasonList().subscribe(response => {
    //   if (response) {
    //     this.signOutReasonList = response.content;
    //     this.setDefaultValue();
    //   }
    // });
  }

  public initializeSelectionList() {
    this.patientService.getSignOutInitializeSelectionList()
      .subscribe(response => {
        if (response) {
          this.initializePrams = response.content;
          this.filterDepartment();
          this.loadSignOutRequest();
        }
      });

  }

  resetUi(currentSignIn: any) {
    this.patientSignIn = currentSignIn;
    this.patientSignOutForm.reset();
    this.patientSignInDiseaseTableComponent.resetUi();
    if (this.initializePrams == undefined)
      this.initializeSelectionList();
    else
      this.loadSignOutRequest();


  }

  processSignOut() {
    if (!this.patientSignOutForm.valid) {
      FormValidator.validateFormInput(this.patientSignOutForm);
      this.message.create("error", `验证错误`);
      return;
    }


    let diseaseIdList: any[] = this.patientSignInDiseaseTableComponent.getData();
    if (diseaseIdList.length < 1) {
      this.message.create("error", "至少添加一个诊断");
      return;
    }
    const data = this.patientSignOutForm.value;
    let signOutRequest = {
      uuid: this.patientSignIn.signOutReq ? this.patientSignIn.signOutReq.uuid : undefined,
      patientSignInId: this.patientSignIn.uuid,
      reasonId: data.selectSignOutReason,
      signOutDate: this.datePipe.transform(data.dateSignOutDate, 'yyyy-MM-dd HH:mm:ss'),
      advise: data.txtAdvise,
      reference: data.txtReference,
      departmentId: data.selectDepartment,
      doctorId: data.selectDoctor,
      diseaseIdList: diseaseIdList
    }
    this.saving = true;
    this.patientService.saveSignOut(signOutRequest)
      .subscribe(response => {
          this.saving = false;
          //this.patientSignIn.status = "待出院";
          //this.message.create("success", "办理出院成功");
          //this.signOurRequestSavedEvent.emit(this.patientSignIn);
          this.patientSignIn.signOutReq = response.content;
          this.message.create("success", "保存成功");
          this.signOutRequestSavedEvent.emit(this.patientSignIn);
        },
        error => {
          this.saving = false;
          this.message.create("error", error.error.message);
        }
      );
  }


  private loadSignOutRequest() {
    this.patientService.tryGetSignOutRequest(this.patientSignIn.uuid)
      .subscribe(response => {
        if (response) {
          if (response.content.uuid)
            this.patientSignIn.signOutReq = response.content;
          this.setFormValue(response.content)
        }
      });
  }


  private setFormValue(signOutRequest: any) {
    //let signOutRequest = this.patientSignIn.signOutReq;
    if (signOutRequest.uuid) {
      this.patientSignOutForm.patchValue({
        selectSignOutReason: signOutRequest.signOutReason.id,
        dateSignOutDate: signOutRequest.signOutDate,
        selectDoctor: signOutRequest.doctor.uuid,
        selectDepartment: signOutRequest.departmentTreatment.uuid,
        txtAdvise: signOutRequest.advise,
        reference: signOutRequest.reference,
      });
      this.patientSignInDiseaseTableComponent.patchTableFromValue(signOutRequest.diagnoseList);

    } else {
      let defaultDoctorId = undefined;
      let currentUserId = this.sessionService.loginUser.uuid;
      if (this.initializePrams.employeeList.map(e => e.uuid).includes(currentUserId))
        defaultDoctorId = currentUserId;

      let defaultDepartment = undefined;
      let currentDepartmentId = this.patientSignIn.departmentTreatment.uuid;
      if (this.initializePrams.departmentTreatmentList.map(e => e.uuid).includes(currentDepartmentId))
        defaultDepartment = currentDepartmentId;


      let signOutDate =  addMinutes(new Date(), 30)
      this.patientSignOutForm.patchValue({
        selectSignOutReason: this.initializePrams.signOutReasonList[0].id,
        dateSignOutDate: signOutDate,
        selectDoctor: defaultDoctorId,
        selectDepartment: defaultDepartment,
      });
    }

  }

  private filterDepartment() {
    //根据当前医生权限过滤科室
    const uiPermission = this.sessionService.getUserPermission();
    if (!uiPermission.fullDepartmentPermission)
      this.initializePrams.departmentTreatmentList = this.initializePrams.departmentTreatmentList
        .filter(d => this.sessionService.loginUser.departmentIdList.includes(d.uuid));
  }

  delete() {
    this.modal.confirm({
      nzContent: '确认取消出院',
      nzOnOk: () => {
        let signOutRequest = this.patientSignIn.signOutReq;
        this.saving = true;
        this.patientService.deleteSignOut(signOutRequest.uuid)
          .subscribe(response => {
              this.saving = false;
              this.message.create("success", "出院信息已删除");
              this.signOurRequestDeleteEvent.emit();
            },
            error => {
              this.saving = false;
              this.message.create("error", error.error.message);
            }
          );
      }
    });

  }

  validation() {
    let signOutRequest = this.patientSignIn.signOutReq;
    this.saving = true;
    this.patientService.validateSignOut(signOutRequest.uuid)
      .subscribe(response => {
          this.saving = false;
          this.patientSignIn.signOutReq = response.content;
          this.message.create("success", "执行成功");
          this.signOutRequestSavedEvent.emit(this.patientSignIn);
        },
        error => {
          this.saving = false;
          this.message.create("error", error.error.message);
        }
      );

  }

  validationComplete() {
    let signOutRequest = this.patientSignIn.signOutReq;
    this.saving = true;
    this.patientService.validateSignOutComplete(signOutRequest.uuid)
      .subscribe(response => {
          this.saving = false;
          this.patientSignIn.signOutReq = response.content;
          this.message.create("success", "执行成功");
          this.signOutRequestSavedEvent.emit(this.patientSignIn);
        },
        error => {
          this.saving = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  confirmOut() {
    this.modal.confirm({
      nzContent: '执行确认完成出院流程，请病人至收费处缴费',
      nzOnOk: () => {
        let signOutRequest = this.patientSignIn.signOutReq;
        this.saving = true;
        this.patientService.confirmWardSignOut(signOutRequest.uuid)
          .subscribe(response => {
              this.saving = false;
              this.patientSignIn.signOutReq = response.content;
              this.message.create("success", "执行成功");
              this.signOutRequestSavedEvent.emit(this.patientSignIn);
            },
            error => {
              this.saving = false;
              this.message.create("error", error.error.message);
            }
          );
      }
    });
  }

  disableAllPrescription() {
    this.modal.confirm({
      nzContent: '停止所有执行中的医嘱?',
      nzOnOk: () => {
        let signOutRequest = this.patientSignIn.signOutReq;
        this.saving = true;
        this.patientService.disableAllPrescription(signOutRequest.uuid)
          .subscribe(response => {
              this.saving = false;
              this.message.create("success", "关停所有医嘱成功");
            },
            error => {
              this.saving = false;
              this.message.create("error", error.error.message);
            }
          );
      }
    });

  }
}

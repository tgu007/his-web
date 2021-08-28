import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PatientService} from "../../../../service/patient.service";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {UserService} from "../../../../service/user.service";
import {DatePipe} from "@angular/common";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-yb-sign-in-record',
  templateUrl: './yb-sign-in-record.component.html',
  styleUrls: ['./yb-sign-in-record.component.css']
})
export class YbSignInRecordComponent implements OnInit {
  saving: any = false;
  ybSignInRecordForm: any;
  doctorList: any;
  patientSignIn: any;
  @Output() recordSaved = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private ybService: YbTzService,
    private userService: UserService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.ybSignInRecordForm = this.fb.group({
      selectDoctor: ["", [Validators.required]],
      txtRecordNumber: ["", [Validators.required]],
      dataStart: ["", [Validators.required]],
      dataEnd: ["", [Validators.required]],
      numberAppliedDays: [0, [Validators.required]],
      numberDaysLeft: ["", [Validators.required]],
    });
    this.loadDoctorList();
  }

  save() {
    if (!this.ybSignInRecordForm.valid) {
      FormValidator.validateFormInput(this.ybSignInRecordForm);
      this.message.create("error", "验证错误");
      return;
    }

    let ybSignInRecord = this.getData();
    this.saving = true;
    this.ybService.saveYBSignInRecord(ybSignInRecord)
      .toPromise().then(
      response => {
        this.recordSaved.emit();
        this.patientSignIn.ybSignInRecord = response.content;
        this.message.create("success", "保存成功");
        this.saving = false;
      })
      .catch(error => {
        this.saving = false;
        this.message.create("error", error.error.message);
      });
  }

  public getData() {
    const data = this.ybSignInRecordForm.value;
    return {
      uuid: this.patientSignIn.ybSignInRecord ? this.patientSignIn.ybSignInRecord.uuid : undefined,
      signInId: this.patientSignIn.uuid,
      appliedByDoctorId: data.selectDoctor,
      referenceNumber: data.txtRecordNumber,
      startDate: this.datePipe.transform(data.dataStart, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(data.dataEnd, 'yyyy-MM-dd'),
      numberOfDays: data.numberAppliedDays,
      leftDays: data.numberDaysLeft
    };

  }

  resetUI(patientSignIn: any) {
    this.patientSignIn = patientSignIn;
    let ybSignInRecord = this.patientSignIn.ybSignInRecord;
    if (ybSignInRecord) {
      this.ybSignInRecordForm.patchValue({
        selectDoctor: ybSignInRecord.appliedByDoctorId,
        txtRecordNumber: ybSignInRecord.referenceNumber,
        dataStart: ybSignInRecord.startDate,
        dataEnd: ybSignInRecord.endDate,
        numberAppliedDays: ybSignInRecord.numberOfDays,
        numberDaysLeft: ybSignInRecord.leftDays,
      });
    } else {

      this.ybSignInRecordForm.patchValue({
        selectDoctor: undefined,
        txtRecordNumber: undefined,
        dataStart: undefined,
        dataEnd: undefined,
        numberAppliedDays: 0,
        numberDaysLeft: 0,
      });
    }
  }

  private loadDoctorList() {
    let filter = {userRoleType: '医生'};
    this.userService.getUserList(filter)
      .subscribe(response => {
          this.doctorList = response.content;
        }
      );
  }
}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {UserService} from "../../../../service/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {YbTzService} from "../../../../service/yb-tz.service";

@Component({
  selector: 'app-doctor-agreement',
  templateUrl: './doctor-agreement.component.html',
  styleUrls: ['./doctor-agreement.component.css']
})
export class DoctorAgreementComponent implements OnInit {
  doctorAgreementForm: any;
  employee: any
  saving: any = false;
  @Output() agreementSavedEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private ybService: YbTzService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.doctorAgreementForm = this.fb.group({
      agreementNumber: ['', null],
    });
  }

  resetUI(employee: any) {
    this.employee = employee;
    this.doctorAgreementForm.reset();
    if (employee.doctorAgreementNumber)
      this.doctorAgreementForm.patchValue({
        agreementNumber: this.employee.doctorAgreementNumber
      });
  }

  saveDoctorAgreement() {
    let data = {
      uuid: this.employee.doctorAgreementId,
      doctorId: this.employee.uuid,
      agreementNumber: this.doctorAgreementForm.value.agreementNumber,
    }
    this.ybService.saveDoctorAgreement(data)
      .subscribe(response => {
        this.message.create("success", "医师协议更新成功");
        this.agreementSavedEvent.emit();
      });
  }
}

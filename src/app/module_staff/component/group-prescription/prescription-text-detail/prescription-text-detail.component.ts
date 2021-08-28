import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PrescriptionService} from "../../../../service/prescription.service";
import {AppService} from "../../../../service/app.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import {NzMessageService} from "ng-zorro-antd";
import {PrescriptionStatus, PrescriptionType} from "../prescription-enums";
import {DatePipe} from "@angular/common";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-prescription-text-detail',
  templateUrl: './prescription-text-detail.component.html',
  styleUrls: ['./prescription-text-detail.component.css']
})
export class PrescriptionTextDetailComponent implements OnInit {
  newTextPrescriptionForm: any;
  formErrors: Object = {};
  @Input() patientSignIn: any;
  @Input() isOneOff: any;
  textPrescription;
  saving = false;
  loading: any;
  disabledDate = (current: Date): boolean => {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  constructor(private fb: FormBuilder, private prescriptionService: PrescriptionService, private appService: AppService,
              private message: NzMessageService,
               private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.newTextPrescriptionForm = this.fb.group({
      txtDescription: ["", [Validators.required]],
      dateStartDateTime: [undefined, null],
      chkManualDate: [undefined],
    });
  }

  submitForm() {
    // FormValidator.validateForm(this.newMedicinePrescriptionForm, this.formErrors, false, 'formMedicinePrescription');
    if (!this.newTextPrescriptionForm.valid) {
      FormValidator.validateFormInput(this.newTextPrescriptionForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.newTextPrescriptionForm.value;
    let newPrescription = this.getData(data);
    // this.isSpinning = true;
    this.saving = true;
    this.prescriptionService.saveTextPrescription(newPrescription)
      .subscribe(response => {
          this.saving = false;
          this.message.create("success", "保存成功");
          this.resetUi({});
          this.prescriptionService.onPrescriptionSavedEvent.emit();
        },
        error => {
          this.saving = false;
          this.message.create("error", error.error.message);
        });
  }


  getData(data) {
    return {
      uuid: this.textPrescription.uuid,
      prescriptionType: PrescriptionType.Text,
      status: PrescriptionStatus.created,
      reference: data.txtDescription,
      isOneOff: this.isOneOff,
      patientSignInId: this.patientSignIn.uuid,
      departmentId: this.patientSignIn.departmentTreatment.uuid,
      manualStartDate: data.chkManualDate ? this.datePipe.transform(data.dateStartDateTime, 'yyyy-MM-dd HH:mm:ss') : undefined,
    }
  }

  resetUi(prescription) {
    this.textPrescription = prescription;
    this.newTextPrescriptionForm.reset();
    this.chkManualDateChanged(false);

    if (prescription.uuid) {
      this.loadPrescriptionDetail()
    }
  }

  private loadPrescriptionDetail() {
    this.loading = true;
    this.prescriptionService.getTextPrescriptionDetail(this.textPrescription.uuid)
      .subscribe(response => {
          if (response) {
            this.patchFormValue(response.content);
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
          this.message.create("error", "读取详细信息失败");
        });
  }

  private patchFormValue(medicinePrescriptionDetail: any) {
    this.newTextPrescriptionForm.patchValue({
      txtDescription: medicinePrescriptionDetail.reference
    });
  }

  chkManualDateChanged(checked: boolean) {
    if (!checked) {
      this.newTextPrescriptionForm.get('dateStartDateTime')!.clearValidators();
      this.newTextPrescriptionForm.get('dateStartDateTime')!.markAsPristine();
    } else {
      this.newTextPrescriptionForm.get('dateStartDateTime')!.setValidators(Validators.required);
      this.newTextPrescriptionForm.get('dateStartDateTime')!.markAsDirty();
    }
    this.newTextPrescriptionForm.get('dateStartDateTime')!.updateValueAndValidity();
  }
}

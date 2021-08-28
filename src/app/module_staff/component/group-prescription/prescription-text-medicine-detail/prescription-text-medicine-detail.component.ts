import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PrescriptionService} from "../../../../service/prescription.service";
import {BasicService} from "../../../../service/basic.service";
import {AppService} from "../../../../service/app.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {PrescriptionStatus, PrescriptionType} from "../prescription-enums";
import * as globals from "../../../../../globals";
import {FormValidator} from "../../../../../validation/FormValidator";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-prescription-text-medicine-detail',
  templateUrl: './prescription-text-medicine-detail.component.html',
  styleUrls: ['./prescription-text-medicine-detail.component.css']
})
export class PrescriptionTextMedicineDetailComponent implements OnInit {
  newTextMedicinePrescriptionForm: any;
  formErrors: Object = {};
  @Input() patientSignIn: any;
  @Input() isOneOff: any;
  private initPramLoaded: any = false;
  medicineTextPrescription;
  saving: any = false;
  loading: any = false;
  useMethodList: any;
  nzFilterOption = () => true;
  disabledDate = (current: Date): boolean => {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  constructor(private fb: FormBuilder, public prescriptionService: PrescriptionService,
              private basicService: BasicService,
              private message: NzMessageService,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.newTextMedicinePrescriptionForm = this.fb.group({
      txtMedicine: ["", [Validators.required]],
      txtQuantity: ["", [Validators.required]],
      txtFirstDayQuantity: ["", null],
      txtServeQuantity: ["", null],
      selectFrequency: ["", [Validators.required]],
      selectUseMethod: ["", [Validators.required]],
      txtDropSpeed: ["", null],
      txtNote: ["", null],
      dateStartDateTime: [undefined, null],
      chkManualDate: [undefined],
      checkSelfPrepared:[true, [Validators.required]]
    });
  }


  public submitForm() {

    // FormValidator.validateForm(this.newMedicinePrescriptionForm, this.formErrors, false, 'formMedicinePrescription');
    if (!this.newTextMedicinePrescriptionForm.valid) {
      FormValidator.validateFormInput(this.newTextMedicinePrescriptionForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.newTextMedicinePrescriptionForm.value;
    let newPrescription = this.getData(data);
    this.saving = true;
    this.prescriptionService.saveMedicineTextPrescription(newPrescription)
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
      prescriptionSaveDto:
        {
          uuid: this.medicineTextPrescription.uuid,
          prescriptionType: PrescriptionType.TextMedicine,
          status: PrescriptionStatus.created,
          reference: data.txtNote,
          isOneOff: this.isOneOff,
          patientSignInId: this.patientSignIn.uuid,
          departmentId: this.patientSignIn.departmentTreatment.uuid,
        },
      uuid: this.medicineTextPrescription.prescriptionDetailId,
      useMethodId: data.selectUseMethod ? data.selectUseMethod as number : undefined,
      dropSpeed: data.txtDropSpeed as string,
      medicineName: data.txtMedicine,
      firstDayQuantity: data.txtFirstDayQuantity,
      serveQuantity: data.txtServeQuantity,
      frequencyId: data.selectFrequency,
      quantity: data.txtQuantity,
      manualStartDate: data.chkManualDate ? this.datePipe.transform(data.dateStartDateTime, 'yyyy-MM-dd HH:mm:ss') : undefined,
      selfPrepared:data.checkSelfPrepared
    }
  }


  resetUi(prescription) {
    this.formErrors = {};
    this.medicineTextPrescription = prescription;
    this.newTextMedicinePrescriptionForm.reset();
    this.chkManualDateChanged(false);
    if (!this.initPramLoaded) {
      this.prescriptionService.callGetFrequencyListService();
      this.prescriptionService.callGetUseMethodListService();
      this.prescriptionService.useMethodObservable.subscribe(response => {
        this.setDefaultValue();
      });
      this.initPramLoaded = true;
    }
    this.setDefaultValue();
    if (prescription.uuid) {
      this.loadPrescriptionDetail()
    }
  }


  private setDefaultValue() {
    this.useMethodList = this.prescriptionService.useMethodList;
    this.newTextMedicinePrescriptionForm.patchValue({
      selectUseMethod: this.prescriptionService.useMethodList ? this.prescriptionService.useMethodList.find(t => t.defaultSelection === true).id : undefined,
      checkSelfPrepared:true
    });
  }

  private loadPrescriptionDetail() {
    this.loading = true;
    this.prescriptionService.getMedicineTextPrescriptionDetail(this.medicineTextPrescription.uuid)
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
    this.newTextMedicinePrescriptionForm.patchValue({
      txtMedicine: medicinePrescriptionDetail.medicineName,
      txtQuantity: medicinePrescriptionDetail.quantity,
      txtFirstDayQuantity: medicinePrescriptionDetail.firstDayQuantity,
      selectFrequency: medicinePrescriptionDetail.frequency.id,
      selectUseMethod: medicinePrescriptionDetail.useMethod.id,
      txtDropSpeed: medicinePrescriptionDetail.dropSpeed,
      txtNote: medicinePrescriptionDetail.prescription.reference,
      txtServeQuantity: medicinePrescriptionDetail.serveQuantity,
      checkSelfPrepared:medicinePrescriptionDetail.selfPrepared
    });
  }

  searchUserMethod(searchCode: string) {
    this.useMethodList = this.prescriptionService.useMethodList.filter(u => u.searchCode.search(searchCode.toLocaleUpperCase()) >= 0);
  }

  chkManualDateChanged(checked: boolean) {
    if (!checked) {
      this.newTextMedicinePrescriptionForm.get('dateStartDateTime')!.clearValidators();
      this.newTextMedicinePrescriptionForm.get('dateStartDateTime')!.markAsPristine();
    } else {
      this.newTextMedicinePrescriptionForm.get('dateStartDateTime')!.setValidators(Validators.required);
      this.newTextMedicinePrescriptionForm.get('dateStartDateTime')!.markAsDirty();
    }
    this.newTextMedicinePrescriptionForm.get('dateStartDateTime')!.updateValueAndValidity();
  }
}

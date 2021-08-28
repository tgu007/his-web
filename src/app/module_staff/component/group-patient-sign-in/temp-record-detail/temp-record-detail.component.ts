import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {PatientService} from "../../../../service/patient.service";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-temp-record-detail',
  templateUrl: './temp-record-detail.component.html',
  styleUrls: ['./temp-record-detail.component.css']
})
export class TempRecordDetailComponent implements OnInit {
  tempRecordDetailForm: any;
  @Input() patientSignIn: any;
  tempRecord: any;
  @Output() tempRecordSavedEvent = new EventEmitter<any>();
  isLoading = false;

  constructor(private fb: FormBuilder,
              private message: NzMessageService, private datePipe: DatePipe,
              private patientService: PatientService) {
  }

  ngOnInit() {
    this.tempRecordDetailForm = this.fb.group({
      dateRecordDate: [new Date(), [Validators.required]],
      numberHeartbeat: [undefined, undefined],
      numberPulse: [undefined, undefined],
      numberBreath: [undefined, undefined],
      numberBowels: [undefined, undefined],
      numberBloodPressureHigh: [undefined, undefined],
      numberBloodPressureLow: [undefined, undefined],
      numberMouthTemp: [undefined, undefined],
      numberEarTemp: [undefined, undefined],
      numberArmpitTemp: [undefined, undefined],
      numberRectalTemp: [undefined, undefined],
      numberAdjustTemp: [undefined, undefined],
      numberIn: [undefined, undefined],
      numberOut: [undefined, undefined],
      numberUrine: [undefined, undefined],
      numberHeight: [undefined, undefined],
      numberWeight: [undefined, undefined],
      txtAllergy: [undefined, undefined],
      txtReference: [undefined, undefined],
      chkCanNotStand: [undefined, undefined],
      selectUrineVolume:[undefined, undefined],
    });
  }

  saveDetail() {
    if (!this.tempRecordDetailForm.valid) {
      FormValidator.validateFormInput(this.tempRecordDetailForm);
      this.message.create("error", `验证错误`);
      return;
    }

    let tempRecord = this.getData();
    this.isLoading = true;
    this.patientService.saveTempRecord(tempRecord)
      .subscribe(response => {
          if (response) {
            this.tempRecord = response.content;
            this.tempRecordSavedEvent.emit();
            this.message.create("success", "保存成功");
            this.isLoading = false;
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );
  }

  resetUi(tempRecord: any) {
    this.tempRecordDetailForm.reset();
    this.tempRecord = tempRecord;

    this.tempRecordDetailForm.patchValue({
      dateRecordDate: new Date()
    });

    if (tempRecord.uuid)
      this.patchTempRecordData();
  }

  private getData() {
    const data = this.tempRecordDetailForm.value;
    return {
      uuid: this.tempRecord.uuid,
      patientSignInId: this.patientSignIn.uuid,
      heartBeat: data.numberHeartbeat,
      pulse: data.numberPulse,
      breath: data.numberBreath,
      bloodPressureHigh: data.numberBloodPressureHigh,
      bloodPressureLow: data.numberBloodPressureLow,
      bowels: data.numberBowels,
      armpitTemp: data.numberArmpitTemp,
      mouthTemp: data.numberMouthTemp,
      earTemp: data.numberEarTemp,
      rectalTemp: data.numberRectalTemp,
      adjustTemp: data.numberAdjustTemp,
      inVolume: data.numberIn,
      outVolume: data.numberOut,
      urineVolume: data.numberUrine,
      height: data.numberHeight,
      weight: data.numberWeight,
      canNotStand: data.chkCanNotStand,
      allergy: data.txtAllergy,
      reference: data.txtReference,
      recordDate: this.datePipe.transform(data.dateRecordDate, 'yyyy-MM-dd HH:mm:ss'),
      urineVolumeSelection:data.selectUrineVolume,
    };
  }

  private patchTempRecordData() {
    this.tempRecordDetailForm.patchValue({
      dateRecordDate: this.tempRecord.recordDate,
      numberHeartbeat: this.tempRecord.heartBeat,
      numberPulse: this.tempRecord.pulse,
      numberBreath: this.tempRecord.breath,
      numberBowels: this.tempRecord.bowels,
      numberBloodPressureHigh: this.tempRecord.bloodPressureHigh,
      numberBloodPressureLow: this.tempRecord.bloodPressureLow,
      numberMouthTemp: this.tempRecord.mouthTemp,
      numberEarTemp: this.tempRecord.earTemp,
      numberRectalTemp: this.tempRecord.rectalTemp,
      numberArmpitTemp: this.tempRecord.armpitTemp,
      numberAdjustTemp: this.tempRecord.adjustTemp,
      numberIn: this.tempRecord.inVolume,
      numberOut: this.tempRecord.outVolume,
      numberUrine: this.tempRecord.urineVolume,
      numberHeight: this.tempRecord.height,
      numberWeight: this.tempRecord.weight,
      txtAllergy: this.tempRecord.allergy,
      txtReference: this.tempRecord.reference,
      chkCanNotStand:this.tempRecord.canNotStand,
      selectUrineVolume:this.tempRecord.urineVolumeSelection
    });
  }
}

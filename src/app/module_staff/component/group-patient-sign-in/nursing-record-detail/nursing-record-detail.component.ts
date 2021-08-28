import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe, formatDate} from "@angular/common";
import {PatientService} from "../../../../service/patient.service";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-nursing-record-detail',
  templateUrl: './nursing-record-detail.component.html',
  styleUrls: ['./nursing-record-detail.component.css']
})
export class NursingRecordDetailComponent implements OnInit {
  @Input() patientSignIn: any;
  nursingRecordDetailForm: any;
  isSpinning: any;
  nursingRecord: any;
  @Output() nursingRecordSavedEvent = new EventEmitter<any>();
  saving: any = false;

  constructor(private fb: FormBuilder,
              private message: NzMessageService, private datePipe: DatePipe,
              private patientService: PatientService,) {
  }

  ngOnInit() {
    this.nursingRecordDetailForm = this.fb.group({
      dateRecordDate: [new Date(), [Validators.required]],
      numberBodyTemp: [undefined, undefined],
      numberPulse: [undefined, undefined],
      numberBreath: [undefined, undefined],
      selectConsciousness: [undefined, undefined],
      numberBloodPressureHigh: [undefined, undefined],
      numberBloodPressureLow: [undefined, undefined],
      numberSpo2: [undefined, undefined],
      numberOxygen: [undefined, undefined],
      selectPupilLeft: [undefined, undefined],
      selectPupilRight: [undefined, undefined],
      txtLeftPupilSize: [undefined, undefined],
      txtRightPupilSize: [undefined, undefined],
      selectPipingCondition: [undefined, undefined],
      txtSkinCondition: [undefined, undefined],
      numberPressureSoreScore: [undefined, undefined],
      numberFallScore: [undefined, undefined],
      numberCareOneselfScore: [undefined, undefined],
      txtInName: [undefined, undefined],
      numberInVolume: [undefined, undefined],
      txtOutName: [undefined, undefined],
      numberOutVolume: [undefined, undefined],
      txtOutCondition: [undefined, undefined],
      txtReference: [undefined, undefined],
    });
  }

  saveDetail() {
    if (!this.nursingRecordDetailForm.valid) {
      FormValidator.validateFormInput(this.nursingRecordDetailForm);
      this.message.create("error", `验证错误`);
      return;
    }

    let nursingRecord = this.getData();
    this.saving = true;
    this.patientService.saveNursingRecord(nursingRecord)
      .subscribe(response => {
        this.saving = false;
        if (response) {
          this.nursingRecord = response.content;
          this.nursingRecordSavedEvent.emit();
          this.message.create("success", "保存成功");
        }
      });
  }

  private getData() {
    const data = this.nursingRecordDetailForm.value;
    return {
      uuid: this.nursingRecord.uuid,
      patientSignInId: this.patientSignIn.uuid,
      bodyTemp: data.numberBodyTemp,
      pulse: data.numberPulse,
      breath: data.numberBreath,
      bloodPressureHigh: data.numberBloodPressureHigh,
      bloodPressureLow: data.numberBloodPressureLow,
      spo2: data.numberSpo2,
      oxygen: data.numberOxygen,
      consciousness: data.selectConsciousness,
      leftPupil: data.selectPupilLeft,
      rightPupil: data.selectPupilRight,
      leftPupilSize: data.txtLeftPupilSize,
      rightPupilSize: data.txtRightPupilSize,
      inName: data.txtInName,
      inVolume: data.numberInVolume,
      outName: data.txtOutName,
      outVolume: data.numberOutVolume,
      outCondition: data.txtOutCondition,
      pipingCondition: data.selectPipingCondition,
      skinCondition: data.txtSkinCondition,
      pressureSoreScore: data.numberPressureSoreScore,
      fallScore: data.numberFallScore,
      careOneselfScore: data.numberCareOneselfScore,
      description: data.txtReference,
      recordDate: this.datePipe.transform(data.dateRecordDate, 'yyyy-MM-dd HH:mm:ss'),
    };
  }

  resetUi(nursingRecord: any) {
    this.nursingRecordDetailForm.reset();
    this.nursingRecord = nursingRecord;

    this.nursingRecordDetailForm.patchValue({
      dateRecordDate: new Date()
    });

    if (nursingRecord.uuid)
      this.patchNursingRecordData();
  }

  private patchNursingRecordData() {
    this.nursingRecordDetailForm.patchValue({
      dateRecordDate: this.nursingRecord.recordDate,
      numberBodyTemp: this.nursingRecord.bodyTemp,
      numberPulse: this.nursingRecord.pulse,
      numberBreath: this.nursingRecord.breath,
      selectConsciousness: this.nursingRecord.consciousness,
      numberBloodPressureHigh: this.nursingRecord.bloodPressureHigh,
      numberBloodPressureLow: this.nursingRecord.bloodPressureLow,
      numberSpo2: this.nursingRecord.spo2,
      numberOxygen: this.nursingRecord.oxygen,
      selectPupilLeft: this.nursingRecord.leftPupil,
      selectPupilRight: this.nursingRecord.rightPupil,
      txtLeftPupilSize: this.nursingRecord.leftPupilSize,
      txtRightPupilSize: this.nursingRecord.rightPupilSize,
      selectPipingCondition: this.nursingRecord.pipingCondition,
      txtSkinCondition: this.nursingRecord.skinCondition,
      numberPressureSoreScore: this.nursingRecord.pressureSoreScore,
      numberFallScore: this.nursingRecord.fallScore,
      numberCareOneselfScore: this.nursingRecord.careOneselfScore,
      txtInName: this.nursingRecord.inName,
      numberInVolume: this.nursingRecord.inVolume,
      txtOutName: this.nursingRecord.outName,
      numberOutVolume: this.nursingRecord.outVolume,
      txtOutCondition: this.nursingRecord.outCondition,
      txtReference: this.nursingRecord.description,
    });
  }
}


import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {PatientService} from "../../../../service/patient.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-temp-record-list-batch',
  templateUrl: './temp-record-list-batch.component.html',
  styleUrls: ['./temp-record-list-batch.component.css']
})
export class TempRecordListBatchComponent implements OnInit {
  tempRecordBatchForm: any;

  wardBedList: any = [];
  private lineArray: any;
  selectShowColumn: any = ['脉搏', '呼吸', '大便', '血压', '腋温', '尿量', '体重', '卧床', '药物过敏', '备注', '出量'];
  columnNameList: any = ['脉搏', '心率', '呼吸', '大便', '血压', '腋温', '口温', '耳温', '肛温', '降温', '入量', '出量', '尿量', '身高', '体重', '卧床', '药物过敏', '备注'];
  dateFormat: any = 'yyyy/MM/dd HH:mm';
  @Output() tempRecordSavedEvent = new EventEmitter<any>();
  isLoading: any = false;
  isSaving: any = false;
  @Input() showBatchInputTab: any = false;

  constructor(private fb: FormBuilder,
              private message: NzMessageService, private datePipe: DatePipe,
              private patientService: PatientService,
              public sessionService: SessionService,) {
  }

  ngOnInit() {
    this.tempRecordBatchForm = this.fb.group({
      tempRecordList: this.fb.array([])
    });
    this.lineArray = <FormArray>this.tempRecordBatchForm.controls['tempRecordList'];
    if (this.showBatchInputTab) {
      let wardFilter = {};
      if (!this.sessionService.getUserPermission().fullWardPermission)
        wardFilter['wardIdList'] = this.sessionService.loginUser.wardIdList;
      this.loadWardCurrentPatient(wardFilter);
    }
  }

  save() {

    let modifiedLines = this.lineArray.controls.filter(c => !c.pristine);
    //filter( l=> l.pristine);
    let temRecordList: any[] = [];
    for (let modifiedLine of modifiedLines) {
      if (this.hasAnyValidInput(modifiedLine)) {
        let tempRecord = {
          uuid: modifiedLine.controls.lineId.value,
          patientSignInId: modifiedLine.controls.wardBed.value.currentSignIn.uuid,
          heartBeat: modifiedLine.controls.numberHeartbeat.value,
          pulse: modifiedLine.controls.numberPulse.value,
          breath: modifiedLine.controls.numberBreath.value,
          bloodPressureHigh: modifiedLine.controls.numberBloodPressureHigh.value,
          bloodPressureLow: modifiedLine.controls.numberBloodPressureLow.value,
          bowels: modifiedLine.controls.numberBowels.value,
          armpitTemp: modifiedLine.controls.numberArmpitTemp.value,
          mouthTemp: modifiedLine.controls.numberMouthTemp.value,
          earTemp: modifiedLine.controls.numberEarTemp.value,
          rectalTemp: modifiedLine.controls.numberRectalTemp.value,
          adjustTemp: modifiedLine.controls.numberAdjustTemp.value,
          inVolume: modifiedLine.controls.numberIn.value,
          outVolume: modifiedLine.controls.numberOut.value,
          urineVolume: modifiedLine.controls.numberUrine.value,
          height: modifiedLine.controls.numberHeight.value,
          weight: modifiedLine.controls.numberWeight.value,
          canNotStand: modifiedLine.controls.chkCanNotStand.value,
          allergy: modifiedLine.controls.txtAllergy.value,
          reference: modifiedLine.controls.txtReference.value,
          recordDate: this.datePipe.transform(modifiedLine.controls.dateRecordDate.value, 'yyyy-MM-dd HH:mm:ss'),
          urineVolumeSelection: modifiedLine.controls.selectUrineVolume.value,
        };
        temRecordList.push(tempRecord);
      }
    }
    if (temRecordList.length > 0) {
      this.isSaving = true;
      this.patientService.saveTempRecordList(temRecordList)
        .subscribe(response => {
            if (response) {
              this.message.create("success", "保存成功");
              let savedTempRecordList = response.content;
              for (let savedTempRecord of savedTempRecordList) {
                let line = this.lineArray.controls.filter(c => c.controls.wardBed.value.currentSignIn.uuid == savedTempRecord.patientSignInId)[0];
                line.patchValue({
                  lineId: savedTempRecord.uuid
                });
              }
              this.tempRecordSavedEvent.emit();
              this.isSaving = false;
            }
          },
          error => {
            this.message.create("error", error.error.message);
            this.isSaving = false;
          }
        )
    }
  }


  private refreshLineControl() {
    this.lineArray.clear();
    const defaultTime = new Date();

    //调整默认时间为最接近的整数点，从凌晨2点开始，4小时间隔
    let defaultHour = defaultTime.getHours();

    //第一次尝试向前调整，后两次像后调整
    let tryTime = 0;
    while (defaultHour % 4 != 2) {
      if (tryTime == 0)
        defaultHour--;
      else if (tryTime == 1)
        defaultHour = defaultHour + 2;
      else
        defaultHour++;
      tryTime++;
    }

    defaultTime.setHours(defaultHour, 0, 0);

    for (let wardRoomBed of this.wardBedList) {
      let newLineControl = this.fb.group({
        lineId: [undefined, undefined],
        wardBed: [wardRoomBed, undefined],
        dateRecordDate: [defaultTime, [Validators.required]],
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
        chkCanNotStand: [undefined, undefined],
        txtAllergy: [undefined, undefined],
        txtReference: [undefined, undefined],
        selectUrineVolume: [undefined, undefined],
      });
      this.lineArray.controls = [...this.lineArray.controls, newLineControl];
    }
  }

  private hasAnyValidInput(modifiedLine: any) {
    const columnControls = Object.keys(modifiedLine.controls).filter(c => c != 'lineId' && c != 'wardBed' && c != 'dateRecordDate');
    let modifiedColumns = columnControls.filter(c => modifiedLine.controls[c].value);
    if (modifiedColumns.length > 0)
      return true;
    else
      return false;
  }


  // setDefaultTemp(lineControl: any, controlName: string) {
  //   if (lineControl.controls[controlName].value == undefined)
  //     lineControl.controls[controlName].patchValue("36.5");
  // }

  loadWardCurrentPatient(wardFilter: {}) {
    this.wardBedList = [];
    wardFilter["hideEmptyBed"] = true;
    this.isLoading = true;
    this.patientService.getWardList(wardFilter)
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          let wardList = response.content;
          wardList.forEach(w => w.wardRoomList.forEach(wr => wr.wardRoomBedList.forEach(b => {
            if (b.currentSignIn && b.currentSignIn.status == "已入院") {
              this.wardBedList.push(b)
            }
          })));
          this.refreshLineControl();
        }
        //
      });
  }
}

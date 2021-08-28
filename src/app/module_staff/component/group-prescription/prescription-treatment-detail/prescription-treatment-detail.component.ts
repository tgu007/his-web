import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PrescriptionService} from "../../../../service/prescription.service";
import {NzMessageService} from "ng-zorro-antd";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {DatePipe} from "@angular/common";
import {PrescriptionChargeableType, PrescriptionStatus, PrescriptionType} from "../prescription-enums";
import {BasicService} from "../../../../service/basic.service";
import {CommonDynamicSelectComponent} from "../../group-common/common-dynamic-select/common-dynamic-select.component";
import * as globals from "../../../../../globals";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-prescription-treatment-detail',
  templateUrl: './prescription-treatment-detail.component.html',
  styleUrls: ['./prescription-treatment-detail.component.css']
})
export class PrescriptionTreatmentDetailComponent implements OnInit {
  newTreatmentPrescriptionForm: any;
  treatmentList: any;
  selectedTreatment: any;
  @Input() patientSignIn: any;
  @Input() isOneOff: any;
  disabledDate = (current: Date): boolean => {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
  private initPramLoaded: any = false;
  treatmentPrescription;
  departmentList: any;
  treatmentListTotalCount: any;
  formErrors: any = {};
  @ViewChild(CommonDynamicSelectComponent, {static: true}) treatmentSelect: CommonDynamicSelectComponent;
  saving: any = false;
  pageCount: any;
  selectionTablePageSize = globals.selectionPageSize;
  loading: any;

  constructor(private fb: FormBuilder,
              public prescriptionService: PrescriptionService,
              private basicService: BasicService,
              private message: NzMessageService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.newTreatmentPrescriptionForm = this.fb.group({
      // selectDepartment: ["", [Validators.required]],
      txtTreatment: ["", [Validators.required]],
      txtQuantity: [1, [Validators.required]],
      txtFirstDayQuantity: ["", null],
      selectFrequency: ["", [Validators.required]],
      txtNote: ["", null],
      dateStartDateTime: [undefined, null],
      chkManualDate: [undefined],
    });
  }

  public submitForm() {
    // FormValidator.validateForm(this.newMedicinePrescriptionForm, this.formErrors, false, 'formMedicinePrescription');
    if (!this.newTreatmentPrescriptionForm.valid) {
      FormValidator.validateFormInput(this.newTreatmentPrescriptionForm);
      this.message.create("error", "验证错误");
      return;
    }
    if(this.selectedTreatment.listPrice === 0)
    {
      this.message.create("warning", "价格为0,请联系医保办调整价格");
      return;
    }

    const data = this.newTreatmentPrescriptionForm.value;
    let newPrescription = this.getData(data);
    // this.isSpinning = true;
    this.saving = true;
    this.prescriptionService.saveTreatmentPrescription(newPrescription)
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
      prescriptionChargeableSaveDto:
        {
          uuid: this.treatmentPrescription.prescriptionChargeableId,
          frequencyId: data.selectFrequency,
          quantity: data.txtQuantity as number,
          firstDayQuantity: data.txtFirstDayQuantity ? data.txtFirstDayQuantity as number : 0,
          manualStartDate: data.chkManualDate ? this.datePipe.transform(data.dateStartDateTime, 'yyyy-MM-dd HH:mm:ss') : undefined,
          prescriptionSaveDto:
            {
              uuid: this.treatmentPrescription.uuid,
              prescriptionType: PrescriptionType.Treatment,
              status: PrescriptionStatus.created,
              reference: data.txtNote,
              isOneOff: this.isOneOff,
              patientSignInId: this.patientSignIn.uuid,
              //departmentId: data.selectDepartment,
              departmentId: this.selectedTreatment.defaultExecuteDepartment ? this.selectedTreatment.defaultExecuteDepartment.uuid : this.patientSignIn.departmentTreatment.uuid,
            }
        },
      uuid: this.treatmentPrescription.prescriptionDetailId,
      treatmentId: this.selectedTreatment.uuid,
    }
  }


  searchTreatment(dynamicSelectEvent: any) {
    if (dynamicSelectEvent == '')
      return;
    let treatmentFilter = {enabled: true, searchCode: dynamicSelectEvent.input};
    this.basicService.getSelectionPagedTreatmentList(treatmentFilter, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content);
          this.treatmentListTotalCount = response.totalCount;
          this.pageCount = response.totalPages;
        }
      });
  }

  private buildItemDynamicSelectionValueList(selectTreatmentDropdownData: any) {
    for (let treatment of selectTreatmentDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(treatment.name);
      dynamicItemValueList.push(treatment.listPrice);
      dynamicItemValueList.push(treatment.centerTreatment ? treatment.centerTreatment.chargeLevel : undefined);
      treatment["label"] = dynamicItemValueList[0];
      treatment["valueList"] = dynamicItemValueList;
    }
    this.treatmentList = selectTreatmentDropdownData;
  }

  resetUi(prescription) {
    this.treatmentSelect.itemSelect.focus();
    this.selectedTreatment = undefined;
    this.treatmentList = undefined;
    this.treatmentPrescription = prescription;
    this.newTreatmentPrescriptionForm.reset();
    this.chkManualDateChanged(false);
    if (!this.initPramLoaded) {
      this.prescriptionService.callGetFrequencyListService();
      //this.loadDepartmentList();
      this.initPramLoaded = true;
    } else
      this.setDefaultValue();
    if (prescription.uuid) {
      this.loadPrescriptionDetail()
    }
  }

  private loadPrescriptionDetail() {
    this.loading = true;
    this.prescriptionService.getTreatmentPrescriptionDetail(this.treatmentPrescription.uuid)
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

  private patchFormValue(treatmentPrescriptionDetail: any) {
    this.selectedTreatment = treatmentPrescriptionDetail.treatment;
    let treatmentArray = [treatmentPrescriptionDetail.treatment];
    this.buildItemDynamicSelectionValueList(treatmentArray);

    this.newTreatmentPrescriptionForm.patchValue({
      // selectDepartment: treatmentPrescriptionDetail.prescriptionChargeable.prescription.department.uuid,
      txtTreatment: treatmentArray[0],
      txtQuantity: treatmentPrescriptionDetail.prescriptionChargeable.quantity,
      txtFirstDayQuantity: treatmentPrescriptionDetail.prescriptionChargeable.firstDayQuantity,
      selectFrequency: treatmentPrescriptionDetail.prescriptionChargeable.frequency.id,
      txtNote: treatmentPrescriptionDetail.prescriptionChargeable.prescription.reference,
      chkManualDate: treatmentPrescriptionDetail.prescriptionChargeable.manualStartDate,
      dateStartDateTime: treatmentPrescriptionDetail.prescriptionChargeable.manualStartDate ? treatmentPrescriptionDetail.prescriptionChargeable.manualStartDate : undefined,
    });
  }

  selectedTreatmentChanged(selectedTreatment: any) {
    if (selectedTreatment)
      this.selectedTreatment = selectedTreatment;
    else
      this.selectedTreatment = undefined;
  }

  private setDefaultValue() {
    //console.log(this.departmentList, this.departmentList.length);
    this.newTreatmentPrescriptionForm.patchValue({
      txtQuantity: 1,
      // selectDepartment: this.departmentList && this.departmentList.length >0? this.departmentList[0].uuid : undefined,
      //selectDepartment: this.departmentList[0].id,
    });

  }

  chkManualDateChanged(checked: boolean) {
    if (!checked) {
      this.newTreatmentPrescriptionForm.get('dateStartDateTime')!.clearValidators();
      this.newTreatmentPrescriptionForm.get('dateStartDateTime')!.markAsPristine();
    } else {
      this.newTreatmentPrescriptionForm.get('dateStartDateTime')!.setValidators(Validators.required);
      this.newTreatmentPrescriptionForm.get('dateStartDateTime')!.markAsDirty();
    }
    this.newTreatmentPrescriptionForm.get('dateStartDateTime')!.updateValueAndValidity();
  }

  // private loadDepartmentList() {
  //   let departmentFilter = {};
  //   this.basicService.getDepartmentList(departmentFilter)
  //     .subscribe(response => {
  //       if (response) {
  //         this.departmentList = response.content;
  //         this.setDefaultValue();
  //       }
  //     });
  // }

  frequencyChanged(frequencyId: any) {
    if (this.isOneOff && frequencyId) {
      let frequency = this.prescriptionService.frequencyList.find(f => f.id == frequencyId);

      if (frequency) {
        let firstDayQuantity = 1;
        if (frequency.code == 'once')
          firstDayQuantity = undefined;
        this.newTreatmentPrescriptionForm.patchValue({
          txtFirstDayQuantity: firstDayQuantity
        });
      }
    }
  }
}

import {EventEmitter, Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  //private readonly assessmentApiUrl = 'api/medicine/';
  onPrescriptionSavedEvent: EventEmitter<any> = new EventEmitter();
  frequencyList: any;
  useMethodList: any;
  public frequencyObservable: Observable<any>;
  public useMethodObservable: Observable<any>;

  callGetFrequencyListService() {
    if (!this.frequencyList) {
      this.getFrequencyList().subscribe(response => {
        if (response) {
          this.frequencyList = response.content;
        }
      });
    }
  }

  callGetUseMethodListService() {
    if (!this.useMethodObservable) {
      this.useMethodObservable = this.getUseMethodList();
      this.useMethodObservable
        .subscribe(response => {
          if (response) {
            this.useMethodList = response.content;
          }
        });
    }
  }


  constructor(private appService: AppService) {
  }

  getFrequencyList() {
    return this.appService.httpGet('api/basic/frequency');
  }

  getUseMethodList() {
    return this.appService.httpGet('api/basic/medicine_use_method');
  }

  saveMedicinePrescription(newPrescription: any) {
    return this.appService.httpPost('api/prescription/medicine/save', newPrescription);
  }

  getMedicinePrescriptionDetail(medicinePrescriptionId: any) {
    return this.appService.httpPost('api/prescription/medicine/detail/' + medicinePrescriptionId);
  }

  saveMedicineTextPrescription(newPrescription: any) {
    return this.appService.httpPost('api/prescription/medicine_text/save', newPrescription);
  }

  getMedicineTextPrescriptionDetail(medicineTextPrescriptionId: any) {
    return this.appService.httpPost('api/prescription/medicine_text/detail/' + medicineTextPrescriptionId);
  }

  saveTextPrescription(newPrescription: any) {
    return this.appService.httpPost('api/prescription/text/save', newPrescription);
  }

  getTextPrescriptionDetail(textPrescriptionId: any) {
    return this.appService.httpPost('api/prescription/text/detail/' + textPrescriptionId);
  }

  saveTreatmentPrescription(newPrescription: any) {
    return this.appService.httpPost('api/prescription/treatment/save', newPrescription);
  }

  getTreatmentPrescriptionDetail(treatmentPrescriptionId: any) {
    return this.appService.httpPost('api/prescription/treatment/detail/' + treatmentPrescriptionId);
  }

  getPatientPrescriptionList(prescriptionStatusFilter) {
    return this.appService.httpPost('api/prescription/list', prescriptionStatusFilter);
  }

  getPagedPatientPrescriptionList(filter: any, currentPageIndex: any, tablePageSize: any) {
    return this.appService.httpPost(`api/prescription/list/${currentPageIndex}/${tablePageSize}`, filter);
  }

  updatePrescriptionStatus(prescriptionList: any, actionName: any) {
    return this.appService.httpPost('api/prescription/action/' + actionName, prescriptionList);
  }

  setToGroup(prescriptionGroupList: any) {
    return this.appService.httpPost('api/prescription/group', prescriptionGroupList);
  }


  copyPrescription(prescriptionListToCopy: any) {
    return this.appService.httpPost('api/prescription/clone', prescriptionListToCopy);

  }

  getChangedPrescriptionLogList(filter: any) {
    return this.appService.httpPost('api/prescription/changed/list', filter);
  }

  getPendingExecutionPrescriptionList(filter: any, includeExecuted: any) {
    return this.appService.httpPost(`api/prescription/execution/list/${includeExecuted}`, filter);
  }

  executePrescriptionList(filter: any) {
    return this.appService.httpPost('api/prescription/execution/list/execute', filter);
  }

  getPendingPrescriptionMedicineOrderList(filter: any) {
    return this.appService.httpPost('api/prescription/medicine/order/pending/list', filter);
  }

  submitOrder(filter: any) {
    return this.appService.httpPost('api/prescription/medicine/order/submit', filter);
  }

  getPrescriptionNursingCardList(cardType: any, filter: any) {
    return this.appService.httpPost(`api/prescription/nursing/card/${cardType}`, filter);
  }


  adjustLogTime(PrescriptionChangeLogReqDto: any) {
    return this.appService.httpPost(`api/prescription/change_log/date/change`, PrescriptionChangeLogReqDto);
  }

  sign(signature: {}) {
    return this.appService.httpPost(`api/prescription/card/sign`, signature);
  }

  deleteSignature(signatureId: any) {
    return this.appService.httpPost(`api/prescription/card/sign/cancel/${signatureId}`);
  }

  adjustPrescriptionTreatmentQuantity(adjustPram: any) {
    return this.appService.httpPost(`api/prescription/treatment/adjust_quantity/set`, adjustPram);
  }

  getPatientPrescriptionDescriptionList(filter: any) {
    return this.appService.httpPost('api/prescription/list/medical_record', filter);
  }

  addNewPredefinedGroup(newGroup: any) {
    return this.appService.httpPost('api/prescription/pre_defined/group/add', newGroup);
  }

  getPreDefinedGroupList(filter: any, pageNumber: any, pageSize: any) {
    return this.appService.httpPost(`api/prescription/pre_defined/group/list/${pageNumber}/${pageSize}`, filter);
  }

  savePreDefinePrescriptionLineList(dataToSave: any) {
    return this.appService.httpPost(`api/prescription/pre_defined/group/line_list/save`, dataToSave);
  }

  loadPreDefinedPrescriptionLineList(groupId: any, groupType:any) {
    return this.appService.httpPost(`api/prescription/pre_defined/${groupType}/group/${groupId}/line/list`);
  }

  generatePrescription(patientSignInId: any, preDefinedGroupId: any, groupType:any) {
    return this.appService.httpPost(`api/prescription/pre_defined/${groupType}/group/${preDefinedGroupId}/generate_prescription/${patientSignInId}`);
  }

  generateMedicinePrescription(patientSignInId: any, preDefinedGroupId: any, groupType:any, totalFixedQuantity:any) {
    return this.appService.httpPost(`api/prescription/pre_defined/${groupType}/group/${preDefinedGroupId}/generate_prescription/${patientSignInId}/${totalFixedQuantity}`);
  }

  getFeeCount(prescriptionId: any) {
    return this.appService.httpPost(`api/prescription/${prescriptionId}/fee_count`);
  }

  restoreDisabledPrescription(prescriptionId: any) {
    return this.appService.httpPost(`api/prescription/action/disabled_restore/${prescriptionId}`);
  }

  updateStartDateInBatch(changedDateList: any) {
    return this.appService.httpPost(`api/prescription/start_date/batch_update`, changedDateList);
  }

  updateLogUser(changeUser: any) {
    return this.appService.httpPost(`api/prescription/change_log/user/update`, changeUser);
  }

  getSameGroupPrescriptionList(prescriptionId: any) {
    return this.appService.httpPost(`api/prescription/${prescriptionId}/group/all`);
  }
}

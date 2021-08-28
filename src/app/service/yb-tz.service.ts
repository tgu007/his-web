import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {AppService} from "./app.service";
import {NzModalService} from "ng-zorro-antd";

@Injectable({
  providedIn: 'root'
})
export class YbTzService {
  private readonly localUrl = 'http://127.0.0.1:8101';


  constructor(private appService: AppService,
  ) {
  }

  getLocalIpInfo() {
    return this.appService.httpPost(`yb/util/local_ip`, undefined, this.localUrl);
  }

  getCenterMedicineList() {
    return this.appService.httpPost('api/yb/medicine/center/download');
  }


  getCenterTreatmentList() {
    return this.appService.httpPost('api/yb/treatment/center/download');
  }

  getSelectionCenterMedicineList(searchCode: any, pageNumber: any, pageSize: number) {
    return this.appService.httpPost(`api/yb/medicine/list/${pageNumber}/${pageSize}`, searchCode);
  }

  getSelectionCenterTreatmentList(searchCode: any, pageNumber: any, pageSize: number) {
    return this.appService.httpPost(`api/yb/treatment/list/${pageNumber}/${pageSize}`, searchCode);
  }

  saveMedicineMatch(medicineMatch: any) {
    return this.appService.httpPost(`api/yb/medicine/match/save`, medicineMatch);
  }

  loadMatchList(medicineId: any) {
    return this.appService.httpPost(`api/yb/medicine/match/list/${medicineId}`);
  }

  getUploadedMedicineList() {
    return this.appService.httpPost('api/yb/medicine/uploaded/download');
  }

  getUploadedTreatmentList() {
    return this.appService.httpPost('api/yb/treatment/uploaded/download');
  }

  uploadALLTreatment() {
    return this.appService.httpPost('api/yb/treatment/upload/all');
  }


  uploadAllInventory(inventoryType: any) {
    return this.appService.httpPost(`api/yb/${inventoryType}/upload/all`);
  }


  matchEntity(entityType: string) {
    return this.appService.httpPost(`api/yb/${entityType}/match`);
  }

  readIcCard(clientUrl: any) {
    return this.appService.httpPost(`api/yb/patient/ic_card/read`, clientUrl);
  }

  insuranceToSelfPay(patientSignInId: any) {
    return this.appService.httpPost(`api/yb/patient/insurance_to_self/${patientSignInId}`);
  }

  selfPayToInsurance(patientSignInId: any, clientIpUrl: any) {
    return this.appService.httpPost(`api/yb/patient/self_to_insurance/${patientSignInId}`, clientIpUrl);
  }

  uploadPatientFee(patientSignInId: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/fee/upload/${patientSignInId}`);
  }

  deleteAllUploadFee(patientSignInId: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/fee/delete/${patientSignInId}`);
  }

  getPendingCancelList(cancelReq: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/fee/cancel/pending_list`, cancelReq);
  }

  uploadAllPendingFee() {
    return this.appService.httpPost(`api/yb/patient/sign_in/fee/all/upload`);
  }

  settle(signInId: any, clientIpUrl: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/settle/${signInId}`, clientIpUrl);
  }

  selfSettle(signInId: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/settle/self/${signInId}`);
  }

  saveSettlement(settlementToSave: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/settlement/save`, settlementToSave);
  }

  getPatientSignInSettlement(signInId: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/settlement/get/${signInId}`);
  }

  initializeManufacture(manufactureType: any) {
    return this.appService.httpPost(`api/yb/manufacturer/${manufactureType}/initialize`);
  }

  downloadPreSettlement(pram: {}) {
    return this.appService.httpPost(`api/yb/patient/sign_in/pre_settle/download`, pram);
  }

  downloadPatientFee(patientSignInId: any) {
    return this.appService.httpPost(`api/yb/patient/fee/download/${patientSignInId}`);
  }

  loadDownloadedFeeList(filter: any, pageNumber: any) {
    return this.appService.httpPost(`api/yb/patient/fee/download/list/${pageNumber}`, filter);
  }

  deleteCenterFee(feeId: any) {
    return this.appService.httpPost(`api/yb/patient/fee/download/cancel/${feeId}`);
  }

  initializeWarehouse() {
    return this.appService.httpPost(`api/yb/warehouse/initialize`);
  }

  uploadPrescriptionOrder() {
    return this.appService.httpPost(`api/yb/medicine/pharmacy_order/all/upload`);
  }

  uploadMedia(uploadReq: any) {
    return this.appService.httpPost(`api/yb/media/upload`, uploadReq);
  }

  downloadMedia(downloadReq: any) {
    return this.appService.httpPost(`api/yb/media/download`, downloadReq);
  }

  matchMedicine(medicineId: any) {
    return this.appService.httpPost(`api/yb/medicine/match/${medicineId}`);
  }

  matchItem(itemId: any) {
    return this.appService.httpPost(`api/yb/item/match/${itemId}`);
  }

  matchTreatment(treatmentId: any) {
    return this.appService.httpPost(`api/yb/treatment/match/${treatmentId}`);
  }

  saveDoctorAgreement(data: any) {
    return this.appService.httpPost(`api/yb/doctor/agreement/save`, data);
  }

  cancelYBSignIn(clientServerInfo: any, signInId: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/cancel/${signInId}`, clientServerInfo);
  }

  selfYBSignIn(signInId: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/self/signIn/${signInId}`);
  }

  saveYBSignInRecord(ybSignInRecord: any) {
    return this.appService.httpPost(`api/yb/patient/sign_in/record/save`, ybSignInRecord);
  }

  getSelectionIcd9List(searchFilter: any, pageNumber: any, pageSize: number) {
    return this.appService.httpPost(`api/yb/icd9/list/${pageNumber}/${pageSize}`, searchFilter);
  }

  getDrgRecordInitPram() {
    return this.appService.httpPost(`api/yb/drg_record/init_pram`);
  }

  loadMedicalRecordInfo(signInId) {
    return this.appService.httpPost(`api/yb/drg_record/medical_record_info/${signInId}`);
  }

  saveDrgRecord(data: any) {
    return this.appService.httpPost(`api/yb/drg_record/save`, data);
  }

  loadDrgRecord(drgRecordId: any) {
    return this.appService.httpPost(`api/yb/drg_record/${drgRecordId}`);
  }

  uploadDrgRecord(drgRecordId: any) {
    return this.appService.httpPost(`api/yb/drg_record/upload/${drgRecordId}`);
  }

  cancelDrgRecord(drgRecordId: any) {
    return this.appService.httpPost(`api/yb/drg_record/cancel/${drgRecordId}`);
  }

  allHisFeeDownloaded(signInId: any) {
    return this.appService.httpPost(`api/yb/patient/fee/has_download_all/${signInId}`);
  }

  allCenterFeeValidated(signInId: any) {
    return this.appService.httpPost(`api/yb/patient/fee/all_valid/${signInId}`);
  }

  calculateSettlementPayment(dateFilter: any) {
    return this.appService.httpPost(`api/yb/settlement/payment/request`, dateFilter);
  }

  cancelYBSideFee(feeId: any) {
    return this.appService.httpPost(`api/yb/fee/cancel/${feeId}`);
  }
}
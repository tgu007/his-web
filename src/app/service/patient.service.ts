import {EventEmitter, Injectable} from '@angular/core';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private appService: AppService) {
  }

  getPatientInitializeSelectionList() {
    return this.appService.httpGet('api/patient/patient_detail_prams');
  }

  savePatient(patientDetail: any) {
    return this.appService.httpPost('api/patient/save', patientDetail);
  }

  getPatientList(patientSearchDto: any, pageNumber: any) {
    return this.appService.httpPost('api/patient/all/' + pageNumber, patientSearchDto)
  }

  getSignInInitializeSelectionList() {
    return this.appService.httpGet('api/patient/sign_in/prams');
  }

  getSignOutInitializeSelectionList() {
    return this.appService.httpGet('api/patient/sign_out/prams');
  }

  saveSignIn(newSignIn: any) {
    return this.appService.httpPost('api/patient/sign_in/save', newSignIn);
  }

  getSignInDetail(patientSignInId: any) {
    return this.appService.httpPost('api/patient/sign_in/' + patientSignInId);
  }

  getPatientSignInList(pageNumber: number, searchDto: any = undefined) {
    return this.appService.httpPost('api/patient/sign_in/list/' + pageNumber, searchDto)
  }

  confirmSignIn(signInId: any, clientServerInfo: any) {
    return this.appService.httpPost('api/patient/sign_in/confirm/' + signInId, clientServerInfo);
  }


  cancelSignIn(signInId: any) {
    return this.appService.httpPost('api/patient/sign_in/cancel/' + signInId);
  }


  assignSignInBed(patientSignInBedDto: any) {
    return this.appService.httpPost('api/patient/sign_in/assign_bed', patientSignInBedDto)
  }

  getWardList(filter: any) {
    return this.appService.httpPost('api/patient/ward/list', filter);
  }

  getWardPatientTreeList(wardFilter) {
    return this.appService.httpPost('api/patient/ward/list/tree', wardFilter);
  }

  saveNursingRecord(nursingRecord: any) {
    return this.appService.httpPost('api/patient/sign_in/nursing_record/save', nursingRecord);
  }

  getNursingRecordingList(patientSignInId: any, filter: any) {
    return this.appService.httpPost(`api/patient/sign_in/nursing_record/${patientSignInId}/list`, filter);
  }

  getTempRecordingList(patientSignInId: any, filter: any) {
    return this.appService.httpPost(`api/patient/sign_in/temp_record/${patientSignInId}/list`, filter);
  }

  saveTempRecord(tempRecord: any) {
    return this.appService.httpPost('api/patient/sign_in/temp_record/save', tempRecord);
  }

  getPatientSignInWeeks(patientSingInId: any) {
    return this.appService.httpPost(`api/patient/sign_in/${patientSingInId}/weeks`);
  }

  getTempRecordingListByWeek(patientSignInId: any, weekNumber: any) {
    return this.appService.httpPost(`api/patient/sign_in/temp_record/${patientSignInId}/${weekNumber}/list`);
  }

  // getWardPatientList(wardId: any) {
  //   return this.appService.httpPost(`api/patient/sign_in/list/current/by_ward/${wardId}`);
  // }

  saveTempRecordList(temRecordList: any[]) {
    return this.appService.httpPost('api/patient/sign_in/temp_record/batch/save', temRecordList);
  }

  deleteTempRecord(tempRecordId: any) {
    return this.appService.httpPost(`api/patient/sign_in/temp_record/${tempRecordId}/delete`);
  }

  deleteNursingRecord(nursingRecordId: any) {
    return this.appService.httpPost(`api/patient/sign_in/nursing_record/${nursingRecordId}/delete`);
  }

  saveSignOut(signOutRequest: any) {
    return this.appService.httpPost(`api/patient/sign_in/sign_out_request/save`, signOutRequest);
  }

  cancelSignOut(patientSignInId: any) {
    return this.appService.httpPost(`api/patient/sign_in/${patientSignInId}/sign_out_request/cancel`);
  }

  confirmSignOut(patientSignInId: any) {
    return this.appService.httpPost(`api/patient/sign_in/${patientSignInId}/sign_out_request/confirm`);
  }

  saveMedicalRecord(medicalRecord: any) {
    return this.appService.httpPost(`api/patient/medical_record/save`, medicalRecord);
  }

  loadMedicalRecordList(patientSignInId: any, typeId: any) {
    return this.appService.httpPost(`api/patient/${patientSignInId}/medical_record/${typeId}/List`);
  }

  loadMedicalRecord(medicalRecordId: any) {
    return this.appService.httpPost(`api/patient/medical_record/${medicalRecordId}`);
  }

  deleteMedicalRecord(medicalRecordId: any) {
    return this.appService.httpPost(`api/patient/medical_record/${medicalRecordId}/delete`);
  }

  getMedicalRecordType(patientSignInId, filter) {
    return this.appService.httpPost(`api/patient/medical_record/type/list/${patientSignInId}`, filter);
  }

  updatePatientMedicalRecordCount(typeId: any, patientSignInId: any) {
    return this.appService.httpPost(`api/patient/medical_record/type/${typeId}/${patientSignInId}/count`);
  }

  newMedicalRecordFromTemplate(newMedicalRecordPram: any) {
    return this.appService.httpPost('api/patient/medical_record/new/from_template', newMedicalRecordPram);
  }

  updateMainMedicalRecordSystemValue(pram) {
    return this.appService.httpPost(`api/patient/medical_record/main/system/update`, pram);
  }

  getQrCode(patientSignInId: any) {
    return this.appService.httpPost(`api/patient/${patientSignInId}/qr_code`);
  }

  lockMedicalRecord(lockPram: {}) {
    return this.appService.httpPost(`api/patient/medical_record/lock`, lockPram);
  }

  unlockMedicalRecord(uuid: any) {
    return this.appService.httpPost(`api/patient/medical_record/unlock/${uuid}`);
  }

  getLockedInfo(medicalRecordId) {
    return this.appService.httpPost(`api/patient/medical_record/locked_time/${medicalRecordId}`);
  }

  addNewMedicalRecordTag(newTag: {}) {
    return this.appService.httpPost(`api/patient/medical_record/tag/new`, newTag);
  }

  loadMedicalRecordTagList(medicalRecordId: any) {
    return this.appService.httpPost(`api/patient/medical_record/tag/list/${medicalRecordId}`);
  }

  deleteSignOut(signOutRequestId: any) {
    return this.appService.httpPost(`api/patient/sign_in/sign_out_request/${signOutRequestId}/delete`);
  }

  validateSignOut(signOutRequestId: any) {
    return this.appService.httpPost(`api/patient/sign_in/sign_out_request/${signOutRequestId}/submit_validation`);
  }

  validateSignOutComplete(signOutRequestId: any) {
    return this.appService.httpPost(`api/patient/sign_in/sign_out_request/${signOutRequestId}/validation_complete`);
  }


  confirmWardSignOut(signOutRequestId: any) {
    return this.appService.httpPost(`api/patient/sign_in/sign_out_request/${signOutRequestId}/settle`);
  }

  saveDrgGroup(drgGroup: any) {
    return this.appService.httpPost(`api/patient/drg_group/list/save`, drgGroup);
  }

  loadDrgGroupList() {
    return this.appService.httpPost(`api/patient/drg_group/list/all`);
  }

  disableAllPrescription(signOutRequestId: any) {
    return this.appService.httpPost(`api/patient/sign_in/sign_out_request/${signOutRequestId}/disable`);
  }

  clonePatientSignIn(signInId: any) {
    return this.appService.httpPost(`api/patient/sign_in/clone/${signInId}`);
  }

  signOutCurrentBed(signInId: any) {
    return this.appService.httpPost(`api/patient/${signInId}/bed/sign_out`);
  }

  tryGetSignOutRequest(signInId: any) {
    return this.appService.httpPost(`api/patient/sign_in/sign_out_request/${signInId}`);
  }

  cloneLastSignInMedicalRecord(signInId: any, selectedMedicalRecordList: any) {
    return this.appService.httpPost(`api/patient/${signInId}/medical_record/last_sign_in/copy`, selectedMedicalRecordList);
  }

  getLastSignInMedicalRecordList(signInId: any) {
    return this.appService.httpPost(`api/patient/${signInId}/medical_record/last_sign_in/list`);
  }


}

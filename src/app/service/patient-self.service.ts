import {Injectable} from '@angular/core';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class PatientSelfService {

  constructor(private appService: AppService) {
  }

  getPatientInfo(patientSignInId) {
    return this.appService.httpPost(`public/patient/self/${patientSignInId}`);
  }

  getFeeSummaryList(patientSignInId: any, filter: any) {
    return this.appService.httpPost(`public/patient/self/${patientSignInId}/fee/summary`, filter);
  }

  getFeeDetailList(patientSignInId: any, filter: any) {
    return this.appService.httpPost(`public/patient/self/${patientSignInId}/fee/list`, filter);
  }
}

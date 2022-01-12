import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PatientService} from "../../../../service/patient.service";
import * as globals from "../../../../../globals";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-patient-sign-in-select',
  templateUrl: './patient-sign-in-select.component.html',
  styleUrls: ['./patient-sign-in-select.component.css']
})
export class PatientSignInSelectComponent implements OnInit {
  signInList: any;
  totalPatientSignInListCount: any;
  currentPageIndex: any = 1;
  tablePageSize: any = globals.tablePageSize;
  @Output() onSignInSelectedEvent = new EventEmitter<any>();
  searchCode: any;
  busy: any = false;

  constructor(private patientService: PatientService,
              public sessionService: SessionService,) {
  }

  ngOnInit() {
  }


  loadPatientSignInList() {
    let searchDto = {statusList: ["已入院"], searchCode: this.searchCode}
    if (!this.sessionService.getUserPermission().fullDepartmentPermission)
      searchDto["departmentIdList"] = this.sessionService.loginUser.departmentIdList;
    this.patientService.getPatientSignInList(this.currentPageIndex, searchDto)
      .subscribe(response => {
        if (response) {
          this.totalPatientSignInListCount = response.totalCount;
          this.signInList = response.content
        }
      });
  }

  signInSelected(patientSignIn: any) {
    this.onSignInSelectedEvent.emit(patientSignIn);
  }

}

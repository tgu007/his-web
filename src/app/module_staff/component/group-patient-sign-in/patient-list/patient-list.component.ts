import {Component, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../../../../service/patient.service";
import {PatientDetailComponent} from "../patient-detail/patient-detail.component";
import {PatientSignInDetailComponent} from "../patient-sign-in-detail/patient-sign-in-detail.component";
import * as globals from "../../../../../globals";
import {error} from "util";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  searchPatientName: any = "";
  patientList: any = [];
  patientDetailModalVisible: any = false;
  @ViewChild(PatientDetailComponent, {static: true}) patientDetailComponent: PatientDetailComponent;

  signInModalVisible: any = false;
  @ViewChild(PatientSignInDetailComponent, {static: true}) newSignInComponent: PatientSignInDetailComponent;
  //selectedPatient: any;

  patientDetailModalTitle: any;
  totalPatientListCount: any;
  currentPageIndex: any = 1;
  tablePageSize: any = globals.tablePageSize;
  isLoading: any = false;
  uiPermission;


  constructor(private patientService: PatientService,
              private message: NzMessageService,
              private sessionService: SessionService,
              public printService: PrintService,
  ) {
  }

  ngOnInit() {
    this.loadPatientList({name: "", idNumber: ""});
    this.uiPermission = this.sessionService.getUserPermission();
  }

  loadPatientList(patientSearchDto: any) {
    this.isLoading = true;
    this.patientService.getPatientList(patientSearchDto, this.currentPageIndex)
      .subscribe(response => {
          if (response) {
            this.patientList = response.content
            this.totalPatientListCount = response.totalCount;
            this.isLoading = false;
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );
  }

  reloadPatientList() {
    this.loadPatientList({name: this.searchPatientName, idNumber: ""});
  }

  addPatient() {
    this.initPatientDetailModal("添加病人", undefined);
  }


  editPatient(patient: any) {
    this.initPatientDetailModal("编辑病人", patient);
    //this.patientDetailComponent.setPatientDetailData(patient);
  }

  private initPatientDetailModal(modalTitle: any, patient: any) {
    this.patientDetailComponent.resetUi(patient);
    this.patientDetailModalTitle = modalTitle;
    this.patientDetailModalVisible = true;
  }

  handleCancel() {
    this.patientDetailModalVisible = false;
    this.signInModalVisible = false;
  }

  saveNewPatient() {
    this.patientDetailComponent.savePatient();
  }


  addSignIn(patient: any) {
    this.newSignInComponent.resetUi({uuid: undefined, patient: patient});
    this.signInModalVisible = true;
  }

  editSignIn(patient: any) {
    this.newSignInComponent.resetUi({uuid: patient.currentSignInId, patient: patient});
    this.signInModalVisible = true;
  }

  saveNewSignIn() {
    this.newSignInComponent.saveSignIn();
  }

  onNewPatientSaved(newPatient: any) {
    this.reloadPatientList();
  }

  onSignInSaved(newSignIn: any) {
    this.reloadPatientList();
  }


  printSignInDetailClicked() {
    this.handleCancel();
    this.printService.onPrintClicked.emit({
      name: 'patientSignInDetail',
      data: this.newSignInComponent.patientSignIn
    });
  }
}

import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PrescriptionMedicineDetailComponent} from "../prescription-medicine-detail/prescription-medicine-detail.component";
import {PrescriptionService} from "../../../../service/prescription.service";
import {PrescriptionTreatmentDetailComponent} from "../prescription-treatment-detail/prescription-treatment-detail.component";
import {PrescriptionTextDetailComponent} from "../prescription-text-detail/prescription-text-detail.component";
import {PrescriptionListComponent} from "../prescription-list/prescription-list.component";
import {PrescriptionTextMedicineDetailComponent} from "../prescription-text-medicine-detail/prescription-text-medicine-detail.component";
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {PatientSignInInfoComponent} from "../../group-patient-sign-in/patient-sign-in-Info/patient-sign-in-info.component";
import {SessionService} from "../../../../service/session.service";
import {PatientService} from "../../../../service/patient.service";


@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit, AfterViewInit {

  @Input() patientSignIn: any;
  medicinePrescriptionDrawerVisible: any;
  @ViewChild(PrescriptionMedicineDetailComponent, {static: true}) prescriptionMedicineDetailComponent: PrescriptionMedicineDetailComponent;

  treatmentPrescriptionDrawerVisible: any;
  @ViewChild(PrescriptionTreatmentDetailComponent, {static: true}) prescriptionTreatmentDetailComponent: PrescriptionTreatmentDetailComponent;

  textPrescriptionDrawerVisible: any;
  @ViewChild(PrescriptionTextDetailComponent, {static: true}) prescriptionTextDetailComponent: PrescriptionTextDetailComponent;

  medicineTextPrescriptionDrawerVisible: any;
  @ViewChild(PrescriptionTextMedicineDetailComponent, {static: true}) prescriptionMedicineTextDetailComponent: PrescriptionTextMedicineDetailComponent;


  @ViewChild('longTerm', {static: true}) longTermListComponent: PrescriptionListComponent;
  @ViewChild('OneOff', {static: true}) oneOffListComponent: PrescriptionListComponent;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;

  isOneOff = false;
  private keepAdding: any = true;
  isOneOffTabFirstClick: any = true;
  currentPrescriptionType: any;
  collapsed: any = false;
  @ViewChild(PatientSignInInfoComponent, {static: true}) patientSignInInfo: PatientSignInInfoComponent;
  selectedTabIndex: any = 0;
  newPrescriptionType: any;
  @Output() patientChangedEvent = new EventEmitter<any>();

  constructor(private prescriptionService: PrescriptionService,
              private sessionService: SessionService,
              private patientService: PatientService,
  ) {

  }

  ngOnInit() {
    this.subscribeNewPrescriptionSaved();
    this.patientSignInInfo.resetDisplayInfo(this.patientSignIn);
    //this.patientSignInInfo.resetDisplayInfo(this.patientSignIn);
    //console.log('abc');
  }

  ngAfterViewInit(): void {
    let wardFilter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      wardFilter['wardIdList'] = this.sessionService.loginUser.wardIdList;
    this.patientSelectComponent.loadPatientTree(wardFilter)
      .then(
        response => {
          this.patientSelectComponent.patientSelectChangedEvent.subscribe(selectedPatientIdList => {
            if (selectedPatientIdList[0] != this.patientSignIn.uuid)
              this.selectedPatientChanged(selectedPatientIdList[0])
          });
        }
      );
  }

  private selectedPatientChanged(patientSignInId: any) {
    this.patientService.getSignInDetail(patientSignInId).toPromise()
      .then(response => {
        this.patientSignIn = response.content;
        this.patientChangedEvent.emit(this.patientSignIn);
        this.longTermListComponent.patientSignIn = this.patientSignIn;
        this.oneOffListComponent.patientSignIn = this.patientSignIn;
        this.longTermListComponent.reload();
        this.oneOffListComponent.reload();
        this.patientSignInInfo.resetDisplayInfo(this.patientSignIn);
      });
  }

  private subscribeNewPrescriptionSaved() {
    this.prescriptionService.onPrescriptionSavedEvent.subscribe(newPrescription => {
      if (!this.keepAdding)
        this.closeDrawer(this.currentPrescriptionType)
      else if (this.newPrescriptionType && this.currentPrescriptionType != this.newPrescriptionType) {
        this.closeDrawer(this.currentPrescriptionType);
        this.showPrescriptionDetailComponent({type: this.newPrescriptionType});
      }
    });
  }

  closeDrawer(prescriptionType) {
    let anyPrescriptionInEdit = false;
    if (prescriptionType == "药品") {
      this.medicinePrescriptionDrawerVisible = false;
      if (!this.prescriptionMedicineDetailComponent.newMedicinePrescriptionForm.pristine)
        anyPrescriptionInEdit = true;
    } else if (prescriptionType == "药品文字") {
      if (!this.prescriptionMedicineTextDetailComponent.newTextMedicinePrescriptionForm.pristine)
        anyPrescriptionInEdit = true;
      this.medicineTextPrescriptionDrawerVisible = false;
    } else if (prescriptionType == "诊疗") {
      if (!this.prescriptionTreatmentDetailComponent.newTreatmentPrescriptionForm.pristine)
        anyPrescriptionInEdit = true;
      this.treatmentPrescriptionDrawerVisible = false;
    } else if (prescriptionType == "文字") {
      if (!this.prescriptionTextDetailComponent.newTextPrescriptionForm.pristine)
        anyPrescriptionInEdit = true;
      this.textPrescriptionDrawerVisible = false;
    }

    this.longTermListComponent.anyPrescriptionInEdit = false;
    this.oneOffListComponent.anyPrescriptionInEdit = false;
    if (anyPrescriptionInEdit) {
      if (this.selectedTabIndex == 0) {
        this.longTermListComponent.anyPrescriptionInEdit = true;
      } else
        this.oneOffListComponent.anyPrescriptionInEdit = true;

    }
  }

  selectedTabChanged(tabIndex: number) {
    if (tabIndex == 0)
      this.isOneOff = false;
    else {
      this.isOneOff = true;
      if (this.isOneOffTabFirstClick) {
        this.oneOffListComponent.subscribePatientPrescriptionList();
        this.isOneOffTabFirstClick = false;
      }
    }
  }

  showPrescriptionDetailComponent(prescription: any) {
    this.currentPrescriptionType = prescription.type;
    if (prescription.type == "药品") {
      this.medicinePrescriptionDrawerVisible = true;
      this.prescriptionMedicineDetailComponent.resetUi(prescription);
    } else if (prescription.type == "药品文字") {
      this.medicineTextPrescriptionDrawerVisible = true;
      this.prescriptionMedicineTextDetailComponent.resetUi(prescription);
    } else if (prescription.type == "诊疗") {
      this.treatmentPrescriptionDrawerVisible = true;
      this.prescriptionTreatmentDetailComponent.resetUi(prescription)
    } else if (prescription.type == "文字") {
      this.textPrescriptionDrawerVisible = true;
      this.prescriptionTextDetailComponent.resetUi(prescription);
    }
  }


  saveNewPrescription(keepAdding: boolean, newPrescriptionType: any) {
    this.keepAdding = keepAdding;
    this.newPrescriptionType = newPrescriptionType;
    //this.prescriptionDetailComponentSubmit();
    if (this.currentPrescriptionType == "药品") {
      this.prescriptionMedicineDetailComponent.submitForm();
    } else if (this.currentPrescriptionType == "药品文字") {
      this.prescriptionMedicineTextDetailComponent.submitForm();
    } else if (this.currentPrescriptionType == "诊疗") {
      this.prescriptionTreatmentDetailComponent.submitForm();
    } else if (this.currentPrescriptionType == "文字") {
      this.prescriptionTextDetailComponent.submitForm();
    }
  }

  resumePrescriptionEdit() {
    if (this.currentPrescriptionType == "药品") {
      this.medicinePrescriptionDrawerVisible = true;
    } else if (this.currentPrescriptionType == "药品文字") {
      this.medicineTextPrescriptionDrawerVisible = true;
    } else if (this.currentPrescriptionType == "诊疗") {
      this.treatmentPrescriptionDrawerVisible = true;
    } else if (this.currentPrescriptionType == "文字") {
      this.textPrescriptionDrawerVisible = true;
    }
  }

  switchClicked() {
    this.collapsed = !this.collapsed
  }
}


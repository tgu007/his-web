import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {SessionService} from "../../../../service/session.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-pre-settlement-print-selection',
  templateUrl: './pre-settlement-print-selection.component.html',
  styleUrls: ['./pre-settlement-print-selection.component.css']
})
export class PreSettlementPrintSelectionComponent implements OnInit, AfterViewInit {
  collapsed: any = false;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  isBusy: boolean = false;
  isLoading: any = false;
  patientSignInList: any;

  constructor(
    public sessionService: SessionService,
    public ybService: YbTzService,
    public printService: PrintService
  ) {
  }

  ngOnInit() {
  }

  print() {
    this.printService.onPrintClicked.emit({
      name: 'preSettlementList',
      data: {
        patientSignInList: this.patientSignInList
      }
    });

  }

  ngAfterViewInit(): void {
    let wardFilter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      wardFilter['wardIdList'] = this.sessionService.loginUser.wardIdList;
    this.patientSelectComponent.loadPatientTree(wardFilter)
      .then(
        response => {
          this.loadPatientList();
          this.patientSelectComponent.patientSelectChangedEvent.subscribe(selectedPatientIdList => {
            this.loadPatientList();
          });
        }
      );
  }

  private loadPatientList() {
    let selectedPatientList = this.patientSelectComponent.getSelectedPatientList();
    this.isLoading = true;
    this.ybService.loadPatientDetail(selectedPatientList).toPromise()
      .then(response => {
        this.isLoading = false;
        this.patientSignInList = response.content.filter(p => !p.selfPay);
      })
  }
}

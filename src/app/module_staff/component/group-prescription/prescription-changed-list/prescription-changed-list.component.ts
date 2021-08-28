import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PrescriptionService} from "../../../../service/prescription.service";
import {PatientService} from "../../../../service/patient.service";
import {DatePipe} from "@angular/common";
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {BasicService} from "../../../../service/basic.service";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-prescription-changed-list',
  templateUrl: './prescription-changed-list.component.html',
  styleUrls: ['./prescription-changed-list.component.css']
})
export class PrescriptionChangedListComponent implements OnInit, AfterViewInit {
  prescriptionChangedList: any;
  pageSize: any = 9999;
  filterDateRange: any;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  collapsed: any = false;

  constructor(private prescriptionService: PrescriptionService,
              private datePipe: DatePipe,
              public sessionService: SessionService,
              public printService: PrintService,
  ) {

    //this.loadChangedPrescriptionLogList(this.getFilter());

  }


  ngOnInit() {
    let currentDateTime = new Date();
    let yesterdayDateTime = currentDateTime.setDate(currentDateTime.getDate() - 1);
    this.filterDateRange = [yesterdayDateTime, new Date()]

  }


  ngAfterViewInit(): void {

    let wardFilter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      wardFilter['wardIdList'] = this.sessionService.loginUser.wardIdList;
    this.patientSelectComponent.loadPatientTree(wardFilter)
      .then(
        response => {
          this.loadChangedPrescriptionLogList();
          this.patientSelectComponent.patientSelectChangedEvent.subscribe(selectedPatientIdList => {
            this.loadChangedPrescriptionLogList();
          });
        }
      );
  }


  loadChangedPrescriptionLogList() {
    this.prescriptionService.getChangedPrescriptionLogList(this.getFilter())
      .subscribe(response => {
        if (response) {
          this.prescriptionChangedList = response.content;
        }
      });

  }

  dateOkClicked(date: any) {
    this.loadChangedPrescriptionLogList();
  }

  getFilter() {
    let filterDto = {
      changedStartDate: this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss'),
      changedEndDate: this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss'),
      patientSignInIdList: this.patientSelectComponent.getSelectedPatientList(),
      //departmentId: this.selectDepartment.uuid,
    };
    if (!this.sessionService.getUserPermission().fullDepartmentPermission)
      filterDto["departmentIdList"] = this.sessionService.loginUser.departmentIdList
    return filterDto;
  }


  print() {
    this.printService.onPrintClicked.emit({
      name: 'changedPrescriptionList',
      data: {
        prescriptionChangedList: this.prescriptionChangedList,
        dateRange: this.datePipe.transform(this.filterDateRange[0], 'yyyy/MM/dd HH:mm') + '-' + this.datePipe.transform(this.filterDateRange[1], 'yyyy/MM/dd HH:mm'),
      }
    });
  }
}

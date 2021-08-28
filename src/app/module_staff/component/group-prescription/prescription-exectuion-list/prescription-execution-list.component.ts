import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {PrescriptionService} from "../../../../service/prescription.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";
import {PatientService} from "../../../../service/patient.service";

@Component({
  selector: 'app-prescription-execution-list',
  templateUrl: './prescription-execution-list.component.html',
  styleUrls: ['./prescription-execution-list.component.css']
})
export class PrescriptionExecutionListComponent implements OnInit, AfterViewInit {

  prescriptionExecutionList: any;
  pageSize: any = 9999;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  collapsed: any = false;
  allChecked: any = true;
  mapOfCheckedId: { [key: string]: boolean } = {};
  mapOfChildCheckedId: { [key: string]: boolean } = {};
  dateFeeDate: any;
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };
  chkCatchUpExecution: any;
  busy: any = false;

  constructor(private prescriptionService: PrescriptionService,
              private basicService: BasicService,
              private message: NzMessageService,
              private datePipe: DatePipe,
              public sessionService: SessionService,
              public printService: PrintService,
              private patientService: PatientService,
  ) {
  }

  ngOnInit() {
    let today = new Date();
    this.dateFeeDate = today.setDate(today.getDate() - 1);

  }

  ngAfterViewInit(): void {
    let wardFilter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      wardFilter['wardIdList'] = this.sessionService.loginUser.wardIdList;
    this.patientSelectComponent.loadPatientTree(wardFilter)
      .then(
        response => {
          this.loadPendingExecutionPrescriptionList();
          this.patientSelectComponent.patientSelectChangedEvent.subscribe(selectedPatientIdList => {
            this.loadPendingExecutionPrescriptionList();
          });
        }
      );
  }

  loadPendingExecutionPrescriptionList() {
    this.busy = true;
    this.prescriptionService.getPendingExecutionPrescriptionList(this.getFilter(), this.chkIncludeExecuted)
      .subscribe(response => {
        if (response) {
          this.busy = false;
          this.prescriptionExecutionList = response.content;
          this.checkAll(true);
        }
      });

  }

  getFilter() {
    let filterDto = {
      patientSignInIdList: this.patientSelectComponent.getSelectedPatientList(),
      //departmentId: this.selectDepartment.uuid,
      recordFeeDate: this.chkCatchUpExecution ? this.datePipe.transform(this.dateFeeDate, 'yyyy-MM-dd HH:mm:ss') : undefined,
    };
    if (!this.sessionService.getUserPermission().fullDepartmentPermission)
      filterDto["departmentIdList"] = this.sessionService.loginUser.departmentIdList
    return filterDto;
  }

  checkAll(checked: boolean) {
    this.prescriptionExecutionList.forEach(data => {
      this.mapOfCheckedId[data.listRespDto.uuid] = checked;
      this.checkChildAll(data, checked);
    });

  }

  checkChildAll(data: any, checked: boolean) {
    if (data.childTreatmentList != null) {
      data.childTreatmentList.forEach(ct => {
        this.mapOfChildCheckedId[data.listRespDto.uuid + ':' + ct.uuid] = checked;
      });
    }
  }

  refreshPrescriptionCheckStatus(data: any) {
    this.mapOfCheckedId[data.listRespDto.uuid] = false;
    for (let t of data.childTreatmentList) {
      if (this.mapOfChildCheckedId[data.listRespDto.uuid + ':' + t.uuid] == true) {
        this.mapOfCheckedId[data.listRespDto.uuid] = true;
        break;
      }
    }

  }

  mapOfExpandData: { [key: string]: boolean } = {};
  chkIncludeExecuted: any = false;

  executePrescription() {
    let selectedPrescriptionList: [] = this.prescriptionExecutionList.filter(prescription => this.mapOfCheckedId[prescription.listRespDto.uuid]);
    if (selectedPrescriptionList.length == 0) {
      this.message.create("warning", `没有选中的医嘱`);
      return;
    }

    let executionList: any = []
    for (let selectedPrescription of selectedPrescriptionList) {
      let executionDto = {
        uuid: selectedPrescription["listRespDto"]["uuid"],
        executionQuantity: selectedPrescription["allowedExecutionCount"]
      };

      let childTreatmentList: any = selectedPrescription["childTreatmentList"];
      if (childTreatmentList) {
        let selectedChildTreatmentList = childTreatmentList.filter(ct => this.mapOfChildCheckedId[selectedPrescription["listRespDto"]["uuid"] + ':' + ct.uuid]);

        executionDto["childTreatmentIdList"] = selectedChildTreatmentList.map((ct) => {
          return ct.uuid;
        });
      }
      executionList.push(executionDto);
    }

    this.busy = true;
    this.prescriptionService.executePrescriptionList({
      prescriptionExecutionList: executionList,
      feeDate: this.chkCatchUpExecution ? this.datePipe.transform(this.dateFeeDate, 'yyyy-MM-dd HH:mm:ss') : undefined
    })
      .subscribe(response => {
          this.message.create("success", `执行成功`);
          this.busy = false;
          this.loadPendingExecutionPrescriptionList();
        },
        error => {
          this.message.create("error", error.error.message);
          this.busy = false;
        }
      );

  }

  anyComboPrescription() {
    if (this.prescriptionExecutionList && this.prescriptionExecutionList.find(p => p.childTreatmentList && p.childTreatmentList.length > 0))
      return true;
    return false;
  }


  printClicked(prescription) {
    this.busy = true;
    this.patientService.getSignInDetail(prescription.patientSignInId).subscribe(
      response => {
        this.busy = false;
        this.printService.onPrintClicked.emit({
          name: 'pendingExecutionPrescription',
          data: {
            prescription: prescription,
            patientSignIn: response.content
          }
        });
      }
    );

  }
}

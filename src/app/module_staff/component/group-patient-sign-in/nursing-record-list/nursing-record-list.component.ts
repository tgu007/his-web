import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PatientDetailComponent} from "../patient-detail/patient-detail.component";
import {NursingRecordDetailComponent} from "../nursing-record-detail/nursing-record-detail.component";
import {PatientService} from "../../../../service/patient.service";
import {DatePipe} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";

@Component({
  selector: 'app-nursing-record-list',
  templateUrl: './nursing-record-list.component.html',
  styleUrls: ['./nursing-record-list.component.css']
})
export class NursingRecordListComponent implements OnInit, AfterViewInit {
  @Input() patientSignIn: any;
  nursingRecordList: any;
  detailModalVisible: any = false;
  @ViewChild(NursingRecordDetailComponent, {static: true}) nursingRecordDetailComponent: NursingRecordDetailComponent;
  filterDateRange: any;
  collapsed: any = true;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  @Output() patientChangedEvent = new EventEmitter<any>();

  constructor(private patientService: PatientService,
              private datePipe: DatePipe,
              private message: NzMessageService,
              public sessionService: SessionService,
              public printService: PrintService
  ) {
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

  ngOnInit() {
    this.loadNursingRecordList();
  }

  handleCancel() {
    this.detailModalVisible = false;
  }

  saveNursingRecord() {
    this.nursingRecordDetailComponent.saveDetail()
  }

  newNursingRecord() {
    this.nursingRecordDetailComponent.resetUi({uuid: undefined});
    this.detailModalVisible = true;
  }

  private loadNursingRecordList() {
    let filter = {};
    if (this.filterDateRange != undefined) {
      filter["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filter["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }


    this.patientService.getNursingRecordingList(this.patientSignIn.uuid, filter)
      .subscribe(response => {
        if (response) {
          this.nursingRecordList = response.content
        }
      });
  }

  editNursingRecord(nursingRecord) {
    this.nursingRecordDetailComponent.resetUi(nursingRecord);
    this.detailModalVisible = true;
  }

  onNursingRecordSaved() {
    this.loadNursingRecordList();
  }

  searchClicked() {
    this.loadNursingRecordList();
  }

  deleteNursingRecord(data) {
    this.patientService.deleteNursingRecord(data.uuid)
      .subscribe(response => {
        this.message.create("success", "删除成功");
        this.loadNursingRecordList();
      });
  }

  printClicked() {
    let cloneList = this.nursingRecordList.concat();
    //let reversedList = this.nursingRecordList.reverse();
    this.printService.onPrintClicked.emit({
      name: 'nursingRecordList',
      data: {
        nursingRecordList: cloneList.reverse(),
        patientSignIn: this.patientSignIn,
      }
    });
  }

  private selectedPatientChanged(patientSignInId: any) {
    this.patientService.getSignInDetail(patientSignInId).toPromise()
      .then(response => {
        this.patientSignIn = response.content;
        this.patientChangedEvent.emit(this.patientSignIn);
        this.loadNursingRecordList();
      });
  }
}

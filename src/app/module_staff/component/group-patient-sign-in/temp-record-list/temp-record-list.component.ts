import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {TempRecordDetailComponent} from "../temp-record-detail/temp-record-detail.component";
import {PatientService} from "../../../../service/patient.service";
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {TempRecordListBatchComponent} from "../temp-record-list-batch/temp-record-list-batch.component";
import {NzMessageService} from "ng-zorro-antd";
import {TempRecordChartComponent} from "../temp-record-chart/temp-record-chart.component";
import {TempRecordTableListComponent} from "../temp-record-table-list/temp-record-table-list.component";
import {SessionService} from "../../../../service/session.service";


@Component({
  selector: 'app-temp-record-list',
  templateUrl: './temp-record-list.component.html',
  styleUrls: ['./temp-record-list.component.css']
})
export class TempRecordListComponent implements OnInit, AfterViewInit {
  @Input() patientSignIn: any;
  @Input() showBatchInputTab: any = false;
  detailModalVisible: any;
  @ViewChild(TempRecordDetailComponent, {static: true}) tempRecordDetailComponent: TempRecordDetailComponent;
  collapsed: any = false;
  @ViewChild(PatientSelectComponent, {static: false}) patientSelectComponent: PatientSelectComponent;
  @ViewChild(TempRecordListBatchComponent, {static: false}) tempRecordListBatchComponent: TempRecordListBatchComponent;
  @ViewChild(TempRecordChartComponent, {static: false}) tempRecordChartComponent: TempRecordChartComponent;
  @ViewChild(TempRecordTableListComponent, {static: false}) tempRecordTableListComponent: TempRecordTableListComponent;
  selectedTabIndex: any = 0;
  // wardList: any;
  // selectWard: any;
  loading: any = false;


  constructor(private patientService: PatientService,
              private message: NzMessageService,
              public sessionService: SessionService,) {
  }

  ngOnInit() {
    if (!this.showBatchInputTab) {
      this.selectedTabIndex = 1;
    }
  }

  ngAfterViewInit(): void {
    if (this.showBatchInputTab) {
      let wardFilter = {};
      if (!this.sessionService.getUserPermission().fullWardPermission)
        wardFilter['wardIdList'] = this.sessionService.loginUser.wardIdList;
      this.patientSelectComponent.loadPatientTree(wardFilter);
      this.subscribePatientSelectChange();
    }
  }


  subscribePatientSelectChange() {

    this.patientSelectComponent.patientSelectChangedEvent.subscribe(nodeList => {
        if (nodeList.length > 0) {
          if (nodeList[0].level == 2) {
            this.loading = true;
            this.patientService.getSignInDetail(nodeList[0].key)
              .subscribe(response => {
                this.loading = false;
                if (response) {
                  this.patientSignIn = response.content;
                  this.forceChildComponentUpdate();
                }
              });
          } else {
            this.patientSignIn = undefined;
            this.forceChildComponentUpdate();
          }
        }
      }
    );
  }


  //Todo should changed to setter() on child
  private forceChildComponentUpdate() {
    this.tempRecordTableListComponent.patientSignIn = this.patientSignIn;
    this.tempRecordChartComponent.patientSignIn = this.patientSignIn;
    this.reloadUi(true, false);
  }

  newTempRecord() {
    this.tempRecordDetailComponent.resetUi({uuid: undefined});
    this.detailModalVisible = true;
  }

  handleCancel() {
    this.detailModalVisible = false;
  }

  saveTempRecord() {
    this.tempRecordDetailComponent.saveDetail()
  }

  reloadUi(reloadChartWeek: boolean, reloadBatchInputTab: boolean) {
    // if (this.showBatchInputTab && reloadBatchInputTab)
    //   this.tempRecordListBatchComponent.selectWardChanged(this.selectWard, this.wardList);
    this.tempRecordTableListComponent.loadTempRecordList();
    this.tempRecordChartComponent.reloadUi(reloadChartWeek);
  }

  menuClicked(menuIndex: number) {
    this.selectedTabIndex = menuIndex;
  }

  editTempRecord(tempRecord) {
    this.tempRecordDetailComponent.resetUi(tempRecord);
    this.detailModalVisible = true;
  }

  batchInputSaved() {
    this.reloadUi(false, false);
  }
}

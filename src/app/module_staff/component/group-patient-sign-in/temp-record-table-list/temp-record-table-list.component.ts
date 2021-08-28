import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {PatientService} from "../../../../service/patient.service";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-temp-record-table-list',
  templateUrl: './temp-record-table-list.component.html',
  styleUrls: ['./temp-record-table-list.component.css']
})
export class TempRecordTableListComponent implements OnInit {
  @Input() patientSignIn: any;
  @Output() newTempRecordEvent = new EventEmitter<any>();
  @Output() editTempRecordEvent = new EventEmitter<any>();
  filterDateRange: any;
  tempRecordList: any;
  @Output() refreshRequiredEvent = new EventEmitter<any>();
  loading: any = false;


  constructor(public datePipe: DatePipe,
              private patientService: PatientService,
              private message: NzMessageService,
              public sessionService: SessionService,
  ) {
  }

  ngOnInit() {
    if (this.patientSignIn)
      this.loadTempRecordList();
  }

  newTempRecordClicked() {
    this.newTempRecordEvent.emit();
  }

  searchClicked() {
    this.loadTempRecordList();
  }

  loadTempRecordList() {
    this.tempRecordList = [];

    if (this.patientSignIn) {
      let filter = {};
      if (this.filterDateRange != undefined) {
        filter["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
        filter["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
      }

      this.loading = true;
      this.patientService.getTempRecordingList(this.patientSignIn.uuid, filter)
        .subscribe(response => {
          if (response) {
            this.tempRecordList = response.content
          }
          this.loading = false;
        });
    }
  }

  editTempRecord(tempRecord) {
    this.editTempRecordEvent.emit(tempRecord);
  }

  deleteTempRecord(data) {
    this.patientService.deleteTempRecord(data.uuid)
      .subscribe(response => {
        this.message.create("success", "删除成功");
        this.refreshRequiredEvent.emit();
        //this.loadTempRecordList();
      });
  }
}

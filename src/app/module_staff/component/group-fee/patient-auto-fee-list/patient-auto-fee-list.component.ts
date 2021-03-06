import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PatientFeeDetailComponent} from "../patient-fee-detail/patient-fee-detail.component";
import {FeeService} from "../../../../service/fee.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import * as globals from "../../../../../globals";

@Component({
  selector: 'app-patient-auto-fee-list',
  templateUrl: './patient-auto-fee-list.component.html',
  styleUrls: ['./patient-auto-fee-list.component.css']
})
export class PatientAutoFeeListComponent implements OnInit {
  @Input() patientSignIn: any;
  autoFeeList: any;
  totalAutoFeeListCount: any;
  currentTblAutoFeeListPageIndex: any = 1;
  @ViewChild(PatientFeeDetailComponent, {static: true}) patientAutoFeeDetailComponent: PatientFeeDetailComponent;
  drawerVisible = false;
  tablePageSize: any = globals.tablePageSize;
  busy: any = false;

  constructor(private feeService: FeeService,
              private message: NzMessageService, private datePipe: DatePipe,
              private modal: NzModalService
  ) {
  }

  ngOnInit() {
    this.subscribeAutoFeeList({});
  }

  addNewAutoFee(entityType: any) {
    this.drawerVisible = true;
    this.patientAutoFeeDetailComponent.resetDrawerUI(entityType);
  }

  subscribeAutoFeeList(filterDto: any) {
    this.busy = true
    this.feeService.getAutoFeeList(this.patientSignIn.uuid, this.currentTblAutoFeeListPageIndex, filterDto)
      .subscribe(response => {
        this.busy = false;
        if (response) {
          this.autoFeeList = response.content
          this.totalAutoFeeListCount = response.totalCount;
        }
      });
  }

  close() {
    this.drawerVisible = false;
  }

  createNewAutoFee() {
    this.patientAutoFeeDetailComponent.createNewFee();
  }

  feeCreated($event: any) {
    this.subscribeAutoFeeList({});
    this.drawerVisible = false;
  }


  enableChanged(autoFee) {
    if (autoFee.enabled) {
      this.feeService.enableAutoFee(autoFee.uuid)
        .subscribe(response => {
          this.message.create("success", "????????????");
        });
    } else {
      this.feeService.disableAutoFee(autoFee.uuid)
        .subscribe(response => {
          this.message.create("success", "????????????");
        });
    }
  }

  autoFeeManualRun(autoFee: any) {
    this.modal.confirm({
      nzContent: '?????????????????????????????????????????????,??????????????????????????????????????????????????????????????????????????????',
      nzOnOk: () => {
        this.busy = true
        this.feeService.autoFeeManualRun(autoFee.uuid)
          .subscribe(response => {
            this.busy = false;
            this.message.create("success", "??????????????????");
          });
      }
    });
  }
}

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
          this.message.create("success", "启用成功");
        });
    } else {
      this.feeService.disableAutoFee(autoFee.uuid)
        .subscribe(response => {
          this.message.create("success", "停用成功");
        });
    }
  }

  autoFeeManualRun(autoFee: any) {
    this.modal.confirm({
      nzContent: '手动运行会根据此项自动计费设置,生成从自动计费开始日期到今日的所有费用，点击确定执行',
      nzOnOk: () => {
        this.busy = true
        this.feeService.autoFeeManualRun(autoFee.uuid)
          .subscribe(response => {
            this.busy = false;
            this.message.create("success", "费用生成完成");
          });
      }
    });
  }
}

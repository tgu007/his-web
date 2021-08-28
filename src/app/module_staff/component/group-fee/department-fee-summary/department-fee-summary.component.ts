import {Component, OnInit} from '@angular/core';
import {FeeService} from "../../../../service/fee.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {BasicService} from "../../../../service/basic.service";
import * as dateFunction from 'date-fns';

@Component({
  selector: 'app-department-fee-summary',
  templateUrl: './department-fee-summary.component.html',
  styleUrls: ['./department-fee-summary.component.css']
})
export class DepartmentFeeSummaryComponent implements OnInit {
  filterDateRange: any;
  filterFeeName: any;
  selectedDepartment: any;
  feeDepartmentList: any;
  listOfSelectedFeeType: any;
  feeTypeList: any;
  feeListByType: any;
  isLoading: any = false;


  constructor(
    private feeService: FeeService,
    private message: NzMessageService, private datePipe: DatePipe,
    private sessionService: SessionService,
    private basicService: BasicService,
  ) {
  }

  ngOnInit() {
    this.filterDateRange = [dateFunction.startOfMonth(new Date()), dateFunction.endOfMonth(new Date())]
    this.loadDepartmentList();
  }


  private subscribeFeeTypeList() {
    if (!this.selectedDepartment)
      return;
    let filter = {};
    filter["departmentIdList"] = [this.selectedDepartment];
    if (this.filterDateRange != undefined) {
      filter["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filter["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }
    this.feeService.getDepartmentFeeTypeList(filter)
      .subscribe(response => {
        if (response) {
          this.feeTypeList = response.content;
          this.reload();
        }
      });
  }

  private loadDepartmentList() {
    let departmentFilter = {};
    departmentFilter["departmentType"] = '诊疗'
    if (!this.sessionService.loginUser.uiPermission.fullDepartmentPermission)
      departmentFilter["departmentTreatmentIdList"] = this.sessionService.loginUser.departmentIdList;

    this.basicService.getDepartmentList(departmentFilter)
      .subscribe(response => {
        if (response) {
          this.feeDepartmentList = response.content;
          if (this.feeDepartmentList.length > 0) {
            this.selectedDepartment = this.feeDepartmentList[0].uuid;
            this.subscribeFeeTypeList();
          }
        }
      });
  }

  reload() {
    let filterDto = {};
    filterDto["departmentIdList"] = [this.selectedDepartment];
    if (this.filterDateRange != undefined) {
      filterDto["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filterDto["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }

    filterDto["feeStatusList"] = ['正常']
    filterDto["feeTypeList"] = this.listOfSelectedFeeType
    if (this.filterFeeName != undefined && this.filterFeeName != "")
      filterDto["searchCode"] = this.filterFeeName

    this.isLoading = true;
    this.feeService.getDepartmentFeeList(filterDto)
      .subscribe(response => {
          if (response) {
            this.feeListByType = response.content;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );

  }

  selectedDepartmentChanged() {
    this.listOfSelectedFeeType = undefined;
    this.feeTypeList = undefined;
    this.feeTypeList = undefined;
    this.filterFeeName = undefined;
    this.subscribeFeeTypeList();
  }
}

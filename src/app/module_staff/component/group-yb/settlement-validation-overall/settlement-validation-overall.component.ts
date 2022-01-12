import {Component, OnInit} from '@angular/core';
import {BasicService} from "../../../../service/basic.service";
import * as dateFunction from 'date-fns';
import {DatePipe} from "@angular/common";
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-settlement-validation-overall',
  templateUrl: './settlement-validation-overall.component.html',
  styleUrls: ['./settlement-validation-overall.component.css']
})
export class SettlementValidationOverallComponent implements OnInit {
  selectInsuranceType: any;
  insuranceTypeList: any;
  txtSetlOption: any = '430405'; //结算方式
  filterDateRange: any;
  result: any = '';
  busy: any = false;
  settledPatientList: any;

  constructor(private basicService: BasicService,
              private datePipe: DatePipe,
              public ybService: YbTzService,
              private message: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.filterDateRange = [dateFunction.startOfMonth(new Date()), dateFunction.endOfMonth(new Date())]
    this.basicService.getInsuranceTypeList()
      .subscribe(response => {
        if (response) {
          this.insuranceTypeList = response.content;
          //if(this.insuranceTypeList.size >0)
          this.selectInsuranceType = this.insuranceTypeList.find(i => i.defaultSelection === true);
        }
      });
  }

  validate() {
    this.result = ''
    this.settledPatientList = undefined;
    let pram = {};
    pram['insutype'] = this.selectInsuranceType.extraInfo;
    pram['insutypeId'] = this.selectInsuranceType.id;
    pram['setl_optins'] = this.txtSetlOption;
    pram['stmt_begndate'] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd');
    pram['stmt_enddate'] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd');
    this.busy = true;
    this.ybService.validateOverALL(pram)
      .subscribe(response => {
          this.busy = false;
          if (response.content.errorMessage)
            this.result = response.content.errorMessage;
          else
            this.result = "对账成功，没有错误";
          this.settledPatientList =response.content.settledPatientList;
          //this.message.success("对账成功，没有错误");
          //this.result = "对账成功，没有错误";
        },
        error => {
          this.busy = false;
          this.message.error(error.error.message);
          //this.result =error.error.message;
        });

  }

  validateDetail() {
    this.result = ''
    let pram = {};
    pram['setl_optins'] = this.txtSetlOption;
    pram['stmt_begndate'] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd');
    pram['stmt_enddate'] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd');
    this.ybService.validateDetail(pram)
      .subscribe(response => {
          this.message.success("明细账目已下载");
        },
        error => {
          this.message.error(error.error.message);
        });

  }
}

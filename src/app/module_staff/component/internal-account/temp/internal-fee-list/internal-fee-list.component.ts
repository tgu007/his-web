import {Component, OnInit, ViewChild} from '@angular/core';
import * as globals from "../../../../../../globals";
import {InternalAutoFeeDetailComponent} from "../internal-auto-fee-detail/internal-auto-fee-detail.component";
import {InternalFeeDetailComponent} from "../internal-fee-detail/internal-fee-detail.component";
import {InternalAccountService} from "../../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-internal-fee-list',
  templateUrl: './internal-fee-list.component.html',
  styleUrls: ['./internal-fee-list.component.css']
})
export class InternalFeeListComponent implements OnInit {
  filterDateRange: any = [];
  filterFeeName: any;
  listOfSelectedFeeStatus: any = ['正常'];
  filterSignInNumber: any;
  filterPatientInfo: any;
  isLoading: any = false;
  feeList: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  totalDataCount: any;
  feeDetailModalVisible: any = false;
  @ViewChild(InternalFeeDetailComponent, {static: true}) feeDetailComponent: InternalFeeDetailComponent;
  totalFeeAmount: any;

  constructor(private internalAccountService: InternalAccountService,
              private message: NzMessageService,
              private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.loadFeeList();
  }

  searchFee() {
    this.currentPageIndex = 1
    this.loadFeeList();
  }

  initFeeDetailModal() {
    this.feeDetailComponent.resetUI();
    this.feeDetailModalVisible = true;
  }

  reloadFeeClicked() {
    this.filterSignInNumber = undefined
    this.filterPatientInfo = undefined
    this.filterFeeName = undefined
    this.filterDateRange = [];
    this.listOfSelectedFeeStatus = ['正常']
    this.loadFeeList();
  }

  loadFeeList() {

    let filter = {};
    if (this.filterSignInNumber != undefined && this.filterSignInNumber != '')
      filter['signInNumber'] = this.filterSignInNumber;

    if (this.filterPatientInfo != undefined && this.filterPatientInfo != '')
      filter['patientInfo'] = this.filterPatientInfo;

    if (this.filterFeeName != undefined && this.filterFeeName != '')
      filter['itemName'] = this.filterFeeName;

    if (this.filterDateRange != undefined) {
      filter["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filter["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }

    if (this.listOfSelectedFeeStatus != undefined && this.listOfSelectedFeeStatus.length > 0)
      filter["feeStatusList"] = this.listOfSelectedFeeStatus

    this.isLoading = true;
    this.internalAccountService.getPagedFeeList(filter, this.currentPageIndex)
      .subscribe(response => {
          if (response) {
            this.feeList = response.content.feeList.content;
            this.totalDataCount = response.content.feeList.totalCount;
            this.totalFeeAmount = response.content.totalAmount;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  cancelFee(data: any) {
    this.isLoading = true;
    this.internalAccountService.cancelFee(data.uuid)
      .subscribe(response => {
          this.loadFeeList();
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  handleCancel() {
    this.feeDetailModalVisible = false;
  }

  saveFee() {
    this.feeDetailComponent.saveFee();
  }

  onFeeSaved($event: any) {
    this.loadFeeList();
  }
}

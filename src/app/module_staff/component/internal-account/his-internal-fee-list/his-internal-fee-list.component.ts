import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as globals from "../../../../../globals";
import {InternalFeeDetailComponent} from "../temp/internal-fee-detail/internal-fee-detail.component";
import {InternalAccountService} from "../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {HisInternalFeeDetailComponent} from "../his-internal-fee-detail/his-internal-fee-detail.component";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-his-internal-fee-list',
  templateUrl: './his-internal-fee-list.component.html',
  styleUrls: ['./his-internal-fee-list.component.css']
})
export class HisInternalFeeListComponent implements OnInit {
  @Input() patientSignIn: any;
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
  @ViewChild(HisInternalFeeDetailComponent, {static: true}) feeDetailComponent: HisInternalFeeDetailComponent;
  totalFeeAmount: any;
  printButtonText: any = '打印';

  constructor(private internalAccountService: InternalAccountService,
              private message: NzMessageService,
              private datePipe: DatePipe,
              public printService: PrintService,
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
    this.filterFeeName = undefined
    this.filterDateRange = [];
    this.listOfSelectedFeeStatus = ['正常']
    this.loadFeeList();
  }

  loadFeeList() {

    let filter = {};
    filter['patientSignInId'] = this.patientSignIn.uuid;
    if (this.filterFeeName != undefined && this.filterFeeName != '')
      filter['itemName'] = this.filterFeeName;

    if (this.filterDateRange != undefined) {
      filter["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filter["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }

    if (this.listOfSelectedFeeStatus != undefined && this.listOfSelectedFeeStatus.length > 0)
      filter["feeStatusList"] = this.listOfSelectedFeeStatus

    this.isLoading = true;
    this.internalAccountService.getHisPagedFeeList(filter, this.currentPageIndex)
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
    this.internalAccountService.cancelHisFee(data.uuid)
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


  printClicked() {
    this.isLoading = true;
    this.printButtonText = '加载数据'
    this.internalAccountService.getFeeSummaryList(this.patientSignIn.uuid)
      .subscribe(response => {
          this.isLoading = false;
          if (response) {
            this.printService.onPrintClicked.emit({
              name: 'internalFeeSummaryList',
              data: {
                internalFeeSummaryList: response.content,
                patientSignIn: this.patientSignIn,
              }
            });
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.printButtonText = '打印'
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.printButtonText = '打印'
        }
      );
  }
}

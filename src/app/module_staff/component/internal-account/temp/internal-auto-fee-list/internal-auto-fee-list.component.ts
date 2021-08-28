import {Component, OnInit, ViewChild} from '@angular/core';
import * as globals from "../../../../../../globals";
import {ChargeableItemDetailComponent} from "../../chargeable-item-detail/chargeable-item-detail.component";
import {InternalAutoFeeDetailComponent} from "../internal-auto-fee-detail/internal-auto-fee-detail.component";
import {InternalAccountService} from "../../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-internal-auto-fee-list',
  templateUrl: './internal-auto-fee-list.component.html',
  styleUrls: ['./internal-auto-fee-list.component.css']
})
export class InternalAutoFeeListComponent implements OnInit {
  filterSignInNumber: any;
  filterPatientInfo: any;
  isLoading: any = false;
  autoFeeList: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  totalDataCount: any;
  autoFeeDetailModalVisible: any = false;
  @ViewChild(InternalAutoFeeDetailComponent, {static: true}) autoFeeDetailComponent: InternalAutoFeeDetailComponent;

  constructor(private internalAccountService: InternalAccountService,
              private message: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.loadAutoFeeList();
  }

  searchAutoFee() {
    this.currentPageIndex = 1
    this.loadAutoFeeList();
  }

  initAutoFeeDetailModal(autoFee = undefined) {
    this.autoFeeDetailComponent.resetUI(autoFee);
    this.autoFeeDetailModalVisible = true;
  }

  reloadAutoFeeClicked() {
    this.filterSignInNumber = undefined
    this.filterPatientInfo = undefined
    this.loadAutoFeeList();
  }

  loadAutoFeeList() {
    this.isLoading = true;
    let filter={};
    if (this.filterSignInNumber != undefined && this.filterSignInNumber != '')
      filter['signInNumber'] = this.filterSignInNumber;

    if (this.filterPatientInfo != undefined && this.filterPatientInfo != '')
      filter['patientInfo'] = this.filterPatientInfo;

    this.internalAccountService.getPagedAutoFeeList(filter, this.currentPageIndex)
      .subscribe(response => {
          if (response) {
            this.autoFeeList = response.content;
            this.totalDataCount = response.totalCount;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  handleCancel() {
    this.autoFeeDetailModalVisible = false;
  }

  saveAutoFee() {
    this.autoFeeDetailComponent.saveAutoFee();
  }

  onAutoFeeSaved($event: any) {
    this.autoFeeDetailModalVisible = false;
    this.loadAutoFeeList();
  }
}

import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as globals from "../../../../../globals";
import {TransferDetailComponent} from "../transfer-detail/transfer-detail.component";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.css']
})
export class TransferListComponent implements OnInit {
  itemTransferList: any;
  transferDetailVisible: any = false;
  @ViewChild(TransferDetailComponent, {static: true}) transferDetailComponent: TransferDetailComponent;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  @Input() fromWarehouseType: any;
  @Input() toWarehouseType: any;
  @Input() transferType: any; //0 transfer in 1 transfer out
  selectWarehouse: any;
  warehouseList: any;
  @Input() orderType
  isLoading: any = false;
  filterDateRange: any;

  constructor(private inventoryService: InventoryService,
              private basicService: BasicService,
              private message: NzMessageService,
              private datePipe: DatePipe,
              public sessionService: SessionService,) {
  }

  ngOnInit() {
    this.loadWarehouseList();
    //this.loadTransferList();
  }

  private loadWarehouseList() {
    let warehouseFilter;
    if (this.transferType == 'in')
      warehouseFilter = {warehouseTypeList: this.toWarehouseType};
    else
      warehouseFilter = {warehouseTypeList: this.fromWarehouseType};

    if (!this.sessionService.getUserPermission().fullWarehousePermission)
      warehouseFilter["warehouseIdList"] = this.sessionService.loginUser.warehouseIdList;


    this.basicService.getWarehouseList(warehouseFilter)
      .subscribe(response => {
        if (response) {
          this.warehouseList = response.content;
          this.selectWarehouse = this.warehouseList && this.warehouseList.length > 0 ? this.warehouseList[0].uuid : undefined;
          if (this.selectWarehouse)
            this.loadTransferList();
        }
      });
  }

  loadTransferList() {
    let transferFilter;
    if (this.transferType == 'in')
      transferFilter = {toWarehouseIdList: [this.selectWarehouse]};
    else
      transferFilter = {fromWarehouseIdList: [this.selectWarehouse]};
    if (this.filterDateRange != undefined) {
      transferFilter["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      transferFilter["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }

    this.isLoading = true;
    if (this.selectWarehouse) {
      this.inventoryService.getTransferList(transferFilter, this.currentPageIndex, this.orderType)
        .subscribe(response => {
            if (response) {
              this.itemTransferList = response.content;
              this.totalDataCount = response.totalCount;
            }
            this.isLoading = false;
          },
          error => {
            this.message.create("error", error.error.message);
            this.isLoading = false;
          });
    }
  }

  addTransfer() {
    this.transferDetailVisible = true;
    this.transferDetailComponent.resetUi({uuid: undefined, transferStatus: undefined});
  }

  pageIndexChanged() {
    this.loadTransferList();
  }

  editTransfer(transfer: any) {
    this.transferDetailVisible = true;
    this.transferDetailComponent.resetUi(transfer);
  }

  handleCancel() {
    this.transferDetailVisible = false;
  }

  saveTransfer() {
    this.transferDetailComponent.saveTransfer();
  }

  onRefreshRequired(closeModel: any) {
    this.loadTransferList();
    if (closeModel)
      this.handleCancel();
  }
}

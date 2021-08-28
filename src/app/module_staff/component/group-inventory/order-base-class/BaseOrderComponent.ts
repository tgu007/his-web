import {Input, OnInit, ViewChild} from "@angular/core";
import {OrderDetailComponent} from "../order-detail/order-detail.component";
import * as globals from "../../../../../globals";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {BaseOrderDetailComponent} from "./BaseOrderDetailComponent";

export abstract class BaseOrderComponent implements OnInit {
  itemOrderList: any;
  orderDetailVisible: any = false;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  @Input() isReturnOrder = false;
  @Input() orderType;
  selectWarehouse: any;
  warehouseList: any;
  isLoading: any = false;
  filterDateRange: any;
  statusList: any;
  selectOrderStatus: any;
  protected detailOrderComponent: any;
  searchNumber: any;

  //detailOrderComponent:BaseOrderDetailComponent;

  protected constructor(protected inventoryService: InventoryService,
                        protected basicService: BasicService,
                        protected message: NzMessageService,
                        protected datePipe: DatePipe,
                        public sessionService: SessionService,
  ) {
  }

  ngOnInit(): void {
    this.loadWarehouseList();
  }

  private loadWarehouseList() {

    let warehouseFilter;
    if (this.orderType == 'medicine')
      warehouseFilter = {warehouseTypeList: [2]};
    else
      warehouseFilter = {warehouseTypeList: [0]};
    if (!this.sessionService.getUserPermission().fullWarehousePermission)
      warehouseFilter["warehouseIdList"] = this.sessionService.loginUser.warehouseIdList;
    this.basicService.getWarehouseList(warehouseFilter)
      .subscribe(response => {
        if (response) {
          this.warehouseList = response.content;
          this.selectWarehouse = this.warehouseList && this.warehouseList.length > 0 ? this.warehouseList[0].uuid : undefined;
          if (this.warehouseList)
            this.loadOrderList();
        }
      });
  }

  abstract loadOrderList();

  getFilter() {
    let filterDto = {
      returnOrder: this.isReturnOrder,
      warehouseId: this.selectWarehouse,
      orderStatusList: this.selectOrderStatus,
      searchNumber: this.searchNumber
    };
    if (this.filterDateRange != undefined) {
      filterDto["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filterDto["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }
    return filterDto;
  }

  executeLoad(loadObservable: any) {
    this.isLoading = true;
    loadObservable
      .subscribe(response => {
          if (response) {
            this.itemOrderList = response.content;
            this.totalDataCount = response.totalCount;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  addOrder() {
    this.orderDetailVisible = true;
    this.detailOrderComponent.resetUi({uuid: undefined, orderStatus: undefined});
  }

  pageIndexChanged() {
    this.loadOrderList();
  }

  editOrder(order: any) {
    this.orderDetailVisible = true;
    this.detailOrderComponent.resetUi(order);
  }

  handleCancel() {
    this.orderDetailVisible = false;
  }

  saveOrder() {
    this.detailOrderComponent.saveOrder();
  }

  onRefreshRequired(closeModel: any) {
    this.loadOrderList();
    if (closeModel)
      this.handleCancel();
  }

  allowEdit() {
    if (this.detailOrderComponent && this.detailOrderComponent.orderLineTableComponent)
      return this.detailOrderComponent.orderLineTableComponent.allowEdit()
    else
      return false;
  }
}

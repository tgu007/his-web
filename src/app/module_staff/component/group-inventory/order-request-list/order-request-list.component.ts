import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as globals from "../../../../../globals";
import {OrderRequestDetailComponent} from "../order-request-detail/order-request-detail.component";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-order-request-list',
  templateUrl: './order-request-list.component.html',
  styleUrls: ['./order-request-list.component.css']
})
export class OrderRequestListComponent implements OnInit {
  orderRequestList: any;
  orderRequestDetailVisible: any = false;
  @ViewChild(OrderRequestDetailComponent, {static: true}) orderRequestDetailComponent: OrderRequestDetailComponent;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  @Input() orderType;
  isLoading: any = false;
  filterDateRange: any;
  selectRequestStatus: any;
  statusList: any;

  constructor(private inventoryService: InventoryService,
              private basicService: BasicService,
              private message: NzMessageService,
              private datePipe: DatePipe,
              public sessionService: SessionService,) {
    this.statusList = this.sessionService.getUserPermission().commonComponent.orderRequestPermission.allowedStatus;
    this.selectRequestStatus = this.statusList;
  }

  ngOnInit() {
    this.loadOrderRequestList();
  }

  loadOrderRequestList() {
    let filterDto = {orderStatusList: this.selectRequestStatus}
    if (this.filterDateRange != undefined) {
      filterDto["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filterDto["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }
    //filterDto["orderStatusList"] = this.sessionService.getUserPermission().commonComponent.orderpermission.allowStatus;
    this.isLoading = true;
    this.inventoryService.getOrderRequestList(this.currentPageIndex, filterDto, this.orderType)
      .subscribe(response => {
          if (response) {
            this.orderRequestList = response.content;
            this.totalDataCount = response.totalCount;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  addOrderRequest() {
    this.orderRequestDetailVisible = true;
    this.orderRequestDetailComponent.resetUi({uuid: undefined, status: undefined});
  }


  editOrderRequest(orderRequest: any) {
    this.orderRequestDetailVisible = true;
    this.orderRequestDetailComponent.resetUi(orderRequest);
  }

  handleCancel() {
    this.orderRequestDetailVisible = false;
  }

  saveOrderRequest() {
    this.orderRequestDetailComponent.saveOrderRequest();
  }

  onRefreshRequired(closeModel: any) {
    this.loadOrderRequestList();
    if (closeModel)
      this.handleCancel();
  }

  refreshClicked() {
    this.filterDateRange = undefined;
    this.selectRequestStatus = this.sessionService.getUserPermission().commonComponent.orderRequestPermission.allowedStatus;
    this.currentPageIndex = 1;
    this.loadOrderRequestList();
  }

  allowEdit() {
    let orderRequestPermission = this.sessionService.getUserPermission().commonComponent.orderRequestPermission;
    let okText = '保存'
    let orderRequest = this.orderRequestDetailComponent.orderRequest;
    if (orderRequest) {
      if (orderRequestPermission.allowEdit) {
        if (orderRequest.uuid) {
          if (orderRequest.status == '已创建')
            return okText;
        } else
          return okText;
      }
    }
    return null;
  }
}

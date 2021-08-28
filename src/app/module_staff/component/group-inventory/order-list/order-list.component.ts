import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {OrderDetailComponent} from "../order-detail/order-detail.component";
import * as globals from "../../../../../globals";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {BaseOrderComponent} from "../order-base-class/BaseOrderComponent";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent extends BaseOrderComponent implements OnInit, AfterViewInit {

  @ViewChild(OrderDetailComponent, {static: true}) orderDetailComponent: OrderDetailComponent;

  constructor(protected inventoryService: InventoryService,
              protected basicService: BasicService,
              protected message: NzMessageService,
              protected datePipe: DatePipe,
              public sessionService: SessionService,
  ) {
    super(inventoryService, basicService, message, datePipe, sessionService);

  }

  ngOnInit() {
    super.ngOnInit();
    if (this.isReturnOrder)
      this.statusList = this.sessionService.getUserPermission().commonComponent.orderpermission.allowedReturnStatus;
    else
      this.statusList = this.sessionService.getUserPermission().commonComponent.orderpermission.allowedStatus;
    this.selectOrderStatus = this.statusList;
  }

  ngAfterViewInit(): void {
    this.detailOrderComponent = this.orderDetailComponent;
  }

  loadOrderList() {
    this.executeLoad(this.inventoryService.getOrderList(this.currentPageIndex, this.getFilter(), this.orderType));
  }

}

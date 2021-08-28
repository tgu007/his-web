import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {OrderDetailComponent} from "../order-detail/order-detail.component";
import * as globals from "../../../../../globals";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {BaseOrderComponent} from "../order-base-class/BaseOrderComponent";
import {PartialOrderDetailComponent} from "../partial-order-detail/partial-order-detail.component";

@Component({
  selector: 'app-partial-order-list',
  templateUrl: './partial-order-list.component.html',
  styleUrls: ['./partial-order-list.component.css']
})
export class PartialOrderListComponent extends BaseOrderComponent implements OnInit, AfterViewInit {
  @ViewChild(PartialOrderDetailComponent, {static: true}) orderDetailComponent: PartialOrderDetailComponent;


  constructor(protected inventoryService: InventoryService,
              protected basicService: BasicService,
              protected message: NzMessageService,
              protected datePipe: DatePipe,
              public sessionService: SessionService,) {
    super(inventoryService, basicService, message, datePipe, sessionService);
    this.statusList = this.sessionService.getUserPermission().commonComponent.partialOrderPermission.allowedStatus;
    this.selectOrderStatus = this.statusList;
  }


  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.detailOrderComponent = this.orderDetailComponent;
  }

  loadOrderList() {
    this.executeLoad(this.inventoryService.getOrderList(this.currentPageIndex, this.getFilter(), this.orderType, true));
  }
}

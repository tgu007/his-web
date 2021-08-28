import {EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService, NzTransferComponent} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {FormBuilder} from "@angular/forms";
import * as globals from "../../../../../globals";
import {FormValidator} from "../../../../../validation/FormValidator";

export abstract class BaseOrderDetailComponent implements OnInit {
  sourceOrderList: any;
  sourceOrderListCount: any;
  selectionTablePageSize = globals.selectionPageSize;
  isLoading: any = false;
  order;
  @Input() orderType: any;
  @Input() isReturnOrder = false;
  isPartialOrder: any;
  tableComponent: any;
  orderForm: any;
  saving: any = false;
  @Output() orderListRefreshRequiredEvent = new EventEmitter<any>();
  statusUpdating: any = false;
  deleting: any = false;
  sourceOrderModalVisible: any;
  loadingSourceOrderLine: boolean = false;
  sourceOrderItemList: any = [];
  @ViewChild(NzTransferComponent, {static: true}) transferComponent: NzTransferComponent;
  addingSourceOrderLine: any = false;
  sourceOrderType: any;

  protected constructor(protected fb: FormBuilder,
                        protected inventoryService: InventoryService,
                        protected basicService: BasicService,
                        protected message: NzMessageService,
                        protected datePipe: DatePipe,
                        public sessionService: SessionService,
  ) {

  }

  ngOnInit(): void {
  }

  searchSourceOrder(dynamicSelectEvent: any) {
    if (dynamicSelectEvent == '')
      return;
    let orderFilter = {orderNumber: dynamicSelectEvent.input};
    this.loadSourceOrderList(orderFilter, dynamicSelectEvent.pageNumber)
  }

  protected abstract getSourceOrderLoadObservable(orderFilter: any, pageIndex: any);

  protected abstract buildSourceOrderDynamicSelectionValueList(sourceOrderDropdownData: any);

  protected abstract patchFormValue();

  protected abstract getData();

  protected abstract resetUi(order: any, orderLoaded: any);

  protected loadSourceOrderList(orderFilter: any, pageIndex: any) {
    orderFilter["orderStatusList"] = ['已批准'];
    this.getSourceOrderLoadObservable(orderFilter, pageIndex)
      .subscribe(response => {
        if (response) {
          this.sourceOrderListCount = response.totalCount;
          this.buildSourceOrderDynamicSelectionValueList(response.content);
        }
      });
  }

  protected loadOrderDetail() {
    this.isLoading = true;
    this.inventoryService.getOrderDetail(this.order.uuid, this.orderType, this.isPartialOrder)
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          this.order = response.content
          this.patchFormValue();
        }
      });
  }


  saveOrder() {
    if (!this.tableComponent.allLineCommitted())
      return;
    if (!this.orderForm.valid) {
      FormValidator.validateFormInput(this.orderForm);
      this.message.create("error", `验证错误`);
      return;
    }

    let order = this.getData();
    this.saving = true;
    this.inventoryService.saveOrder(order, this.orderType, this.isPartialOrder)
      .subscribe(response => {
          if (response) {
            this.message.create("success", "保存成功");
            this.resetUi(response.content, true);
            this.orderListRefreshRequiredEvent.emit(false);
            this.saving = false;
          }
        },
        error => {
          this.message.create("error", "操作失败");
          this.saving = false;
        }
      );
  }

  updateOrderStatus(orderStatus: any, action: string) {
    let updateDto = {orderStatus: orderStatus, uuid: this.order.uuid};
    if (action == 'approve' || action == 'approve_return')
      updateDto["approveById"] = this.sessionService.loginUser.uuid;
    this.statusUpdating = true;
    this.inventoryService.updateOrderStatus(updateDto, this.orderType, action, this.isPartialOrder)
      .subscribe(response => {
          this.message.create("success", `操作成功`);
          this.orderListRefreshRequiredEvent.emit(false);
          this.order.orderStatus = orderStatus;
          this.statusUpdating = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.statusUpdating = false;
        });
  }

  deleteOrder() {
    this.deleting = true;
    this.inventoryService.deleteOrder(this.order.uuid, this.orderType, this.isPartialOrder)
      .subscribe(response => {
          this.message.create("success", `删除成功`);
          this.orderListRefreshRequiredEvent.emit(true);
          this.deleting = false;
        },
        error => {
          this.message.create("error", `删除失败`);
          this.deleting = false;
        });
  }

  showSourceOrderModal(sourceOrder: any) {
    this.sourceOrderModalVisible = true;
    this.loadingSourceOrderLine = true;
    this.inventoryService.getSourceOrderLineList(this.orderType, sourceOrder.uuid, this.sourceOrderType)
      .subscribe(response => {
          if (response) {
            this.sourceOrderItemList = response.content;
            this.loadingSourceOrderLine = false;
          }
        },
        error => {
          this.loadingSourceOrderLine = false;
        });
  }

  closeModal() {
    this.sourceOrderModalVisible = false;
  }


  addSourceOrderLine() {
    let selectedKeyList = this.transferComponent.rightDataSource.map(d => d.key);
    if (selectedKeyList.length == 0)
      this.sourceOrderModalVisible = false;

    this.addingSourceOrderLine = true;
    this.inventoryService.copySourceLine(this.orderType, {sourceLineIdList: selectedKeyList}, this.sourceOrderType)
      .subscribe(response => {
          if (response) {
            this.tableComponent.patchTableFromValue(response.content);
            this.message.create("success", `复制成功`);
            this.sourceOrderModalVisible = false;
            this.addingSourceOrderLine = false;
          }
        },
        error => {
          this.addingSourceOrderLine = false;
        });
  }

}

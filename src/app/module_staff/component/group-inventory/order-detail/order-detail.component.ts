import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService, NzSelectComponent, NzTransferComponent} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {OrderDetailTableComponent} from "../order-detail-table/order-detail-table.component";
import {SessionService} from "../../../../service/session.service";
import * as globals from "../../../../../globals";
import {BaseOrderDetailComponent} from "../order-base-class/BaseOrderDetailComponent";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent extends BaseOrderDetailComponent implements OnInit, AfterViewInit {

  @ViewChild(OrderDetailTableComponent, {static: true}) orderLineTableComponent: OrderDetailTableComponent;
  supplierList: any;
  toWarehouseList: any = [];
  nzFilterOption = () => false;
  pramInitialized: any = false;
  @ViewChildren(NzSelectComponent)
  nzSelectComponentList: QueryList<NzSelectComponent>;
  generatingOrder: any = false;
  updatingInventory: any = false;
  orderPermission: any;


  constructor(protected fb: FormBuilder, protected inventoryService: InventoryService,
              protected basicService: BasicService,
              protected message: NzMessageService,
              protected datePipe: DatePipe,
              public sessionService: SessionService,) {
    super(fb, inventoryService, basicService, message, datePipe, sessionService);
    this.orderPermission = this.sessionService.getUserPermission().commonComponent.orderpermission;
    this.isPartialOrder = false;
    this.sourceOrderType = 'request'
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      selectSupplier: [undefined, Validators.required],
      selectToWarehouse: [undefined, [Validators.required]],
      dateOrderDate: ["", [Validators.required]],
      txtReference: ["", null],
      orderLines: this.fb.array([]),
      chkPaid: ["", false],
      selectSourceOrder: [undefined, undefined],
    });
    this.orderForm.patchValue({dateOrderDate: Date()});

  }

  ngAfterViewInit(): void {
    this.tableComponent = this.orderLineTableComponent;
  }

  searchSupplier(input: string) {
    if (input == '')
      return;
    //Item
    let supplierType = 1;
    if (this.orderType == 'medicine')
      supplierType = 0; //medicine
    let supplierFilter = {searchCode: input, supplierType: supplierType};
    this.basicService.getSupplierList(supplierFilter)
      .subscribe(response => {
        if (response) {
          this.supplierList = response.content;
        }
      });
  }

  private loadToWarehouseList() {
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
          this.toWarehouseList = response.content;
          this.orderForm.patchValue(
            {
              selectToWarehouse: this.toWarehouseList.length > 0 ? this.toWarehouseList[0].uuid : undefined,
            });
        }
      });
  }

  protected getSourceOrderLoadObservable(orderFilter: any, pageIndex: any) {
    return this.inventoryService.getOrderRequestSelectionList(pageIndex, orderFilter, this.orderType, this.selectionTablePageSize)
  }


  protected buildSourceOrderDynamicSelectionValueList(sourceOrderDropdownData: any) {
    for (let data of sourceOrderDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.orderRequestNumber);
      dynamicItemValueList.push(data.name);
      dynamicItemValueList.push(data.approvedDate);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.sourceOrderList = sourceOrderDropdownData;
  }


  protected patchFormValue() {
    if (this.order.supplier)
      this.supplierList = [this.order.supplier]

    let orderRequestArray;
    if (this.order.orderRequest) {
      orderRequestArray = [this.order.orderRequest];
      this.buildSourceOrderDynamicSelectionValueList(orderRequestArray);
    }

    this.orderForm.patchValue(
      {
        selectSupplier: this.order.supplier ? this.order.supplier.uuid : undefined,
        dateOrderDate: this.order.orderDate,
        txtReference: this.order.reference,
        selectToWarehouse: this.order.toWarehouse.uuid,
        chkPaid: this.order.paid,
        selectSourceOrder: orderRequestArray ? orderRequestArray[0] : undefined,
      });

    this.orderLineTableComponent.patchTableFromValue(this.order.lineList);
  }

  resetUi(order: any, orderLoaded: boolean = false) {
    this.order = order;
    this.orderLineTableComponent.order = order;
    if (!this.pramInitialized) {
      this.loadToWarehouseList();
      this.pramInitialized = true;
    }
    this.loadSourceOrderList({}, 1);
    this.orderForm.reset();
    this.orderLineTableComponent.resetUi();

    this.orderForm.patchValue(
      {
        dateOrderDate: Date(),
        selectToWarehouse: this.toWarehouseList && this.toWarehouseList.length > 0 ? this.toWarehouseList[0].uuid : undefined,
        chkPaid: false,
      });

    if (this.order.uuid) {
      if (orderLoaded)
        this.patchFormValue();
      else
        this.loadOrderDetail();
    }
  }


  protected getData() {
    let orderLineList: any[] = this.orderLineTableComponent.getData();
    const data = this.orderForm.value;
    return {
      uuid: this.order ? this.order.uuid : undefined,
      reference: data.txtReference,
      orderStatus: this.order && this.order.orderStatus ? this.order.orderStatus : 0,
      supplierId: data.selectSupplier,
      toWarehouseId: data.selectToWarehouse,
      orderDate: this.datePipe.transform(data.dateOrderDate, 'yyyy-MM-dd HH:mm:ss'),
      returnOrder: this.isReturnOrder,
      orderLineList: orderLineList,
      paid: data.chkPaid,
      orderRequestId: data.selectSourceOrder ? data.selectSourceOrder.uuid : undefined,
    };
  }

  //如果为退货单，并且已经开始选择库房产品时，不能再更改库房
  disableSelectToWarehouse() {
    let tableLineArray = this.orderLineTableComponent.lineArray;
    if (this.isReturnOrder && tableLineArray && tableLineArray.controls.length > 0)
      return true;
    else
      return false;
  }

  // confirmOrder() {
  //   this.updatingInventory = true;
  //   this.inventoryService.confirmOrder(this.order.uuid, this.orderType)
  //     .subscribe(response => {
  //         this.updatingInventory = false;
  //         if (response) {
  //           if (this.isReturnOrder)
  //             this.message.create("success", `出库成功`);
  //           else
  //             this.message.create("success", `入库成功`);
  //           this.order = response.content;
  //           this.orderListRefreshRequiredEvent.emit(false);
  //         }
  //       },
  //       error => {
  //         this.updatingInventory = false;
  //         this.message.create("error", error.error.message);
  //       });
  // }


  addSupplier(supplierName: any, contactNumber: any) {
    this.basicService.quickAddSupplier({
      name: supplierName.value,
      entityType: this.orderType == 'medicine' ? 0 : 1,
      contactNumber: contactNumber.value
    }).subscribe(response => {
      if (response) {
        this.supplierList = [response.content];
        this.orderForm.patchValue(
          {
            selectSupplier: response.content.uuid,
          });
        let openedSelectComponent = this.nzSelectComponentList.find(s => s.open);
        if (openedSelectComponent)
          openedSelectComponent.closeDropDown();
      }
    });
  }

  // generateTransferOrder() {
  //   this.generatingOrder = true;
  //   this.inventoryService.generateMedicineTransferOrder(this.order.uuid)
  //     .subscribe(response => {
  //         this.generatingOrder = false;
  //         this.message.create("success", `调拨单生成成功！`);
  //       },
  //       error => {
  //         this.message.create("error", error.error.message);
  //         this.isLoading = false;
  //       });
  // }
  sourceOrderFilterOption(inputValue: string, item: any): boolean {
    return item.title.indexOf(inputValue) > -1;
  }

}

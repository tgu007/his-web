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
import {OrderDetailTableComponent} from "../order-detail-table/order-detail-table.component";
import {NzMessageService, NzSelectComponent, NzTransferComponent} from "ng-zorro-antd";
import * as globals from "../../../../../globals";
import {FormBuilder, Validators} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {BaseOrderDetailComponent} from "../order-base-class/BaseOrderDetailComponent";
import {PartialOrderDetailTableComponent} from "../partial-order-detail-table/partial-order-detail-table.component";
import {YbImageUploadComponent} from "../yb-image-upload/yb-image-upload.component";


@Component({
  selector: 'app-partial-order-detail',
  templateUrl: './partial-order-detail.component.html',
  styleUrls: ['./partial-order-detail.component.css']
})
export class PartialOrderDetailComponent extends BaseOrderDetailComponent implements OnInit, AfterViewInit {

  @ViewChild(PartialOrderDetailTableComponent, {static: true}) orderLineTableComponent: PartialOrderDetailTableComponent;
  orderPermission: any;
  imageUploadVisible: any = false;
  @ViewChild(YbImageUploadComponent, {static: true}) imageUploadComponent: YbImageUploadComponent;


  constructor(protected fb: FormBuilder, protected inventoryService: InventoryService,
              protected basicService: BasicService,
              protected message: NzMessageService,
              protected datePipe: DatePipe,
              public sessionService: SessionService,) {
    super(fb, inventoryService, basicService, message, datePipe, sessionService);
    this.orderPermission = this.sessionService.getUserPermission().commonComponent.partialOrderPermission;
    this.isPartialOrder = true;
    this.sourceOrderType = 'master'
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderLines: this.fb.array([]),
      selectSourceOrder: [undefined, Validators.required],
    });
  }


  ngAfterViewInit(): void {
    this.tableComponent = this.orderLineTableComponent;
  }

  protected buildSourceOrderDynamicSelectionValueList(sourceOrderDropdownData: any) {
    for (let data of sourceOrderDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.orderNumber);
      dynamicItemValueList.push(data.approvedDate);
      dynamicItemValueList.push(data.orderRequest ? data.orderRequest.name : undefined);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.sourceOrderList = sourceOrderDropdownData;
  }

  protected getSourceOrderLoadObservable(orderFilter: any, pageIndex: any) {
    return this.inventoryService.getOrderSelectionList(pageIndex, orderFilter, this.orderType, this.selectionTablePageSize)
  }

  protected patchFormValue() {
    let masterOrderArray;
    if (this.order.masterOrder) {
      masterOrderArray = [this.order.masterOrder];
      this.buildSourceOrderDynamicSelectionValueList(masterOrderArray);
    }
    this.orderForm.patchValue(
      {
        selectSourceOrder: masterOrderArray ? masterOrderArray[0] : undefined,
      });

    this.orderLineTableComponent.patchTableFromValue(this.order.lineList);
  }

  protected getData() {
    let orderLineList: any[] = this.orderLineTableComponent.getData();
    const data = this.orderForm.value;
    return {
      uuid: this.order ? this.order.uuid : undefined,
      orderStatus: this.order && this.order.orderStatus ? this.order.orderStatus : 0,
      orderLineList: orderLineList,
      masterOrderId: data.selectSourceOrder.uuid,
    };
  }

  protected resetUi(order: any, orderLoaded: boolean = false) {
    this.order = order;
    this.orderLineTableComponent.order = order;
    this.loadSourceOrderList({}, 1);
    this.orderForm.reset();
    this.orderLineTableComponent.resetUi();

    if (this.order.uuid) {
      if (orderLoaded)
        this.patchFormValue();
      else
        this.loadOrderDetail();
    }
  }

  sourceOrderFilterOption(inputValue: string, item: any): boolean {
    return item.title.indexOf(inputValue) > -1;
  }

  closeImageUploadModal() {
    this.imageUploadVisible = false;
  }

  uploadImageClicked() {
    this.imageUploadVisible = true;
  }
}

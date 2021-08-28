import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NzTreeNodeOptions} from "ng-zorro-antd/core/tree/nz-tree-base-node";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-prescription-medicine-order-list',
  templateUrl: './prescription-medicine-order-list.component.html',
  styleUrls: ['./prescription-medicine-order-list.component.css']
})
export class PrescriptionMedicineOrderListComponent implements OnInit, OnDestroy {

  collapsed: any = false;
  nodes: any;
  pendingOrderList: any = [];
  processedOrderList: any = [];
  pendingConfirmOrderList: any[];
  pendingOrderLineList: any;
  pendingOrderSummaryLineList: any;
  mapOfCheckedLineId: { [key: string]: boolean } = {};
  pageSize: number = 9999;
  selectedNode: any = undefined;
  selectedTabIndex: any = 0;
  mapOfCheckedSummaryLineId: { [key: string]: boolean } = {};
  allSummaryLineChecked: any = true;
  allLineChecked: any = true;
  processing: any = false;
  //hasNewNotification:false;
  //timer:any;
  loading: any = false;
  summaryLoading: any = false;
  deletingOrderLine: any = false;

  constructor(private inventoryService: InventoryService,
              private message: NzMessageService,
              public sessionService: SessionService,
              public printService: PrintService,
              private modal: NzModalService,
  ) {
  }

  ngOnInit() {
    this.getOrderList();
    // //定时更新新的提药单
    // this.timer = setInterval(() => {
    //   this.getOrderList();
    // }, 30000)
  }


  ngOnDestroy(): void {
    //clearInterval(this.timer);
  }


  nzClick(selectedNode: any) {
    this.resetUi();

    //this.selectedTabIndex = 0;

    if (selectedNode.origin.isLeaf) {
      this.selectedNode = selectedNode;

      if (this.selectedTabIndex == 0)
        this.loadOrderLineList();
      else
        this.loadOrderLineSummaryList();
    }
  }

  getOrderList() {
    let filter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      filter["wardIdList"] = this.sessionService.loginUser.wardIdList;
    this.inventoryService.getPrescriptionOrderList("pending", filter)
      .subscribe(response => {
        if (response) {
          this.pendingOrderList = [];
          this.buildOrderList(this.pendingOrderList, response.content);
        }
      });

    this.inventoryService.getPrescriptionOrderList("pending_confirm", filter)
      .subscribe(response => {
        if (response) {
          this.pendingConfirmOrderList = [];
          this.buildOrderList(this.pendingConfirmOrderList, response.content);
        }
      });

    this.inventoryService.getPrescriptionOrderList("recent_processed", filter)
      .subscribe(response => {
        if (response) {
          this.processedOrderList = [];
          this.buildOrderList(this.processedOrderList, response.content);
        }
      });
  }


  private buildOrderList(orderListArray: any, orderList: any) {
    //orderListArray = [];
    for (let order of orderList)
      orderListArray.push({
        isLeaf: true,
        title: order.orderNumberCode + ":" + order.orderTimeInfo + `(${order.submitBy})`,
        key: order.uuid,
        status: order.status,
        wardName: order.wardName
      });
    this.refreshTree();

  }

  private refreshTree() {
    this.nodes = [
      {
        title: '待发药',
        key: '待发药',
        children: this.pendingOrderList,
      },
      {
        title: '待确认',
        key: '待确认',
        children: this.pendingConfirmOrderList,
      },
      {
        title: '已发药',
        key: '已发药',
        children: this.processedOrderList,
      },
    ];
  }

  selectedTabChanged(tabIndex: number) {
    if (tabIndex == 1)
      this.loadOrderLineSummaryList()
    else
      this.loadOrderLineList();
  }

  checkAll(checked: boolean) {
    if (this.selectedTabIndex == 0)
      this.pendingOrderLineList.forEach(data => {
        this.mapOfCheckedLineId[data.uuid] = checked;
      });
    else
      this.pendingOrderSummaryLineList.forEach(data => {
        this.mapOfCheckedSummaryLineId[data.medicineId] = checked;
      });
  }

  private loadOrderLineList(needReload: any = false) {
    if (!this.selectedNode)
      return;

    if (!this.pendingOrderLineList || needReload) {
      this.loading = true;
      this.inventoryService.getPrescriptionOrderLineList(this.selectedNode.key)
        .subscribe(response => {
          if (response) {
            this.pendingOrderLineList = response.content;
            this.checkAll(true);
          }
          this.loading = false;
        });
    }
  }

  private loadOrderLineSummaryList() {
    if (!this.selectedNode)
      return;
    if (!this.pendingOrderSummaryLineList) {
      this.summaryLoading = true;
      this.inventoryService.getPrescriptionOrderLineSummaryList(this.selectedNode.key)
        .subscribe(response => {
          if (response) {
            this.pendingOrderSummaryLineList = response.content;
            //console.log(this.pendingOrderSummaryLineList);
            this.checkAll(true);
          }
          this.summaryLoading = false;
        });
    }
  }

  private resetUi() {
    this.pendingOrderLineList = undefined;
    this.pendingOrderSummaryLineList = undefined;
    this.selectedNode = undefined;
    this.allLineChecked = true;
    this.allSummaryLineChecked = true;
  }


  processOrder(pramType: any) {
    let orderProcessDto = this.getLinePram(pramType);
    this.processing = true;
    this.inventoryService.processPrescriptionMedicineOrder(this.selectedNode.key, orderProcessDto)
      .subscribe(response => {
          this.resetUi();
          this.getOrderList();
          this.message.create("success", "确认成功");
          this.processing = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.processing = false;
        }
      );
  }

  updateOrderStatus(action: any) {
    this.processing = true;
    this.inventoryService.updatePrescriptionMedicineOrderStatus(this.selectedNode.key, action)
      .subscribe(
        response => {
          this.resetUi();
          this.getOrderList();
          this.message.create("success", "操作成功");
          this.processing = false;
        },
        error => {
          console.log(error);
          this.message.create("error", error.error.message);
          this.processing = false;
        }
      );
  }

  private getLinePram(pramType: any) {
    let processLineList: any;
    if (pramType == 'all') {
      processLineList = this.pendingOrderLineList.map(
        (line) => {
          // @ts-ignore
          return {orderLineId: line.uuid, approve: this.mapOfCheckedLineId[line.uuid]}
        }
      );
    } else if (pramType == 'summary') {
      processLineList = this.pendingOrderSummaryLineList.map(
        (line) => {
          // @ts-ignore
          return {medicineId: line.medicineId, approve: this.mapOfCheckedSummaryLineId[line.medicineId]}
        }
      );
    }
    return {orderLineList: processLineList};
  }

  printClicked() {
    this.printService.onPrintClicked.emit({
      name: 'prescriptionOrderSummaryList',
      data: {
        prescriptionOrderList: this.pendingOrderSummaryLineList,
        order: this.selectedNode
      }
    });
  }

  deletePrescriptionMedicineOrderLine(orderLineId: any) {
    this.modal.confirm({
      nzContent: '退还此项发药申请，病区可以重新提交，点击确定执行',
      nzOnOk: () => {
        this.deletingOrderLine = true;
        this.inventoryService.deletePrescriptionMedicineOrderLine(orderLineId)
          .subscribe(response => {
              this.loadOrderLineList(true);
              this.message.create("success", "退还成功");
              this.deletingOrderLine = false;

            },
            error => {
              this.message.create("error", error.error.message);
              this.deletingOrderLine = false;
            }
          );
      }
    });
  }
}

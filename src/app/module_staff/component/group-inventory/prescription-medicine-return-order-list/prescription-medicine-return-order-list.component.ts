import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzMessageService, NzTreeNode} from "ng-zorro-antd";
import {InventoryService} from "../../../../service/inventory.service";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-prescription-medicine-return-order-list',
  templateUrl: './prescription-medicine-return-order-list.component.html',
  styleUrls: ['./prescription-medicine-return-order-list.component.css']
})
export class PrescriptionMedicineReturnOrderListComponent implements OnInit, OnDestroy {
  collapsed: any = false;
  nodes: any;
  selectedNode: any = undefined;
  pendingReturnOrderList: any = [];
  processedReturnOrderList: any = [];
  pageSize: any = 1000;
  pendingReturnOrderSummaryLineList: any;
  mapOfExpandData: { [key: string]: boolean } = {};
  mapOfCheckedId: { [key: string]: boolean } = {};

  //timer:any;

  constructor(private inventoryService: InventoryService,
              private message: NzMessageService,
              public printService: PrintService,
              public sessionService: SessionService,) {
  }

  ngOnInit() {
    this.getReturnOrderList();
    //  //定时更新新的提药单
    // this.timer = setInterval(() => {
    //    this.getReturnOrderList();
    //  }, 30000)
  }


  getReturnOrderList() {
    let filter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      filter["wardIdList"] = this.sessionService.loginUser.wardIdList;
    this.inventoryService.getPrescriptionReturnOrderList("pending", filter)
      .subscribe(response => {
        if (response) {
          this.pendingReturnOrderList = [];
          this.buildOrderList(this.pendingReturnOrderList, response.content);
        }
      });

    this.inventoryService.getPrescriptionReturnOrderList("recent_processed", filter)
      .subscribe(response => {
        if (response) {
          this.processedReturnOrderList = [];
          this.buildOrderList(this.processedReturnOrderList, response.content);
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
        wardName: order.wardName,
        submitBy: order.submitBy
      });
    this.refreshTree();

  }

  private refreshTree() {
    this.nodes = [
      {
        title: '待退药',
        key: '待退药',
        children: this.pendingReturnOrderList,
      },
      {
        title: '已退药',
        key: '已退药',
        children: this.processedReturnOrderList,
      }
    ];
  }

  nzClick(selectedNode: NzTreeNode) {
    this.resetUi();

    if (selectedNode.origin.isLeaf) {
      this.selectedNode = selectedNode;
      this.loadOrderLineSummaryList();
    }
  }

  private resetUi() {
    // this.pendingOrderLineList = undefined;
    this.pendingReturnOrderSummaryLineList = undefined;
    this.selectedNode = undefined;
    this.mapOfCheckedId = {};
    this.mapOfExpandData = {};
    // this.allLineChecked = true;
    // this.allSummaryLineChecked = true;
  }

  processReturnOrder() {
    const selectedReturnLine = Object.keys(this.mapOfCheckedId).filter(orderLineId => this.mapOfCheckedId[orderLineId]).map((orderLineId) => (orderLineId));
    // if (selectedReturnLine.length == 0) {
    //   this.message.create("warning", `没有选中的药品`);
    //   return;
    // }


    this.inventoryService.processPrescriptionMedicineReturnOrder(this.selectedNode.key, {returnOrderLineIdList: selectedReturnLine})
      .subscribe(response => {
          this.resetUi();
          this.getReturnOrderList();
          this.message.create("success", "处理成功");
        },
        error => {
          this.message.create("error", "提交失败");
        }
      );
  }

  private loadOrderLineSummaryList() {
    if (!this.selectedNode)
      return;
    if (!this.pendingReturnOrderSummaryLineList) {
      this.inventoryService.getPrescriptionReturnOrderLineSummaryList(this.selectedNode.key)
        .subscribe(response => {
          if (response) {
            this.pendingReturnOrderSummaryLineList = response.content;
            this.pendingReturnOrderSummaryLineList.forEach(line => this.checkAll(true, line));
          }
        });
    }
  }

  checkAll(checked: boolean, data) {
    if (this.selectedNode.parentNode.key == '已退药') {
      data.orderLineList.forEach(orderLine => {
        this.mapOfCheckedId[orderLine.uuid] = orderLine.status == "已退";
      });
    } else {
      data.orderLineList.forEach(orderLine => {
        this.mapOfCheckedId[orderLine.uuid] = checked;
      });
    }
  }

  // getTotalCheckedQuantity(summaryLine) {
  //   const lineArray = summaryLine.orderLineList.filter(line => this.mapOfCheckedId[line.uuid]).map(line => line.originOrderLine.orderQuantity);
  //   let totalReturnQuantity;
  //   if (lineArray.length > 0)
  //     totalReturnQuantity = lineArray.reduce((sum, current) => sum + current)
  //   else
  //     totalReturnQuantity = 0;
  //   return totalReturnQuantity + summaryLine.pharmacyUom;
  // }

  ngOnDestroy(): void {
    //clearInterval(this.timer);
  }

  printClicked() {
    this.printService.onPrintClicked.emit({
      name: 'prescriptionReturnOrder',
      data: {
        returnOrderLineSummaryList: this.pendingReturnOrderSummaryLineList,
        order: this.selectedNode
      }
    });
  }
}

import {Component, OnInit} from '@angular/core';
import * as globals from "../../../../../globals";
import {InventoryService} from "../../../../service/inventory.service";
import {NzMessageService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-prescription-medicine-order-processed-list',
  templateUrl: './prescription-medicine-order-processed-list.component.html',
  styleUrls: ['./prescription-medicine-order-processed-list.component.css']
})
export class PrescriptionMedicineOrderProcessedListComponent implements OnInit {
  filterDateRange: any;
  searchCode: any;
  totalListCount: any;
  currentPageIndex: any = 1;
  tablePageSize: any = globals.tablePageSize;
  processedOrderList: any;
  medicineSearchCode: any;
  filterPendingUploadOrder: any = false;

  constructor(private inventoryService: InventoryService,
              private message: NzMessageService,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.loadProcessedOrderList();
  }


  loadProcessedOrderList() {
    let filterDto = {};
    if (this.searchCode)
      filterDto["searchCode"] = this.searchCode;
    if (this.filterDateRange != undefined) {
      filterDto["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filterDto["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }
    if (this.medicineSearchCode)
      filterDto["medicineSearchCode"] = this.medicineSearchCode;

    filterDto["pendingUpload"] = this.filterPendingUploadOrder;

    this.inventoryService.getProcessedPrescriptionOrderLineList(this.currentPageIndex, filterDto)
      .subscribe(response => {
        if (response) {
          this.processedOrderList = response.content
          this.totalListCount = response.totalCount;
        }
      });
  }
}

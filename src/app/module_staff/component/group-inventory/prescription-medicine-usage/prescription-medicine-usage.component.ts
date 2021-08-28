import {Component, OnInit} from '@angular/core';
import {BasicService} from "../../../../service/basic.service";
import {InventoryService} from "../../../../service/inventory.service";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-prescription-medicine-usage',
  templateUrl: './prescription-medicine-usage.component.html',
  styleUrls: ['./prescription-medicine-usage.component.css']
})
export class PrescriptionMedicineUsageComponent implements OnInit {
  searchCode: any;
  medicineSearchCode: any;
  filterDateRange: any = [new Date(), new Date()];
  usageList: any = [];
  selectWarehouse: any;
  warehouseList: any;
  isLoading = false;
  filterOrderLineStatus: any = '已发药';

  constructor(
    private basicService: BasicService,
    private inventoryService: InventoryService,
    public sessionService: SessionService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    let permittedWarehouseList = undefined;
    if (!this.sessionService.getUserPermission().fullWarehousePermission)
      permittedWarehouseList = this.sessionService.loginUser.warehouseIdList;
    let warehouseTypeFilter = ['药房'];
    this.basicService.getWarehouseList({
      warehouseIdList: permittedWarehouseList,
      warehouseTypeList: warehouseTypeFilter
    })
      .subscribe(response => {
        if (response) {
          this.warehouseList = response.content;
          if (this.warehouseList.length > 0) {
            this.selectWarehouse = this.warehouseList[0].uuid;
            this.loadUsageList();
          }
        }
      });
  }

  loadUsageList() {
    let filterDto = {};
    filterDto["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
    filterDto["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    filterDto["lineStatus"] = this.filterOrderLineStatus;
    if (this.searchCode)
      filterDto["searchCode"] = this.searchCode;
    if (this.medicineSearchCode)
      filterDto["medicineSearchCode"] = this.medicineSearchCode;

    this.isLoading = true;
    this.inventoryService.getPrescriptionMedicineUsageList(this.selectWarehouse, filterDto)
      .subscribe(response => {
        if (response) {
          this.isLoading = false;
          this.usageList = response.content;
        }
      });
  }
}

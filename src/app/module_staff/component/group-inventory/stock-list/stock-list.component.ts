import {Component, OnInit} from '@angular/core';
import * as globals from "../../../../../globals";
import {BasicService} from "../../../../service/basic.service";
import {InventoryService} from "../../../../service/inventory.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  entityList: any;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  filterEntityName: any;
  warehouseList: any;
  selectWarehouse: any;
  selectEntityType: any;
  mapOfExpandData: { [key: string]: boolean } = {};
  stockTypeList: any;
  isLoading: any = false;
  selectItemWarehouseType: any;
  itemWarehouseTypeList: any;
  medicineTypeList: any;
  selectMedicineType: any;
  // [
  // {value: "medicine", label: "药品"},
  // {value: "item", label: "物品"}]
  filterExpireDate: any;
  chkExpireDateFilter: any = false;
  orderLineModalVisible: any = false;
  orderLineList: any = undefined;
  chkIncludeDisable: any = false;

  constructor(private basicService: BasicService,
              private inventoryService: InventoryService,
              private message: NzMessageService,
              public sessionService: SessionService,
              public printService: PrintService,
              private modal: NzModalService,
  ) {

  }

  ngOnInit() {
    this.stockTypeList = this.sessionService.getUserPermission().commonComponent.stock.stockTypeList;
    if (this.stockTypeList.length > 0)
      this.selectEntityType = this.stockTypeList[0].value;
    // console.log(this.stockTypeList);
    let permittedWarehouseList = undefined;
    if (!this.sessionService.getUserPermission().fullWarehousePermission)
      permittedWarehouseList = this.sessionService.loginUser.warehouseIdList;
    let warehouseTypeFilter = ['药库', '病区库房', '药房', '科室库房'];
    this.basicService.getWarehouseList({
      warehouseIdList: permittedWarehouseList,
      warehouseTypeList: warehouseTypeFilter
    })
      .subscribe(response => {
        if (response) {
          this.warehouseList = response.content;
          if (this.warehouseList.length > 0) {
            this.selectWarehouse = [this.warehouseList[0].uuid];
            this.loadDepartmentStock();
          }

        }
      });

    this.basicService.getMedicineTypeList()
      .subscribe(response => {
        if (response) {
          this.medicineTypeList = response.content;
        }
      });

    this.basicService.getWarehouseTypeList()
      .subscribe(response => {
        if (response) {
          this.itemWarehouseTypeList = response.content;
        }
      });
  }

  pageIndexChanged() {
    this.loadDepartmentStock();
  }

  searchEntityStock() {
    this.loadDepartmentStock();
  }

  selectDepartmentChanged() {
    this.loadDepartmentStock();
  }


  selectStockTypeChanged() {
    this.currentPageIndex = 1;
    this.loadDepartmentStock();
  }

  loadDepartmentStock() {
    this.mapOfExpandData = {};
    let inventoryEntityFilter = {
      stockFilter: {
        warehouseIdList: this.selectWarehouse,
        expireDate: this.filterExpireDate
      }
    }

    if (this.chkIncludeDisable == false)
      inventoryEntityFilter["enabled"] = true;

    if (this.filterEntityName && this.filterEntityName != '')
      inventoryEntityFilter["searchCode"] = this.filterEntityName;
    if (this.selectItemWarehouseType && this.selectEntityType == 'item')
      inventoryEntityFilter["warehouseTypeId"] = this.selectItemWarehouseType;
    if (this.selectMedicineType && this.selectEntityType == 'medicine')
      inventoryEntityFilter["medicineTypeId"] = this.selectMedicineType;

    this.isLoading = true;
    this.basicService.getPagedEntityStockList(inventoryEntityFilter, this.selectEntityType, this.currentPageIndex)
      .subscribe(response => {
          if (response) {
            this.entityList = response.content
            this.totalDataCount = response.totalCount;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }


  adjustClicked(departmentStock) {
    departmentStock["inEdit"] = true;
    departmentStock["newWarehouseQuantity"] = undefined;
    departmentStock["newDepartmentQuantity"] = undefined;
    departmentStock["newMinUomQuantity"] = undefined;
    departmentStock["adjustmentReference"] = "";
  }

  submitAdjustment(departmentStock: any, summaryRowData: any) {
    let stockEntity = summaryRowData.stockEntity;
    let newQuantity = (departmentStock.newWarehouseQuantity ? departmentStock.newWarehouseQuantity : 0) * stockEntity.warehouseConversionRate
      + (departmentStock.newDepartmentQuantity ? departmentStock.newDepartmentQuantity : 0) * stockEntity.departmentConversionRate
      + (departmentStock.newMinUomQuantity ? departmentStock.newMinUomQuantity : 0);


    let newQuantityDto = {
      warehouseId: departmentStock.warehouse.uuid,
      inventoryEntityId: stockEntity.uuid,
      newQuantity: newQuantity,
      oldQuantity: departmentStock.minUomQuantity,
      reference: departmentStock.adjustmentReference
    };

    if (newQuantity == 0) {
      this.modal.confirm({
        nzTitle: '确认调节库存为0',
        nzContent: '点击确认继续，如为误操作，单击取消',
        nzOnOk: () => {
          this.updateStock(newQuantityDto, stockEntity, summaryRowData);
        }
      });
    } else
      this.updateStock(newQuantityDto, stockEntity, summaryRowData);
  }

  updateStock(newQuantityDto: any, stockEntity, summaryRowData) {
    this.inventoryService.updateStockQuantity(newQuantityDto, this.selectEntityType)
      .subscribe(response => {
          //保存成功
          this.message.create("success", `库存更新完成`);

          let inventoryEntityFilter = {
            stockFilter: {
              inventorEntityId: stockEntity.uuid,
              warehouseIdList: this.selectWarehouse
            }
          }
          this.refreshEntityDepartmentStock(inventoryEntityFilter, summaryRowData);
        },
        error => {
          this.message.create("error", `库存更新失败`);
        }
      );
  }

  cancelAdjustment(detail) {
    detail["inEdit"] = false;
  }

  private refreshEntityDepartmentStock(inventoryEntityFilter: any, summaryRowData) {

    this.basicService.getPagedEntityStockList(inventoryEntityFilter, this.selectEntityType, this.currentPageIndex).subscribe(
      response => {
        if (response) {
          let refreshedStock = response.content[0];
          summaryRowData.totalQuantity = refreshedStock.totalQuantity;
          summaryRowData.minUomDisplayQuantity = refreshedStock.minUomDisplayQuantity;
          summaryRowData.warehouseDisplayQuantity = refreshedStock.warehouseDisplayQuantity;
          summaryRowData.departmentDisplayQuantity = refreshedStock.departmentDisplayQuantity;
          summaryRowData.stockSummaryList = refreshedStock.stockSummaryList;
        }
      }
    )
  }

  printClicked() {
    this.mapOfExpandData = {};
    let inventoryEntityFilter = {
      stockFilter: {warehouseIdList: this.selectWarehouse}
    }

    if (this.filterEntityName && this.filterEntityName != '')
      inventoryEntityFilter["searchCode"] = this.filterEntityName;
    if (this.selectItemWarehouseType && this.selectEntityType == 'item')
      inventoryEntityFilter["warehouseTypeId"] = this.selectItemWarehouseType;
    if (this.selectMedicineType && this.selectEntityType == 'medicine')
      inventoryEntityFilter["medicineTypeId"] = this.selectMedicineType;

    this.isLoading = true;
    this.basicService.getAllEntityStockList(inventoryEntityFilter, this.selectEntityType)
      .subscribe(response => {
          if (response) {
            this.printService.onPrintClicked.emit({
              name: 'stockList',
              data: {
                stockList: response.content,
                stockType: this.selectEntityType
              }
            });
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  chkExpireDateFilterChanged() {
    if (this.chkExpireDateFilter)
      this.filterExpireDate = new Date();
    else
      this.filterExpireDate = undefined;
    this.loadDepartmentStock();
  }

  getStockDetail(entityType: any, stockIdList: any) {
    this.orderLineList = undefined;
    this.isLoading = true;
    this.inventoryService.getStockOriginOrderLineList(entityType, stockIdList)
      .subscribe(response => {
          if (response) {
            //console.log(response);
            this.orderLineModalVisible = true;
            this.orderLineList = response.content;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  closeOrderLineModal() {
    this.orderLineModalVisible = false;
  }

}


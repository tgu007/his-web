import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {BasicService} from "../../../../service/basic.service";
import {InventoryService} from "../../../../service/inventory.service";
import {formControlRowTable} from "../../group-common/formControlRowTable";
import * as globals from "../../../../../globals";

@Component({
  selector: 'app-transfer-detail-table',
  templateUrl: './transfer-detail-table.component.html',
  styleUrls: ['./transfer-detail-table.component.css']
})

export class TransferDetailTableComponent extends formControlRowTable implements OnInit {
  @Input() transferForm;
  @Input() transfer;
  @Input() selectedFromWarehouse;
  @Input() orderType;
  dropDownColumnList: any = [];
  nzFilterOption = () => false;
  selectionTablePageSize = globals.selectionPageSize;

  constructor(private fb: FormBuilder,
              message: NzMessageService,
              private basicService: BasicService,
              private inventoryService: InventoryService) {
    super(message);
  }

  ngOnInit() {
    this.setLineArray(<FormArray>this.transferForm.controls['transferLines']);
    this.dropDownColumnList =  ['名称', '规格', '产地', '价格', '当前库存'];
  }


  protected newLineControl() {
    let newLineControl = this.fb.group({
      lineId: [undefined, undefined],
      selectEntity: [undefined, Validators.required],
      numberQuantity: [1, Validators.required],
      selectUom: [undefined, Validators.required],
    });
    return newLineControl;
  }

  searchEntity(dynamicSelectEvent: any, rowIndex: any) {
    if (dynamicSelectEvent == '')
      return;
    if (!this.selectedFromWarehouse) {
      this.message.create("warning", "请选择出库部门")
      return;
    }

    let inventoryEntityFilter = {
      searchCode: dynamicSelectEvent.input,
      stockFilter: {warehouseIdList: [this.selectedFromWarehouse]}
    };
    this.basicService.getSelectionPagedEntityStockList(inventoryEntityFilter, this.orderType, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, rowIndex);
          this.editCache[rowIndex].rowSelectionList["entityListTotalCount"] = response.totalCount;
          this.editCache[rowIndex].rowSelectionList["entityListPageCount"] = response.totalPages;
        }
      });
  }


  //构造DYNAMIC SELECT 组件的值
  private buildItemDynamicSelectionValueList(selectEntityDropdownData: any, rowIndex: any) {
    for (let data of selectEntityDropdownData) {
      let dynamicItemValueList = [];
      let entity = data.stockEntity;
      dynamicItemValueList.push(entity.name);
      dynamicItemValueList.push(entity.warehouseModel);
      dynamicItemValueList.push(entity.manufacturer.name);
      dynamicItemValueList.push(entity.listPrice);
      if (data.stockSummaryList && data.stockSummaryList.length > 0)
        dynamicItemValueList.push(data.stockSummaryList[0].displayQuantity);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.editCache[rowIndex].rowSelectionList["entityList"] = selectEntityDropdownData;
  }

  selectedItemChanged(selectEntity: any, rowIndex: number) {
    this.lineArray.controls [rowIndex]
      .patchValue(
        {selectUom: undefined}
      );
    if (selectEntity) {
      let inventoryEntity = selectEntity.stockEntity;
      this.populateRowUomSelectionList(inventoryEntity, rowIndex);
    }
  }

  private populateRowUomSelectionList(inventroyEntity: any, rowIndex: number) {
//Populate Line uom selection list
    let uomList: any = [];

    uomList.push(inventroyEntity.warehouseUom);
    if ((inventroyEntity.warehouseConversionRate != 1 || inventroyEntity.departmentConversionRate != 1) && (inventroyEntity.warehouseConversionRate != inventroyEntity.departmentConversionRate))
      uomList.push(inventroyEntity.departmentUom)
    if (inventroyEntity.departmentConversionRate != 1)
      uomList.push(inventroyEntity.minSizeUom)

    this.editCache[rowIndex].rowSelectionList["uomList"] = uomList;

    this.lineArray.controls [rowIndex]
      .patchValue(
        {selectUom: uomList[0]}
      );
  }

  getRowSelectedItemProperty(rowIndex: number, propertyName: string) {
    let selectedEntity = this.lineArray.controls [rowIndex].value.selectEntity;
    if (selectedEntity) {
      return selectedEntity.stockEntity[propertyName];
    }
    return undefined;
  }


  hasTransferConfirmed() {
    return this.transfer && this.transfer.transferStatus == '已确认'
  }


  getData() {
    let transferLineList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      let transferLine = {
        uuid: rowControl.value.lineId ? rowControl.value.lineId : undefined,
        quantity: rowControl.value.numberQuantity,
        uomId: rowControl.value.selectUom.uuid,
      };
      let uuid = rowControl.value.selectEntity.stockEntity.uuid;
      if (this.orderType == 'item')
        transferLine["itemId"] = uuid;
      else
        transferLine["medicineId"] = uuid;
      //console.log(orderLineList,orderLine);
      transferLineList.push(transferLine);
    }
    return transferLineList;
  }

  patchTableFromValue(lineList: any) {
    for (let line of lineList) {
      this.addLineControl(false);
      let rowIndex = this.lineArray.controls.length - 1;

      //line.item["originPurchaseOrderLine"] = line.originPurchaseLine;
      let itemArray;
      if (this.orderType == "item") {
        itemArray = [{stockEntity: line.item}];
        this.populateRowUomSelectionList(line.item, rowIndex);
      } else {
        itemArray = [{stockEntity: line.medicine}];
        this.populateRowUomSelectionList(line.medicine, rowIndex);
      }
      this.buildItemDynamicSelectionValueList(itemArray, rowIndex);


      let transferLineControl = this.lineArray.controls [rowIndex];
      transferLineControl.patchValue({
          selectEntity: itemArray[0],
          numberQuantity: line.quantity,
          lineId: line.uuid,
          selectUom: this.editCache[rowIndex].rowSelectionList.uomList.find(uom => uom.uuid === line.uom.uuid)
        }
      );
    }
  }

}

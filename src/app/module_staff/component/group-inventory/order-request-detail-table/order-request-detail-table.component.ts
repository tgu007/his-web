import {Component, Input, OnInit} from '@angular/core';
import * as globals from "../../../../../globals";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {BasicService} from "../../../../service/basic.service";
import {InventoryService} from "../../../../service/inventory.service";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {formControlRowTable} from "../../group-common/formControlRowTable";

@Component({
  selector: 'app-order-request-detail-table',
  templateUrl: './order-request-detail-table.component.html',
  styleUrls: ['./order-request-detail-table.component.css']
})
export class OrderRequestDetailTableComponent extends formControlRowTable implements OnInit {
  @Input() orderRequestForm;
  @Input() orderRequest;
  @Input() orderType: any;
  dropDownColumnList: any = [];
  formatterDollar = (value: number) => `￥ ${value}`;
  parserDollar = (value: string) => value.replace('￥ ', '');
  pageCount: any;
  orderRequestPermission: any;
  selectionTablePageSize = globals.selectionPageSize;

  constructor(private fb: FormBuilder,
              message: NzMessageService,
              private basicService: BasicService,
              private inventoryService: InventoryService,
              private datePipe: DatePipe,
              public sessionService: SessionService,) {
    super(message);
    this.orderRequestPermission = this.sessionService.getUserPermission().commonComponent.orderRequestPermission;
  }

  ngOnInit() {
    this.setLineArray(<FormArray>this.orderRequestForm.controls['orderRequestLines']);
    this.dropDownColumnList = ['名称', '规格', this.orderType == 'item' ? '仓库库存' : '药房库存', '产地'];
    if (this.orderType == "medicine") {
      this.dropDownColumnList.push('上月用量');
    }
  }

  protected newLineControl() {
    let newLineControl = this.fb.group({
      lineId: [undefined, undefined],
      selectEntity: [undefined, Validators.required],
      numberRequestQuantity: [1, Validators.required],
      selectRequestUom: [undefined, Validators.required],
      txtReference: [undefined, undefined],
    });
    if (this.orderType == 'medicine') {
      (<FormGroup>newLineControl).addControl("txtLastPeriodUsage", new FormControl(undefined, undefined));
    }

    return newLineControl;
  }


  searchOrderRequestEntity(dynamicSelectEvent: any, rowIndex: any) {
    if (dynamicSelectEvent == '')
      return;

    let entityFilterDto = {searchCode: dynamicSelectEvent.input, enabled: true};
    this.basicService.getSelectionPagedEntityStockList(entityFilterDto, this.orderType, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
      .subscribe(response => {
        if (response) {
          this.buildItemDynamicSelectionValueList(response.content, rowIndex);
          this.editCache[rowIndex].rowSelectionList["dataListTotalCount"] = response.totalCount;
          this.editCache[rowIndex].rowSelectionList["dataListPageCount"] = response.totalPages;
        }
      });
  }


  //构造DYNAMIC SELECT 组件的值
  private buildItemDynamicSelectionValueList(selectEntityDropdownData: any, rowIndex: number) {
    //let dynamicItemList: any = [];
    for (let data of selectEntityDropdownData) {
      let dynamicItemValueList = [];
      dynamicItemValueList.push(data.stockEntity.name);
      dynamicItemValueList.push(data.stockEntity.warehouseModel);
      dynamicItemValueList.push(this.getCurrentQuantity(data, this.orderType == 'item' ? '药库' : '药房'));
      dynamicItemValueList.push(data.stockEntity.manufacturer.name);
      if (this.orderType == "medicine")
        dynamicItemValueList.push(data.lastPeriodUsage);
      data["label"] = dynamicItemValueList[0];
      data["valueList"] = dynamicItemValueList;
    }
    this.editCache[rowIndex].rowSelectionList["entityList"] = selectEntityDropdownData;
  }

  selectedItemChanged(selectedEntity: any, rowIndex: number) {
    this.lineArray.controls [rowIndex]
      .patchValue(
        {selectRequestUom: undefined}
      );

    if (selectedEntity) {
      let inventoryEntity = selectedEntity.stockEntity;
      this.populateRowUomSelectionList(inventoryEntity, rowIndex);

      if (this.orderType == 'medicine')
        this.lineArray.controls [rowIndex]
          .patchValue(
            {txtLastPeriodUsage: selectedEntity.lastPeriodUsage}
          );
    }
  }

  private populateRowUomSelectionList(selectedEntity: any, rowIndex: number) {
//Populate Line uom selection list
    let uomList: any = [];
    uomList.push(selectedEntity.warehouseUom);
    if ((selectedEntity.warehouseConversionRate != 1 || selectedEntity.departmentConversionRate != 1) && (selectedEntity.warehouseConversionRate != selectedEntity.departmentConversionRate))
      uomList.push(selectedEntity.departmentUom)
    if (selectedEntity.departmentConversionRate != 1)
      uomList.push(selectedEntity.minSizeUom)

    this.editCache[rowIndex].rowSelectionList["uomList"] = uomList;

    this.lineArray.controls [rowIndex]
      .patchValue(
        {selectRequestUom: uomList[0]}
      );
  }

  getRowSelectedItemProperty(selectedEntity: any, propertyName: string) {
    //let selectedEntity = this.lineArray.controls [rowIndex].value.selectEntity;
    if (selectedEntity) {
      return selectedEntity.stockEntity[propertyName];
    }
    return undefined;
  }

  getCurrentQuantity(selectedEntity: any, warehouseType: any) {
    if (selectedEntity) {
      if (warehouseType) {
        let warehouseQuantity = selectedEntity.stockSummaryList.find(s => s.warehouse.warehouseType == warehouseType);
        if (warehouseQuantity)
          return warehouseQuantity.displayQuantity;
        else
          return 0 + selectedEntity.stockEntity.warehouseUom.name;
      } else
        return selectedEntity.warehouseDisplayQuantity;
    }
    return undefined;
  }


  getData() {
    let orderRequestLineList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      // let selectedEntity =  rowControl.value.selectEntity.stockEntity;
      let orderRequestLine = {
        uuid: rowControl.value.lineId ? rowControl.value.lineId : undefined,
        requestQuantity: rowControl.value.numberRequestQuantity,
        requestUomId: rowControl.value.selectRequestUom.uuid,
        reference: rowControl.value.txtReference,
      };
      orderRequestLine[this.orderType + 'Id'] = rowControl.value.selectEntity.stockEntity.uuid;

      if (this.orderType == 'medicine')
        orderRequestLine['lastPeriodUsage'] = rowControl.value.txtLastPeriodUsage;
      orderRequestLineList.push(orderRequestLine);
    }
    return orderRequestLineList;
  }

  patchTableFromValue(lineList: any) {
    for (let line of lineList) {
      this.addLineControl(false);
      let rowIndex = this.lineArray.controls.length - 1;

      let itemArray = [line.entityStockSummary];
      this.buildItemDynamicSelectionValueList(itemArray, rowIndex);
      this.populateRowUomSelectionList(itemArray[0].stockEntity, rowIndex);

      let orderLineControl = this.lineArray.controls [rowIndex];
      orderLineControl.patchValue({
        lineId: line.uuid,
        selectEntity: itemArray[0],
        numberRequestQuantity: line.requestQuantity,
        selectRequestUom: this.editCache[rowIndex].rowSelectionList.uomList.find(uom => uom.uuid === line.requestUom.uuid),
        txtReference: line.reference
      });

      if (this.orderType == 'medicine')
        orderLineControl.patchValue({
          txtLastPeriodUsage: line.lastPeriodUsage
        });
    }
  }

  formattedDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  allowLineEdit() {
    if (this.orderRequestPermission.allowEdit && this.orderRequest && (this.orderRequest.status == '已创建' || this.orderRequest.uuid == undefined))
      return true;
    else
      return false;
  }

}

import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService, NzSelectComponent} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {formControlRowTable} from "../../group-common/formControlRowTable";
import {SessionService} from "../../../../service/session.service";
import * as globals from "../../../../../globals";

@Component({
  selector: 'app-order-detail-table',
  templateUrl: './order-detail-table.component.html',
  styleUrls: ['./order-detail-table.component.css']
})
export class OrderDetailTableComponent extends formControlRowTable implements OnInit {
  @Input() orderForm;
  @Input() isReturnOrder = false;
  @Input() order;
  @Input() orderType: any;
  @Input() selectedWarehouse
  dropDownColumnList: any = [];
  nzFilterOption = () => false;
  formatterDollar = (value: number) => `￥ ${value}`;
  parserDollar = (value: string) => value.replace('￥ ', '');
  pageCount: any;
  orderPermission: any;
  selectionTablePageSize = globals.selectionPageSize;
  @ViewChildren(NzSelectComponent)
  nzSelectComponentList: QueryList<NzSelectComponent>;


  constructor(private fb: FormBuilder,
              message: NzMessageService,
              private basicService: BasicService,
              private inventoryService: InventoryService,
              private datePipe: DatePipe,
              public sessionService: SessionService,
  ) {
    super(message);
    this.orderPermission = this.sessionService.getUserPermission().commonComponent.orderpermission;
  }

  ngOnInit() {
    this.setLineArray(<FormArray>this.orderForm.controls['orderLines']);
    if (this.isReturnOrder)
      this.dropDownColumnList = ['订单号', '发票号', '名称', '规格', '原始数量', '单位进价', '总进价', '当前库存'];
    else
      this.dropDownColumnList = ['名称', '规格', '产地'];
  }

  protected newLineControl() {
    let newLineControl = this.fb.group({
      line: [undefined, undefined],
      txtInvoiceNumber: [undefined, undefined],
      selectEntity: [undefined, Validators.required],
      numberQuantity: [1, Validators.required],
      selectUom: [undefined, Validators.required],
      numberCostPrice: [0, Validators.required],
      //txtBatchNumber: [undefined, Validators.required],
      selectManufacturer: [undefined, undefined]
    });
    if (this.orderType == 'medicine') {
      (<FormGroup>newLineControl).addControl("txtBatchNumber", new FormControl(undefined, Validators.required));
      (<FormGroup>newLineControl).addControl("txtBatchText", new FormControl(undefined, undefined));
      (<FormGroup>newLineControl).addControl("dateExpireDate", new FormControl(undefined, Validators.required));
    }

    if (this.orderType == 'item') {
      (<FormGroup>newLineControl).addControl("txtBatchNumber", new FormControl(undefined, undefined));
      (<FormGroup>newLineControl).addControl("selectBrand", new FormControl(undefined, undefined));
    }
    return newLineControl;
  }

  searchOrderEntity(dynamicSelectEvent: any, rowIndex: any) {
    if (dynamicSelectEvent == '')
      return;
    if (this.isReturnOrder && !this.selectedWarehouse) {
      this.message.create("warning", "请选择出库部门")
      return;
    }

    if (this.isReturnOrder) {
      let stockFilter = {warehouseIdList: [this.selectedWarehouse], searchCode: dynamicSelectEvent.input};

      this.inventoryService.getPagedOriginOrderList(stockFilter, this.orderType, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
        .subscribe(response => {
          if (response) {
            this.buildItemDynamicSelectionValueList(response.content, rowIndex);
            this.editCache[rowIndex].rowSelectionList["dataListTotalCount"] = response.totalCount;
            this.editCache[rowIndex].rowSelectionList["dataListPageCount"] = response.totalPages;
          }
        });
    } else {
      let entityFilterDto = {searchCode: dynamicSelectEvent.input, enabled: true};
      this.basicService.getSelectionPagedEntityList(entityFilterDto, this.orderType, dynamicSelectEvent.pageNumber, this.selectionTablePageSize)
        .subscribe(response => {
          if (response) {

            //this.editCache[rowIndex].rowSelectionList["itemList"] =
            this.buildItemDynamicSelectionValueList(response.content, rowIndex);
            this.editCache[rowIndex].rowSelectionList["dataListTotalCount"] = response.totalCount;
            this.editCache[rowIndex].rowSelectionList["dataListPageCount"] = response.totalPages;
          }
        });
    }

  }


  //构造DYNAMIC SELECT 组件的值
  private buildItemDynamicSelectionValueList(selectEntityDropdownData: any, rowIndex: number) {
    //let dynamicItemList: any = [];
    for (let data of selectEntityDropdownData) {
      let dynamicItemValueList = [];
      if (!this.isReturnOrder) {
        dynamicItemValueList.push(data.name);
        dynamicItemValueList.push(data.warehouseModel);
        dynamicItemValueList.push(data.manufacturer.name);
        data["label"] = dynamicItemValueList[0];
      } else {

        let originOrderLine = data.originPurchaseOrderLine;
        let originEntity;
        if (this.orderType == 'item')
          originEntity = originOrderLine.item;
        else
          originEntity = originOrderLine.medicine;

        dynamicItemValueList.push(originOrderLine.orderNumber);
        dynamicItemValueList.push(originOrderLine.invoiceNumber);
        dynamicItemValueList.push(originEntity.name);
        dynamicItemValueList.push(originEntity.warehouseModel);
        dynamicItemValueList.push(originOrderLine.quantity + originOrderLine.uom.name);
        dynamicItemValueList.push(originOrderLine.cost);
        dynamicItemValueList.push(originOrderLine.totalCost);
        dynamicItemValueList.push(data.warehouseDisplayQuantity);
        data["label"] = dynamicItemValueList[2];
      }
      data["valueList"] = dynamicItemValueList;
    }
    if (this.isReturnOrder)
      this.editCache[rowIndex].rowSelectionList["originOrderLineList"] = selectEntityDropdownData;
    else
      this.editCache[rowIndex].rowSelectionList["entityList"] = selectEntityDropdownData;
  }

  selectedItemChanged(selectedEntity: any, rowIndex: number) {
    this.lineArray.controls [rowIndex]
      .patchValue(
        {selectUom: undefined}
      );


    if (selectedEntity) {
      if (this.isReturnOrder) {
        let entity;
        if (this.orderType == 'medicine')
          entity = selectedEntity.originPurchaseOrderLine.medicine;
        else
          entity = selectedEntity.originPurchaseOrderLine.item;
        this.populateRowUomSelectionList(entity, rowIndex);
        this.copyOriginalOrderLineInfo(selectedEntity, rowIndex);
      } else {
        this.populateRowUomSelectionList(selectedEntity, rowIndex);
        this.populateManufactureSelectionList(selectedEntity, rowIndex)
      }
    }
  }


  private copyOriginalOrderLineInfo(selectedEntity: any, rowIndex: number) {
    let orderLineControl = this.lineArray.controls [rowIndex];
    let originPurchaseOrderLine = selectedEntity.originPurchaseOrderLine;
    orderLineControl.patchValue({
      txtInvoiceNumber: originPurchaseOrderLine.invoiceNumber,
      numberQuantity: originPurchaseOrderLine.quantity,
      selectUom: this.editCache[rowIndex].rowSelectionList["uomList"].find(u => u.uuid == originPurchaseOrderLine.uom.uuid),
      numberCostPrice: originPurchaseOrderLine.cost,
      selectManufacturer: originPurchaseOrderLine.manufacturer,
      txtBatchNumber: originPurchaseOrderLine.batchNumber,
    })

    if (this.orderType == 'medicine')
      orderLineControl.patchValue({
        txtBatchText: originPurchaseOrderLine.batchText,
        dateExpireDate: originPurchaseOrderLine.expireDate,
      })

    if (this.orderType == 'item')
      orderLineControl.patchValue({
        selectBrand: originPurchaseOrderLine.brand,
      })
  }

  private populateManufactureSelectionList(selectedEntity: any, rowIndex: number) {
    let manufacturerList: any = [];
    if (selectedEntity)
      manufacturerList = [selectedEntity.manufacturer]
    //console.log(selectedEntity);
    this.editCache[rowIndex].rowSelectionList["manufactureList"] = manufacturerList;

    if (manufacturerList.length > 0)
      this.lineArray.controls [rowIndex]
        .patchValue(
          {selectManufacturer: manufacturerList[0]}
        );
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
        {selectUom: uomList[0]}
      );
  }

  getRowSelectedItemProperty(rowIndex: number, propertyName: string) {
    let selectedEntity = this.lineArray.controls [rowIndex].value.selectEntity;
    if (selectedEntity) {
      if (this.isReturnOrder) {
        if (this.orderType == 'item')
          return selectedEntity.originPurchaseOrderLine.item[propertyName];
        else
          return selectedEntity.originPurchaseOrderLine.medicine[propertyName];
      } else
        return selectedEntity[propertyName];
    }
    return undefined;
  }


  getData() {
    let orderLineList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      let selectedEntity = rowControl.value.selectEntity;
      let orderLine = {
        uuid: rowControl.value.line ? rowControl.value.line.uuid : undefined,
        quantity: rowControl.value.numberQuantity,
        cost: rowControl.value.numberCostPrice,
        invoiceNumber: rowControl.value.txtInvoiceNumber,
        uomId: rowControl.value.selectUom.uuid,
        originPurchaseLineId: this.isReturnOrder ? selectedEntity.originPurchaseOrderLine.uuid : undefined,
        batch: rowControl.value.txtBatchNumber,
        manufacturerId: rowControl.value.selectManufacturer ? rowControl.value.selectManufacturer.uuid : undefined,
      };
      if (this.orderType == 'item') {
        orderLine['itemId'] = this.isReturnOrder ? selectedEntity.originPurchaseOrderLine.item.uuid : selectedEntity.uuid;
        orderLine['brandId'] =  rowControl.value.selectBrand ? rowControl.value.selectBrand.uuid : undefined;
      } else {
        orderLine['medicineId'] = this.isReturnOrder ? selectedEntity.originPurchaseOrderLine.medicine.uuid : selectedEntity.uuid;
        orderLine['batchText'] = rowControl.value.txtBatchText;
        orderLine['expireDate'] = this.datePipe.transform(rowControl.value.dateExpireDate, 'yyyy-MM-dd HH:mm:ss');
      }
      //console.log(orderLineList,orderLine);
      orderLineList.push(orderLine);
    }
    return orderLineList;
  }

  patchTableFromValue(lineList: any) {
    for (let line of lineList) {
      this.addLineControl(false);
      let rowIndex = this.lineArray.controls.length - 1;

      if (this.isReturnOrder)
        if (this.orderType == 'item')
          line.item["originPurchaseOrderLine"] = line.originPurchaseLine;
        else
          line.medicine["originPurchaseOrderLine"] = line.originPurchaseLine;
      let itemArray = []
      if (this.orderType == 'item')
        itemArray.push(line.item);
      else
        itemArray.push(line.medicine);

      this.buildItemDynamicSelectionValueList(itemArray, rowIndex);
      this.populateRowUomSelectionList(itemArray[0], rowIndex);
      this.populateManufactureSelectionList(itemArray[0], rowIndex)
      // line.item["label"] = line.item
      if (line.brand)
        this.editCache[rowIndex].rowSelectionList["brandList"] = [line.brand];

      let orderLineControl = this.lineArray.controls [rowIndex];
      orderLineControl.patchValue({
        txtInvoiceNumber: line.invoiceNumber,
        selectEntity: itemArray[0],
        numberQuantity: line.quantity,
        line: line,
        selectUom: this.editCache[rowIndex].rowSelectionList.uomList.find(uom => uom.uuid === line.uom.uuid),
        numberCostPrice: line.cost,
        txtBatchNumber: line.batchNumber,
        selectManufacturer: line.manufacturer ? this.editCache[rowIndex].rowSelectionList.manufactureList.find(man => man.uuid === line.manufacturer.uuid) : undefined,

      });
      if (this.orderType == 'medicine')
        orderLineControl.patchValue({
          txtBatchText: line.batchText,
          dateExpireDate: line.expireDate,
        });

      if (this.orderType == 'item')
        orderLineControl.patchValue({
          selectBrand: line.brand ? this.editCache[rowIndex].rowSelectionList.brandList.find(brand => brand.uuid === line.brand.uuid) : undefined,
        });
    }
  }

  formattedDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  allowEdit() {
    if (this.order) {
      if (this.orderPermission.allowEdit && (!this.order.uuid || this.order.orderStatus == '已创建'))
        return true;

      if (this.order.orderStatus == '已批准' && this.orderPermission.editAfterApprove)
        return true;
    }
    return false;
  }

  searchBrand(input: string, rowIndex: number) {
    if (input == '')
      return;
    //Item
    let brandType = 1;
    if (this.orderType == 'medicine')
      brandType = 0; //medicine
    let brandFilter = {searchCode: input, brandType: brandType};
    this.basicService.getBrandList(brandFilter)
      .subscribe(response => {
        if (response) {
          this.editCache[rowIndex].rowSelectionList.brandList = response.content;
        }
      });
  }

  addBrand(branName: any, rowIndex: number) {
    this.basicService.quickAddBrand({
      name: branName.value,
      entityType: this.orderType == 'medicine' ? 0 : 1,
    }).subscribe(response => {
      if (response) {
        this.editCache[rowIndex].rowSelectionList.brandList = [response.content];
        let orderLineControl = this.lineArray.controls [rowIndex];
        orderLineControl.patchValue({selectBrand: response.content});
        let openedSelectComponent = this.nzSelectComponentList.find(s => s.open);
        if (openedSelectComponent)
          openedSelectComponent.closeDropDown();
      }
    });
  }
}


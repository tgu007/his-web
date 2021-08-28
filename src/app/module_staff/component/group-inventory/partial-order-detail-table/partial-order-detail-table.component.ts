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
  selector: 'app-partial-order-detail-table',
  templateUrl: './partial-order-detail-table.component.html',
  styleUrls: ['./partial-order-detail-table.component.css']
})
export class PartialOrderDetailTableComponent extends formControlRowTable implements OnInit {
  @Input() orderForm;
  @Input() order;
  @Input() orderType: any;
  nzFilterOption = () => false;
  formatterDollar = (value: number) => `￥ ${value}`;
  parserDollar = (value: string) => value.replace('￥ ', '');
  pageCount: any;
  orderPermission: any;
  selectionTablePageSize = globals.selectionPageSize;

  constructor(private fb: FormBuilder,
              message: NzMessageService,
              private basicService: BasicService,
              private inventoryService: InventoryService,
              private datePipe: DatePipe,
              public sessionService: SessionService) {
    super(message);
    this.orderPermission = this.sessionService.getUserPermission().commonComponent.partialOrderPermission;
  }

  ngOnInit() {
    this.setLineArray(<FormArray>this.orderForm.controls['orderLines']);
  }

  protected newLineControl() {
    let newLineControl = this.fb.group({
      line: [undefined, undefined],
      numberQuantity: [1, Validators.required],
      selectUom: [undefined, Validators.required],
      txtReference: [undefined, undefined],
    });
    return newLineControl;
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

  getData() {
    let orderLineList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      let orderLine = {
        uuid: rowControl.value.line ? rowControl.value.line.uuid : undefined,
        quantity: rowControl.value.numberQuantity,
        uomId: rowControl.value.selectUom.uuid,
        masterOrderLineId: rowControl.value.line.masterOrderLine.uuid,
        reference: rowControl.value.txtReference
      };
      orderLineList.push(orderLine);
    }
    return orderLineList;
  }

  patchTableFromValue(lineList: any) {
    for (let line of lineList) {
      this.addLineControl(false);
      let rowIndex = this.lineArray.controls.length - 1;
      let entity;
      if (this.orderType == 'item')
        entity = line.masterOrderLine.item;
      else
        entity = line.masterOrderLine.medicine;

      this.populateRowUomSelectionList(entity, rowIndex);

      let orderLineControl = this.lineArray.controls [rowIndex];
      orderLineControl.patchValue({
        numberQuantity: line.quantity,
        line: line,
        selectUom: this.editCache[rowIndex].rowSelectionList.uomList.find(uom => uom.uuid === line.uom.uuid),
        txtReference: line.reference,
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
    }
    return false;
  }

}

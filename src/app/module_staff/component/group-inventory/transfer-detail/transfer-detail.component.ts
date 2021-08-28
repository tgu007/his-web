import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {TransferDetailTableComponent} from "../transfer-detail-table/transfer-detail-table.component";
import {FormBuilder, Validators} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService, NzSelectComponent} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-transfer-detail',
  templateUrl: './transfer-detail.component.html',
  styleUrls: ['./transfer-detail.component.css']
})
export class TransferDetailComponent implements OnInit {
  transferForm: any;
  @ViewChild(TransferDetailTableComponent, {static: true}) transferLineTableComponent: TransferDetailTableComponent;
  fromWarehouseList: any = [];
  toWarehouseList: any = [];
  transfer;
  @Output() transferListRefreshRequiredEvent = new EventEmitter<any>();
  @Input() fromWarehouseType: any;
  @Input() toWarehouseType: any;
  pramInitialized: any = false;
  @Input() orderType;
  @Input() transferType: any;
  isLoading: any = false;
  updatingInventory: any = false;
  saving: boolean = false;
  deleting: any = false;
  statusUpdating: any = false;
  @ViewChildren(NzSelectComponent)
  nzSelectComponentList: QueryList<NzSelectComponent>;

  //0 transfer in 1 transfer out

  constructor(private fb: FormBuilder, private inventoryService: InventoryService,
              private basicService: BasicService,
              private message: NzMessageService,
              private datePipe: DatePipe,
              public sessionService: SessionService,) {
  }

  ngOnInit() {
    this.transferForm = this.fb.group({
      selectFromWarehouse: [undefined, [Validators.required]],
      selectToWarehouse: [undefined, [Validators.required]],
      dateTransferDate: ["", [Validators.required]],
      txtReference: ["", null],
      transferLines: this.fb.array([])
    });
    this.transferForm.patchValue({dateTransferDate: Date()});
  }


  private loadWarehouseList() {
    this.basicService.getWarehouseList({})
      .subscribe(response => {
        if (response) {
          this.filterWarehouseResponse(response.content);
          this.transferForm.patchValue(
            {
              selectToWarehouse: this.toWarehouseList.length > 0 ? this.toWarehouseList[0].uuid : undefined,
              selectFromWarehouse: this.fromWarehouseList.length > 0 ? this.fromWarehouseList[0].uuid : undefined,
            });
        }
      });
    this.pramInitialized = true;
  }


  private filterWarehouseResponse(allWarehouseList: any) {
    this.toWarehouseList = allWarehouseList.filter(w => this.toWarehouseType.indexOf(w.warehouseType) >= 0);
    this.fromWarehouseList = allWarehouseList.filter(w => this.fromWarehouseType.indexOf(w.warehouseType) >= 0);
    if (!this.sessionService.getUserPermission().fullWarehousePermission) {
      let permittedWarehouseIdList = this.sessionService.loginUser.warehouseIdList;
      if (this.transferType == 'in')
        this.toWarehouseList = this.toWarehouseList.filter(w => permittedWarehouseIdList.indexOf(w.uuid) >= 0);
      else
        this.fromWarehouseList = this.fromWarehouseList.filter(w => permittedWarehouseIdList.indexOf(w.uuid) >= 0);
    }
  }

  private loadTransferDetail() {
    this.isLoading = true;
    this.inventoryService.getTransferDetail(this.transfer.uuid, this.orderType)
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          this.transfer = response.content
          this.patchFormValue();
        }
      });
  }

  private patchFormValue() {
    this.transferForm.patchValue(
      {
        selectFromWarehouse: this.transfer.fromWarehouse.uuid,
        dateTransferDate: this.transfer.transferDate,
        txtReference: this.transfer.reference,
        selectToWarehouse: this.transfer.toWarehouse.uuid,
      });

    this.transferLineTableComponent.patchTableFromValue(this.transfer.lineList);
  }

  resetUi(transfer: any, transferLoaded: boolean = false) {
    this.transfer = transfer;
    this.transferLineTableComponent.transfer = transfer;
    if (!this.pramInitialized)
      this.loadWarehouseList();
    this.transferForm.reset();
    this.transferLineTableComponent.resetUi();

    this.transferForm.patchValue(
      {
        dateTransferDate: Date(),
        selectToWarehouse: this.toWarehouseList.length > 0 ? this.toWarehouseList[0].uuid : undefined,
        selectFromWarehouse: this.fromWarehouseList.length > 0 ? this.fromWarehouseList[0].uuid : undefined,
      });

    if (this.transfer.uuid) {
      if (transferLoaded)
        this.patchFormValue();
      else
        this.loadTransferDetail();
    }
  }


  btnNewLineClicked() {
    this.transferLineTableComponent.addLineControl()
  }


  saveTransfer() {
    if (!this.transferLineTableComponent.allLineCommitted())
      return;
    if (!this.transferForm.valid) {
      FormValidator.validateFormInput(this.transferForm);
      this.message.create("error", `验证错误`);
      return;
    }

    let transfer = this.getData();
    this.saving = true;
    this.inventoryService.saveTransfer(transfer, this.orderType)
      .subscribe(response => {
        if (response) {
          this.message.create("success", "保存成功");
          //TODO 此处不应该再从数据库读取一遍，直接更新UI就可以
          this.resetUi(response.content, true);
          this.transferListRefreshRequiredEvent.emit(false);
          this.saving = false;
        }
      });
  }


  private getData() {
    let transferLineList: any[] = this.transferLineTableComponent.getData();

    const data = this.transferForm.value;
    return {
      uuid: this.transfer ? this.transfer.uuid : undefined,
      reference: data.txtReference,
      transferStatus: this.transfer && this.transfer.transferStatus ? this.transfer.transferStatus : 0,
      fromWarehouseId: data.selectFromWarehouse,
      toWarehouseId: data.selectToWarehouse,
      transferDate: this.datePipe.transform(data.dateTransferDate, 'yyyy-MM-dd HH:mm:ss'),
      transferLineList: transferLineList
    };
  }

  disableSelectFromWarehouse() {
    let tableLineArray = this.transferLineTableComponent.lineArray;
    if (tableLineArray && tableLineArray.controls.length > 0)
      return true;
    else
      return false;
  }

  confirmTransfer() {

    this.updatingInventory = true;
    this.inventoryService.confirmTransfer(this.transfer.uuid, this.orderType)
      .subscribe(response => {
          if (response) {
            this.message.create("success", `调拨成功`);
            this.transfer = response.content;
            this.transferListRefreshRequiredEvent.emit(false);
            this.updatingInventory = false;
          }
        },
        error => {
          this.message.create("error", `调拨失败`);
          this.updatingInventory = false;
        }
      );
  }

  deleteTransfer() {
    this.deleting = true;
    this.inventoryService.deleteTransfer(this.transfer.uuid, this.orderType)
      .subscribe(response => {
          this.message.create("success", `删除成功`);
          this.transferListRefreshRequiredEvent.emit(true);
          this.deleting = false;
        },
        error => {
          this.message.create("error", `删除失败`);
          this.deleting = false;
        });
  }

  updateTransferStatus(action: any, transferStatus: any) {
    let updateDto = {transferStatus: transferStatus, uuid: this.transfer.uuid};
    this.statusUpdating = true;
    this.inventoryService.updateTransferStatus(updateDto, this.orderType, action)
      .subscribe(response => {

          this.statusUpdating = false;
          if (this.transfer.toWarehouse.warehouseType == '后勤库房') //不审核，直接出库
            this.confirmTransfer();
          else {
            this.message.create("success", `操作成功`);
            this.transfer.transferStatus = transferStatus;
            this.transferListRefreshRequiredEvent.emit(false);
          }
        },
        error => {
          this.message.create("error", `操作失败`);
          this.statusUpdating = false;
        });
  }

  addLevelTwoWarehouse(input: any,) {
    const value = input.value;
    this.basicService.quickAddLevelTwoWarehouse({
      name: value
    }).subscribe(response => {
      if (response) {
        this.toWarehouseList = [response.content];
        this.transferForm.patchValue(
          {
            selectToWarehouse: response.content.uuid,
          });
        let openedSelectComponent = this.nzSelectComponentList.find(s => s.open);
        if (openedSelectComponent)
          openedSelectComponent.closeDropDown();
      }
    });
  }

}

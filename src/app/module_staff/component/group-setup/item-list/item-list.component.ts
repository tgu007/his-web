import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {InventoryService} from "../../../../service/inventory.service";
import * as globals from "../../../../../globals";
import {MedicineDetailComponent} from "../medicine-detail/medicine-detail.component";
import {ItemDetailComponent} from "../item-detail/item-detail.component";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {UEditorComponent} from "ngx-ueditor";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  @Input() controlMode:any;
  filterItemName: any;
  itemList: any;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  itemDetailModalVisible: any = false;
  @ViewChild(ItemDetailComponent, {static: true}) itemDetailComponent: ItemDetailComponent;
  chkIncludeDisable: any = false;
  isLoading: any;
  warehouseTypeList: any;
  selectWarehouseType: any;
  filterOnNotUploaded: any = false;
  filterOnNotMatched: any = false;

  constructor(private inventoryService: InventoryService,
              private basicService: BasicService,
              private message: NzMessageService,) {
  }

  ngOnInit() {
    this.callLoadItemService({enabled: true});
    this.basicService.getWarehouseTypeList()
      .subscribe(response => {
        if (response) {
          this.warehouseTypeList = response.content;
        }
      });
  }

  searchItem() {
    this.currentPageIndex = 1
    this.reloadItemList();
  }

  private callLoadItemService(searchCodeDto: {}) {
    this.isLoading = true;
    this.basicService.getPagedItemList(searchCodeDto, this.currentPageIndex)
      .subscribe(response => {
          if (response) {
            this.itemList = response.content;
            this.totalDataCount = response.totalCount;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  reloadItemList() {
    let searchCodeDto;
    if (this.filterItemName == undefined || this.filterItemName == '')
      searchCodeDto = {};
    else
      searchCodeDto = {searchCode: this.filterItemName}
    if (this.chkIncludeDisable == false)
      searchCodeDto["enabled"] = true;

    if (this.selectWarehouseType)
      searchCodeDto["warehouseTypeId"] = this.selectWarehouseType;

    searchCodeDto["ybNotUploaded"] = this.filterOnNotUploaded;
    searchCodeDto["ybNotMatched"] = this.filterOnNotMatched;
    this.callLoadItemService(searchCodeDto);
  }

  reloadItemClicked() {
    this.currentPageIndex = 1
    this.filterItemName = undefined;
    this.reloadItemList();
  }

  handleCancel() {
    this.itemDetailModalVisible = false;
  }

  saveItem() {
    this.itemDetailComponent.saveItem();
  }

  initItemDetailModal(item: any = undefined) {
    this.itemDetailComponent.resetUI(item);
    this.itemDetailModalVisible = true;
  }

  onItemSaved(item: any) {
    //this.itemDetailModalVisible = false;
    this.reloadItemList();
  }

  updateFeeSetting(item: any) {
    let reqDto ={};
    reqDto["uuid"] = item.uuid;
    reqDto["allowAutoFee"] = item.allowAutoFee;
    reqDto["prescriptionRequired"] = item.prescriptionRequired;
    this.basicService.updateFeeSetting('item', reqDto).subscribe(response => {
        this.reloadItemList();
        this.isLoading = false;
      },
      error => {
        this.message.create("error", error.error.message);
        this.isLoading = false;
      });
  }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import {ItemDetailComponent} from "../../group-setup/item-detail/item-detail.component";
import {ChargeableItemDetailComponent} from "../chargeable-item-detail/chargeable-item-detail.component";
import * as globals from "../../../../../globals";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {InternalAccountService} from "../../../../service/internal-account.service";

@Component({
  selector: 'app-chargeable-item-list',
  templateUrl: './chargeable-item-list.component.html',
  styleUrls: ['./chargeable-item-list.component.css']
})
export class ChargeableItemListComponent implements OnInit {
  filterItemName: any;
  isLoading: any = false;
  itemList: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  totalDataCount: any;
  itemDetailModalVisible: any = false;
  @ViewChild(ChargeableItemDetailComponent, {static: true}) itemDetailComponent: ChargeableItemDetailComponent;

  constructor(
              private internalAccountService: InternalAccountService,
              private message: NzMessageService,) { }

  ngOnInit() {
    this.loadItemList();
  }

  searchItem() {
    this.currentPageIndex = 1
    this.loadItemList();
  }

  initItemDetailModal(item: any = undefined) {
    this.itemDetailComponent.resetUI(item);
    this.itemDetailModalVisible = true;
  }

  reloadItemClicked() {
    this.filterItemName = undefined
    this.loadItemList();
  }

  loadItemList() {
    this.isLoading = true;
    let searchCode;
    if (this.filterItemName == undefined || this.filterItemName == '')
      searchCode = {};
    else
      searchCode = {searchCode: this.filterItemName}
    this.internalAccountService.getPagedItemList(searchCode, this.currentPageIndex)
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

  handleCancel() {
    this.itemDetailModalVisible = false;
  }

  saveChargeableItem() {
    this.itemDetailComponent.saveItem();
  }

  onItemSaved($event: any) {
    this.loadItemList();
  }
}

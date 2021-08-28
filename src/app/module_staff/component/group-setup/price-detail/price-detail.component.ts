import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import * as globals from "../../../../../globals"
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-price-detail',
  templateUrl: './price-detail.component.html',
  styleUrls: ['./price-detail.component.css']
})
export class PriceDetailComponent implements OnInit, AfterViewInit {
  @Input() entityType;
  filterEntityName: any;
  totalDataCount: any;
  entityList: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  medicineTypeList: any;
  selectMedicineType: any;
  loading: any = false;
  chekYBPrice: any = false;
  pendingPriceUpdate: any = false;

  constructor(private basicService: BasicService,
              public sessionService: SessionService,
              private message: NzMessageService) {
  }

  ngOnInit() {
    if (this.entityType == 'medicine') {
      this.basicService.getMedicineTypeList()
        .subscribe(response => {
          if (response) {
            this.medicineTypeList = response.content;
          }
        });
    }
  }


  ngAfterViewInit(): void {
    this.loadEntityList();
  }

  reloadEntityClicked() {
    this.currentPageIndex = 1
    this.filterEntityName = undefined;
    this.entityList = undefined;
    this.loadEntityList();
  }

  searchEntity() {
    this.currentPageIndex = 1
    this.loadEntityList();
  }

  loadEntityList() {
    let searchCodeDto;
    if (this.filterEntityName == undefined || this.filterEntityName == '')
      searchCodeDto = {enabled: true};
    else
      searchCodeDto = {searchCode: this.filterEntityName, enabled: true};

    if (this.entityType == 'item')
      searchCodeDto["chargeableItem"] = true;
    else if (this.entityType == 'medicine')
      searchCodeDto["medicineTypeId"] = this.selectMedicineType;
    else if (this.entityType == 'treatment')
      searchCodeDto["excludeCombo"] = true

    searchCodeDto["checkYbPrice"] = this.chekYBPrice;
    searchCodeDto["pendingPriceUpdate"] = this.pendingPriceUpdate;

    this.basicService.getPagedEntityList(searchCodeDto, this.entityType, this.currentPageIndex)
      .subscribe(response => {
        if (response) {
          this.entityList = response.content;
          this.totalDataCount = response.totalCount;
        }
      });
  }


  editPrice(entity: any) {
    entity["inEdit"] = true;
    entity["beforeEditPrice"] = entity.pendingListPrice;
  }

  cancelEditPrice(entity: any) {
    entity["inEdit"] = false;
    entity["pendingListPrice"] = entity.beforeEditPrice
  }

  submitNewPrice(entity: any) {
    let newPriceDto = {uuid: entity.uuid, price: entity.pendingListPrice};
    this.loading = true;
    this.basicService.submitEntityPrice(newPriceDto, this.entityType)
      .subscribe(
        response => {
          entity["inEdit"] = false;
          this.message.create("success", `新价格修改请求提交成功`);
          this.loading = false;
        },
        error => {
          this.loading = false
          this.message.create("error", error.error.message);
        }
      );

  }

  confirmPendingPrice(data: any) {
    this.loading = true;
    this.basicService.confirmEntityPrice(data.uuid, this.entityType)
      .subscribe(
        response => {
          data.pendingListPrice = response.content.pendingListPrice;
          data.listPrice = response.content.listPrice;
          this.message.create("success", `新价格已经生效`);
          this.loading = false;
        },
        error => {
          this.loading = false
          this.message.create("error", error.error.message);
        }
      );
  }
}

import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as globals from "../../../../../globals";
import {ItemDetailComponent} from "../item-detail/item-detail.component";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {TreatmentDetailComponent} from "../treatment-detail/treatment-detail.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-treatment-list',
  templateUrl: './treatment-list.component.html',
  styleUrls: ['./treatment-list.component.css']
})
export class TreatmentListComponent implements OnInit {
  @Input() controlMode: any;
  filterTreatmentName: any;
  treatmentList: any;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  treatmentDetailModalVisible: any = false;
  @ViewChild(TreatmentDetailComponent, {static: true}) treatmentDetailComponent: TreatmentDetailComponent;
  chkIncludeDisable: any = false;
  isLoading: any;
  filterOnNotUploaded: any = false;
  filterOnNotMatched: any = false;
  selectedDepartmentTypeList: any = [];
  departmentTypeList: any = ['病区科室', '康复科室', '放射科', '检验科', '病理科', 'B超室'];
  filterLastModifiedBy: any;
  filterDateRange: any;

  constructor(
    private basicService: BasicService,
    private message: NzMessageService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.callLoadTreatmentService({enabled: true});
  }

  searchTreatment() {
    this.currentPageIndex = 1
    this.reloadTreatmentList();
  }

  private callLoadTreatmentService(searchCodeDto: {}) {
    this.isLoading = true;
    this.basicService.getPagedTreatmentList(searchCodeDto, this.currentPageIndex)
      .subscribe(response => {
          if (response) {
            this.treatmentList = response.content;
            this.totalDataCount = response.totalCount;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  reloadTreatmentList() {
    let searchCodeDto;
    if (this.filterTreatmentName == undefined || this.filterTreatmentName == '')
      searchCodeDto = {};
    else
      searchCodeDto = {searchCode: this.filterTreatmentName}
    if (this.chkIncludeDisable == false)
      searchCodeDto["enabled"] = true;
    searchCodeDto["treatmentTypeList"] = this.selectedDepartmentTypeList;

    searchCodeDto["ybNotUploaded"] = this.filterOnNotUploaded;
    searchCodeDto["ybNotMatched"] = this.filterOnNotMatched;

    if (this.filterDateRange != undefined) {
      searchCodeDto["modifyStartDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd');
      searchCodeDto["modifyEndDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd');
    }

    if (this.filterDateRange != undefined) {
      searchCodeDto["modifiedBy"] = this.filterLastModifiedBy;
    }
    this.callLoadTreatmentService(searchCodeDto);
  }

  reloadTreatmentClicked() {
    this.currentPageIndex = 1
    this.filterTreatmentName = undefined;
    this.reloadTreatmentList();
  }

  handleCancel() {
    this.treatmentDetailModalVisible = false;
  }

  saveTreatment() {
    this.treatmentDetailComponent.saveTreatment();
  }

  initTreatmentDetailModal(treatment: any = undefined) {
    this.treatmentDetailComponent.resetUI(treatment);
    this.treatmentDetailModalVisible = true;
  }

  onTreatmentSaved(treatment: any) {
    this.treatmentDetailModalVisible = false;
    this.reloadTreatmentList();
  }

  updateFeeSetting(treatment: any) {
    let reqDto = {};
    reqDto["uuid"] = treatment.uuid;
    reqDto["allowAutoFee"] = treatment.allowAutoFee;
    reqDto["allowManualFee"] = treatment.allowManualFee;
    reqDto["prescriptionRequired"] = treatment.prescriptionRequired;
    reqDto["defaultAutoFee"] = treatment.defaultAutoFee;
    reqDto["showInCard"] = treatment.showInCard;
    this.basicService.updateFeeSetting('treatment', reqDto).subscribe(response => {
        this.reloadTreatmentList();
        this.isLoading = false;
      },
      error => {
        this.message.create("error", error.error.message);
        this.isLoading = false;
      });

  }

}

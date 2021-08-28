import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MedicineDetailComponent} from "../medicine-detail/medicine-detail.component";
import * as globals from "../../../../../globals";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {MedicineMatchComponent} from "../../group-yb/medicine-match/medicine-match.component";


@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  @Input() controlMode: any;
  medicineDetailModalVisible: any = false;
  @ViewChild(MedicineDetailComponent, {static: true}) medicineDetailComponent: MedicineDetailComponent;
  @ViewChild(MedicineMatchComponent, {static: true}) medicineMatchComponent: MedicineMatchComponent;
  medicineList: any;
  totalDataCount: any;
  currentPageIndex: any = 1;
  tablePageSize = globals.tablePageSize;
  filterMedicineName: any;
  chkIncludeDisable: any = false;
  isLoading: any = false;
  selectMedicineType: any;
  medicineTypeList: any;
  fixServeUom: any;
  fixMinUom: any;
  filterOnNotUploaded: any = false;
  filterOnNotMatched: any = false;
  chkCenterMedicineExpired: any = false;

  constructor(private inventoryService: InventoryService,
              private basicService: BasicService,
              private message: NzMessageService,
              public sessionService: SessionService,) {
  }

  ngOnInit() {
    this.callLoadMedicineService({enabled: true});
    this.basicService.getMedicineTypeList()
      .subscribe(response => {
        if (response) {
          this.medicineTypeList = response.content;
        }
      });
  }

  searchMedicine() {
    this.currentPageIndex = 1
    this.reloadMedicineList();
  }

  reloadMedicineList() {
    let searchCodeDto;
    if (this.filterMedicineName == undefined || this.filterMedicineName == '')
      searchCodeDto = {};
    else
      searchCodeDto = {searchCode: this.filterMedicineName}
    if (this.chkIncludeDisable == false)
      searchCodeDto["enabled"] = true;
    if (this.selectMedicineType)
      searchCodeDto["medicineTypeId"] = this.selectMedicineType;
    if (this.fixServeUom == true)
      searchCodeDto["serveUomDataFix"] = true;
    if (this.fixMinUom == true)
      searchCodeDto["minUomDataFix"] = true;

    searchCodeDto["centerMedicineExpired"] = this.chkCenterMedicineExpired;
    searchCodeDto["ybNotUploaded"] = this.filterOnNotUploaded;
    searchCodeDto["ybNotMatched"] = this.filterOnNotMatched;


    this.callLoadMedicineService(searchCodeDto);
  }

  initMedicineDetailModal(medicine: any = undefined) {
    this.medicineDetailComponent.resetUI(medicine);
    this.medicineDetailModalVisible = true;
  }

  handleCancel() {
    this.medicineDetailModalVisible = false;
  }

  saveMedicine() {
    this.medicineDetailComponent.saveMedicine();
  }

  pageIndexChanged() {
    this.reloadMedicineList();
  }


  private callLoadMedicineService(searchCodeDto: any) {
    this.isLoading = true;
    this.basicService.getPagedMedicineList(searchCodeDto, this.currentPageIndex)
      .subscribe(response => {
          if (response) {
            this.medicineList = response.content;
            this.totalDataCount = response.totalCount;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });
  }

  reloadMedicineClicked() {
    this.currentPageIndex = 1
    this.filterMedicineName = undefined;
    this.reloadMedicineList();
  }


  onMedicineSaved($event: any) {
    this.reloadMedicineList();
  }


  saveMedicineMatch() {
    this.medicineMatchComponent.saveMatch();
  }

  updateFeeSetting(medicine: any) {
    let reqDto = {};
    reqDto["uuid"] = medicine.uuid;
    reqDto["prescriptionRequired"] = medicine.prescriptionRequired;
    this.basicService.updateFeeSetting('medicine', reqDto).subscribe(response => {
        this.reloadMedicineList();
        this.isLoading = false;
      },
      error => {
        this.message.create("error", error.error.message);
        this.isLoading = false;
      });
  }

  cloneMedicine(existingMedicine: any) {
    existingMedicine["uuid"] = undefined;
    this.medicineDetailComponent.resetUI(existingMedicine);
    this.medicineDetailModalVisible = true;
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {NzMessageService} from "ng-zorro-antd";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-prescription-medicine-order-processed-list-summary',
  templateUrl: './prescription-medicine-order-processed-list-summary.component.html',
  styleUrls: ['./prescription-medicine-order-processed-list-summary.component.css']
})
export class PrescriptionMedicineOrderProcessedListSummaryComponent implements OnInit, AfterViewInit {
  pageSize: any = 50;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  collapsed: any = false;
  pendingReturnMedicineOrderList: any;
  mapOfExpandData: { [key: string]: boolean } = {};
  mapOfCheckedId: { [key: string]: boolean } = {};
  selectWard: any;
  wardList: any;

  constructor(private inventoryService: InventoryService,
              private message: NzMessageService,
              public sessionService: SessionService,
              private basicService: BasicService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.loadWardList()
      .then(selectedWard => {
        let wardFilter = {wardIdList: [selectedWard.uuid]};
        this.patientSelectComponent.loadPatientTree(wardFilter)
          .then(
            response => {
              this.getProcessedPrescriptionMedicineOrderSummaryList();
              this.patientSelectComponent.patientSelectChangedEvent.subscribe(selectedPatientIdList => {
                this.getProcessedPrescriptionMedicineOrderSummaryList();
              });
            }
          );
      });
  }

  submitOrder() {
    let originOrderLineIdList = Object.keys(this.mapOfCheckedId).filter(orderLineId => this.mapOfCheckedId[orderLineId]).map((orderLineId) => (orderLineId));
    if (originOrderLineIdList.length == 0) {
      this.message.create("warning", `没有选中的药品`);
      return;
    }
    this.inventoryService.requestPrescriptionMedicineOrderReturn({
      wardId: this.selectWard.uuid,
      originOrderLineIdList: originOrderLineIdList
    })
      .subscribe(response => {
        this.message.create("success", `提交成功`);
        this.getProcessedPrescriptionMedicineOrderSummaryList();
      });
  }

  getProcessedPrescriptionMedicineOrderSummaryList() {
    this.inventoryService.getProcessedPrescriptionMedicineOrderSummaryList(this.getFilter())
      .subscribe(response => {
        if (response) {
          this.pendingReturnMedicineOrderList = response.content;
          this.mapOfCheckedId = {};
        }
      });
  }

  getFilter() {
    return {
      patientSignInIdList: this.patientSelectComponent.getSelectedPatientList(),
      lineStatus: "已发药"
    };
  }

  checkAll(checked: boolean, data: any) {
    data.orderLineList.forEach(orderLine => {
      this.mapOfCheckedId[orderLine.uuid] = checked;
    });
  }

  private loadWardList() {
    let wardFilter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      wardFilter["wardIdList"] = this.sessionService.loginUser.wardIdListIdList;
    return this.basicService.getWardList(wardFilter)
      .toPromise()
      .then(response => {
        if (response) {
          this.wardList = response.content;
          if (this.wardList.length > 0)
            this.selectWard = this.wardList[0];
          return this.selectWard;
        }
      });
  }

  reloadPatientTree() {
    this.patientSelectComponent.loadPatientTree({wardIdList: [this.selectWard.uuid]})
      .then(response => {
        this.getProcessedPrescriptionMedicineOrderSummaryList();
      });
  }
}

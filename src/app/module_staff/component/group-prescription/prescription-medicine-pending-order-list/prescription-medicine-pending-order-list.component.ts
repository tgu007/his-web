import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {PrescriptionService} from "../../../../service/prescription.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-prescription-medicine-pending-order-list',
  templateUrl: './prescription-medicine-pending-order-list.component.html',
  styleUrls: ['./prescription-medicine-pending-order-list.component.css']
})
export class PrescriptionMedicinePendingOrderListComponent implements OnInit, AfterViewInit {
  pageSize: any = 9999;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  collapsed: any = false;
  allChecked: any = true;
  mapOfCheckedId: { [key: string]: boolean } = {};
  // departmentList: any;
  // selectDepartment: any;
  pendingMedicineOrderList: any;
  dateMockFutureDate: any;
  selectWard: any;
  wardList: any;
  busy: any = false;
  selectMedicineType: any;
  medicineTypeList: any;

  constructor(private prescriptionService: PrescriptionService,
              private basicService: BasicService,
              private message: NzMessageService,
              private datePipe: DatePipe,
              public sessionService: SessionService,
              private modal: NzModalService,
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
              this.loadMedicineTypeList();
              this.patientSelectComponent.patientSelectChangedEvent.subscribe(selectedPatientIdList => {
                this.loadPendingPrescriptionMedicineOrderList();
              });
            }
          );
      });
  }

  loadMedicineTypeList() {
    this.basicService.getMedicineTypeList()
      .subscribe(response => {
        if (response) {
          this.medicineTypeList = response.content;
          let defaultMedicineType = this.medicineTypeList.find(t => t.defaultSelection === true);
          this.selectMedicineType = defaultMedicineType.id;
          this.loadPendingPrescriptionMedicineOrderList();
        }
      });
  }


  submitOrder() {
    let orderLineList: [] = this.pendingMedicineOrderList.filter(prescription => this.mapOfCheckedId[prescription.prescriptionMedicineId]);
    if (orderLineList.length == 0) {
      this.message.create("warning", `没有选中的医嘱`);
      return;
    }
    let createOrderLine: any = orderLineList.map(
      (line) => {
        //一定要有返回值！返回值会作为map出来的新值放进一个新数组
        // @ts-ignore
        return {prescriptionMedicineId: line.prescriptionMedicineId, orderQuantity: line.orderQuantity}
      }
    )
    let lineListNeedSlip: any = orderLineList.filter(l => l["slipRequired"]);
    if (lineListNeedSlip && lineListNeedSlip.length > 0) {
      this.modal.confirm({
        nzContent: '提交的发药单中包含需要处方单的药品，领药时请勿忘记携带,按确定继续提交发药单',
        nzOnOk: () => {
          this.callSubmitOrderService(createOrderLine);
        }
      });
    } else
      this.callSubmitOrderService(createOrderLine);


  }

  private callSubmitOrderService(createOrderLine: any) {
    this.busy = true;
    this.prescriptionService.submitOrder({
      wardId: this.selectWard.uuid,
      orderLineList: createOrderLine
    })
      .subscribe(response => {
          this.message.create("success", `提交成功`);
          this.loadPendingPrescriptionMedicineOrderList();
        },
        error => {
          this.busy = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  loadPendingPrescriptionMedicineOrderList() {
    this.busy = true;
    this.prescriptionService.getPendingPrescriptionMedicineOrderList(this.getFilter())
      .subscribe(response => {
          if (response) {
            this.pendingMedicineOrderList = response.content;
            this.checkAll(true);
          }
          this.busy = false
        },
        error => {
          this.busy = false;
          this.message.create("error", error.error.message);
        });
  }

  getFilter() {
    let filterDto = {
      patientSignInIdList: this.patientSelectComponent.getSelectedPatientList(),
      //departmentId: this.selectDepartment.uuid,
      mockFutureDate: this.datePipe.transform(this.dateMockFutureDate, 'yyyy-MM-dd HH:mm:ss'),
    };
    if (!this.sessionService.getUserPermission().fullDepartmentPermission)
      filterDto["departmentIdList"] = this.sessionService.loginUser.departmentIdList

    filterDto["medicineTypeId"] = this.selectMedicineType
    return filterDto;
  }


  checkAll(checked: boolean) {
    this.pendingMedicineOrderList.forEach(data => {
      this.mapOfCheckedId[data.prescriptionMedicineId] = checked;
    });

  }


  private loadWardList() {
    let wardFilter;
    if (this.sessionService.getUserPermission().fullWardPermission)
      wardFilter = {};
    else
      wardFilter = {wardIdList: this.sessionService.loginUser.wardIdList};
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
        this.loadPendingPrescriptionMedicineOrderList();
      });
  }


}

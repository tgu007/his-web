import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {OrderDetailTableComponent} from "../order-detail-table/order-detail-table.component";
import {NzMessageService, NzSelectComponent} from "ng-zorro-antd";
import {FormBuilder, Validators} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {BasicService} from "../../../../service/basic.service";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {OrderRequestDetailTableComponent} from "../order-request-detail-table/order-request-detail-table.component";
import {UserService} from "../../../../service/user.service";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-order-request-detail',
  templateUrl: './order-request-detail.component.html',
  styleUrls: ['./order-request-detail.component.css']
})
export class OrderRequestDetailComponent implements OnInit {
  orderRequestForm: any;
  @ViewChild(OrderRequestDetailTableComponent, {static: true}) orderRequestLineTableComponent: OrderRequestDetailTableComponent;
  @Input() orderType: any;
  orderRequest;
  @Output() orderRequestListRefreshRequiredEvent = new EventEmitter<any>();
  isLoading: any = false;
  statusUpdating: any = false;
  deleting: any = false;
  orderRequestPermission: any;
  saving: any = false;
  departmentList: any;
  employeeList: any;

  constructor(private fb: FormBuilder, private inventoryService: InventoryService,
              private basicService: BasicService,
              private message: NzMessageService,
              private datePipe: DatePipe,
              private userService: UserService,
              public sessionService: SessionService,) {
    this.orderRequestPermission = this.sessionService.getUserPermission().commonComponent.orderRequestPermission;
  }


  ngOnInit() {
    this.orderRequestForm = this.fb.group({
      txtName: [undefined, undefined],
      selectByDepartment: [undefined, undefined],
      selectByEmployee: [undefined, undefined],
      chkUrgent: [false, undefined],
      orderRequestLines: this.fb.array([]),
    });
    this.loadDepartmentList();
  }

  private loadDepartmentList() {
    this.basicService.getDepartmentList({})
      .subscribe(response => {
        if (response) {
          this.departmentList = response.content
        }
      });
  }

  selectDepartmentChanged(departmentId: any) {
    this.orderRequestForm.controls['selectByEmployee'].patchValue(undefined);
    this.employeeList = undefined;
    if (!departmentId)
      return;
    this.userService.getUserList({departmentId: departmentId})
      .subscribe(response => {
        if (response) {
          this.employeeList = response.content
        }
      });
  }

  private loadOrderRequestDetail() {
    this.isLoading = true;
    this.inventoryService.getOrderRequestDetail(this.orderRequest.uuid, this.orderType)
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          this.orderRequest = response.content
          this.patchFormValue();
        }
      });
  }

  private patchFormValue() {
    this.orderRequestForm.patchValue(
      {
        txtName: this.orderRequest.name,
        selectByDepartment: this.orderRequest.byDepartment ? this.orderRequest.byDepartment.uuid : undefined,
        selectByEmployee: this.orderRequest.byEmployee ? this.orderRequest.byEmployee.uuid : undefined,
        chkUrgent: this.orderRequest.urgent
      });

    this.orderRequestLineTableComponent.patchTableFromValue(this.orderRequest.lineList);
  }

  resetUi(orderRequest: any, orderRequestLoaded: boolean = false) {
    this.orderRequest = orderRequest;
    this.orderRequestLineTableComponent.orderRequest = orderRequest;
    this.orderRequestForm.reset();
    this.orderRequestLineTableComponent.resetUi();

    let defaultName = '?????????'
    if (this.orderType == 'item')
      defaultName = '??????' + defaultName
    else
      defaultName = '??????' + defaultName
    defaultName += this.datePipe.transform(new Date(), 'yyyy.MM');

    this.orderRequestForm.patchValue(
      {
        txtName: defaultName,
        selectByDepartment: undefined,
        selectByEmployee: undefined,
        chkUrgent: false
      });

    if (this.orderRequest.uuid) {
      if (orderRequestLoaded)
        this.patchFormValue();
      else
        this.loadOrderRequestDetail();
    }
  }


  saveOrderRequest() {
    if (!this.orderRequestLineTableComponent.allLineCommitted())
      return;
    if (!this.orderRequestForm.valid) {
      FormValidator.validateFormInput(this.orderRequestForm);
      this.message.create("error", `????????????`);
      return;
    }

    let orderRequest = this.getData();
    this.saving = true;
    this.inventoryService.saveOrderRequest(orderRequest, this.orderType)
      .subscribe(response => {
          if (response) {
            this.message.create("success", "????????????");
            this.resetUi(response.content, true);
            this.orderRequestListRefreshRequiredEvent.emit(false);
            this.saving = false;
          }
        },
        error => {
          this.message.create("error", "????????????");
          this.saving = false;
        }
      );
  }


  private getData() {
    let orderRequestLineList: any[] = this.orderRequestLineTableComponent.getData();
    const data = this.orderRequestForm.value;
    return {
      uuid: this.orderRequest ? this.orderRequest.uuid : undefined,
      name: data.txtName,
      status: this.orderRequest && this.orderRequest.status ? this.orderRequest.status : 0,
      byEmployeeId: data.selectByEmployee,
      byDepartmentId: data.selectByDepartment,
      urgent: data.chkUrgent,
      requestLineList: orderRequestLineList,
    };
  }


  deleteOrderRequest() {
    this.deleting = true;
    this.inventoryService.deleteOrderRequest(this.orderRequest.uuid, this.orderType)
      .subscribe(response => {
          this.message.create("success", `????????????`);
          this.orderRequestListRefreshRequiredEvent.emit(true);
          this.deleting = false;
        },
        error => {
          this.message.create("error", `????????????`);
          this.deleting = false;
        });
  }


  updateOrderRequestStatus(orderRequestStatus: any, action: string) {
    let updateDto = {status: orderRequestStatus, uuid: this.orderRequest.uuid};
    if (action == 'approve')
      updateDto["approveById"] = this.sessionService.loginUser.uuid;
    this.statusUpdating = true;
    this.inventoryService.updateOrderRequestStatus(updateDto, this.orderType, action)
      .subscribe(response => {
          this.message.create("success", `????????????`);
          this.orderRequestListRefreshRequiredEvent.emit(false);
          this.orderRequest.status = orderRequestStatus;
          this.statusUpdating = false;
        },
        error => {
          this.message.create("error", `????????????`);
          this.statusUpdating = false;
        });
  }


}

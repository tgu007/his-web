import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../../service/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {Validators} from "@angular/forms";
import {SessionService} from "../../../../service/session.service";
import {BasicService} from "../../../../service/basic.service";
import {PatientFeeDetailComponent} from "../../group-fee/patient-fee-detail/patient-fee-detail.component";
import {DoctorAgreementComponent} from "../doctor-agreement/doctor-agreement.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  selectUserStatus: any = "all";
  selectUserRole: any;
  userRoleList: any = [];
  filterPhoneNumber: any;
  filterName: any;
  employeeList: any;
  isLoading: any = false;
  permissionModalVisible: any = false;
  selectDepartment: any;
  departmentList: any;
  employee: any;
  uiPermission:any;
  @ViewChild(DoctorAgreementComponent, {static: true}) doctorAgreementComponent: DoctorAgreementComponent;

  constructor(private userService: UserService,
              private message: NzMessageService,
              public sessionService: SessionService) {
  }

  ngOnInit() {
    this.uiPermission = this.sessionService.getUserPermission();
    this.userService.getUserRoleList()
      .subscribe(response => {
        this.userRoleList = response.content;
      });
    this.loadUserList();
  }

  loadUserList() {
    let filter = {
      phoneSearchCode: this.filterPhoneNumber,
      nameSearchCode: this.filterName,
      enabled: this.selectUserStatus == "all" ? undefined : this.selectUserStatus
    };

    if(this.uiPermission.commonComponent.userList.fullRole) {
      filter["userRoleId"] = this.selectUserRole ? this.selectUserRole.uuid : undefined;
    }
      else {
      filter["userRoleType"]  = this.sessionService.loginUser.userRole.userRoleType;
      filter["departmentIdList"]  = this.sessionService.loginUser.departmentIdList;
    }

    this.isLoading = true;
    this.userService.getUserList(filter)
      .subscribe(response => {
          this.employeeList = response.content;
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );
  }

  activateEmployee(employee: any, enable: boolean) {
    employee["isBusy"] = true;
    this.userService.activateUser(employee.uuid, enable)
      .subscribe(response => {
          this.message.create("success", "操作成功");
          employee.enabled = enable;
          employee["isBusy"] = false;
        },
        error => {
          this.message.create("error", error.error.message);
          employee["isBusy"] = false;
        }
      );
  }

  permissionEditClicked(employee: any) {
    this.permissionModalVisible = true;
    this.selectUserRole = employee.userRole.uuid;
    this.employee = employee;
    this.selectRoleChanged();
  }

  handleCancel() {
    this.permissionModalVisible = false;
    this.doctorAgreementModalVisible = false;
  }

  saveUserPermissionClicked() {
    let updateDto = {
      uuid: this.employee.uuid,
      roleId: this.selectUserRole,
      departmentIdList: [],
      warehouseIdList: []
    };
    let selectedRole = this.userRoleList.find(r => r.uuid == this.selectUserRole);
    if (this.wardSelectionRoleList.includes(selectedRole.name))
      updateDto["departmentIdList"] = this.selectDepartment;
    else if (this.pharmacyRole == selectedRole.name || this.warehouseRole == selectedRole.name)
      updateDto["warehouseIdList"] = this.selectDepartment;

    this.userService.updateUserPermission(updateDto).subscribe(response => {
        this.message.create("success", "权限更新成功");
        this.loadUserList();
      },
      error => {
        this.message.create("error", "权限更新失败");
      });

  }

  wardSelectionRoleList = ["医生", "护士", "实习医生"];
  pharmacyRole = "药剂师";
  warehouseRole = "仓库管理员";
  doctorAgreementModalVisible: any = false;

  selectRoleChanged() {
    let selectedRole = this.userRoleList.find(r => r.uuid == this.selectUserRole);
    if (!selectedRole)
      return;

    let departmentFilter = {};
    this.departmentList = [];
    this.selectDepartment = [];
    if (this.wardSelectionRoleList.includes(selectedRole.name)) {
      departmentFilter["departmentTreatmentType"] = "病区科室";
      this.userService.getDepartmentList(departmentFilter)
        .subscribe(response => {
          this.departmentList = response.content;
          if (this.employee.userRole.uuid == selectedRole.uuid)
            this.userService.getUser(this.employee.uuid).subscribe(
              response => {
                this.selectDepartment = response.content.departmentIdList;
              }
            )
        })
    } else if (this.pharmacyRole == selectedRole.name || this.warehouseRole == selectedRole.name) {
      if (this.pharmacyRole == selectedRole.name)
        departmentFilter["warehouseTypeList"] = ["药房"];
      else
        departmentFilter["warehouseTypeList"] = ["药库"];

      this.userService.getWarehouseList(departmentFilter)
        .subscribe(response => {
          this.departmentList = response.content;
          if (this.employee.userRole.uuid == selectedRole.uuid)
            if (this.employee.userRole.uuid == selectedRole.uuid)
              this.userService.getUser(this.employee.uuid).subscribe(
                response => {
                  this.selectDepartment = response.content.departmentIdList;
                }
              )
        });
    }
  }

  doctorAgreementClicked(employee: any) {
    this.doctorAgreementModalVisible = true;
    this.doctorAgreementComponent.resetUI(employee);
  }
}

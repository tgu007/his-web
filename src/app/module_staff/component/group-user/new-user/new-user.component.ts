import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {UserService} from "../../../../service/user.service";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  newUserForm: any;
  userRoleList: any;
  wardSelectionRoleList = ["医生", "护士"];
  pharmacyRole = "药剂师";
  warehouseRole = "仓库管理员";
  departmentList: any;
  selectDepartmentLabel: any;
  @Output() newEmployeeSaved = new EventEmitter<any>();
  isDoctorRole: any = false;
  doctorRole = "医生";


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private message: NzMessageService
  ) {
    this.newUserForm = this.fb.group({
      userName: ['', [Validators.required,
        Validators.pattern('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [this.confirmValidator]],
      selectUserRole: [undefined, [Validators.required]],
      selectDepartment: [[], undefined],
      name: [undefined, [Validators.required]]
    });
  }

  ngOnInit() {

  }

  validateConfirmPassword(): void {
    setTimeout(() => this.newUserForm.controls.confirm.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {error: true, required: true};
    } else if (control.value !== this.newUserForm.controls.password.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

  resetUi() {
    this.newUserForm.reset();
    if (!this.userRoleList) {
      this.userService.getUserRoleList()
        .subscribe(response => {
          this.userRoleList = response.content;
        });
    }
  }

  selectRoleChanged() {
    this.departmentList = [];
    this.selectDepartmentLabel = "";
    this.newUserForm.patchValue({selectDepartment: []});
    if (this.newUserForm.value.selectUserRole) {
      let selectedUserRole = this.newUserForm.value.selectUserRole.userRoleType;
      let departmentFilter = {};
      if (!this.hideDepartmentSelection()) {
        this.newUserForm.get('selectDepartment')!.setValidators(Validators.required);
        this.newUserForm.get('selectDepartment')!.markAsDirty();

        if (this.wardSelectionRoleList.includes(selectedUserRole)) {
          this.selectDepartmentLabel = "科室";
          departmentFilter["departmentTreatmentType"] = "病区科室";

          this.userService.getDepartmentList(departmentFilter)
            .subscribe(response => {
              this.departmentList = response.content;
              if (this.departmentList.length > 0)
                if (this.wardSelectionRoleList[0] == selectedUserRole) //医生
                  this.newUserForm.patchValue({selectDepartment: this.departmentList.map(d => d.uuid)});
              // else
              //   this.newUserForm.patchValue({selectDepartment: [this.departmentList[0].uuid]});
            });
        } else if (this.pharmacyRole == selectedUserRole || this.warehouseRole == selectedUserRole) {
          if (this.pharmacyRole == selectedUserRole)
            departmentFilter["warehouseTypeList"] = ["药房"];
          else
            departmentFilter["warehouseTypeList"] = ["药库"];

          this.selectDepartmentLabel = departmentFilter["warehouseTypeList"][0];
          this.userService.getWarehouseList(departmentFilter)
            .subscribe(response => {
              this.departmentList = response.content;
              if (this.departmentList.length > 0)
                this.newUserForm.patchValue({selectDepartment: [this.departmentList[0].uuid]});
            });
        }
      } else {
        this.newUserForm.get('selectDepartment')!.clearValidators();
        this.newUserForm.get('selectDepartment')!.markAsPristine();
      }

      this.newUserForm.get('selectDepartment')!.updateValueAndValidity();
    }
  }

  hideDepartmentSelection() {
    if (this.newUserForm.value.selectUserRole) {
      let selectedUserRole = this.newUserForm.value.selectUserRole.userRoleType;
      return !(this.wardSelectionRoleList.includes(selectedUserRole) ||
        this.pharmacyRole === selectedUserRole ||
        this.warehouseRole === selectedUserRole);
    }
    return true;
  }

  createNewUser() {
    if (!this.newUserForm.valid) {
      FormValidator.validateFormInput(this.newUserForm);
      this.message.create("error", "验证错误");
      return;
    }
    let newEmployee = this.getData();
    this.userService.createNewUser(newEmployee)
      .subscribe(response => {
          this.newEmployeeSaved.emit();
          this.message.create("success", "创建成功，请联系管理员激活账号");
        },
        error => {
          this.message.create("error", "创建失败，请联系管理员");
        }
      );
  }

  private getData() {
    let formData = this.newUserForm.value;
    let selectedUserRole = formData.selectUserRole;
    return {
      phone: formData.userName,
      password: formData.password,
      name: formData.name,
      userRoleId: selectedUserRole.uuid,
      treatmentDepartmentIdList: this.wardSelectionRoleList.includes(selectedUserRole.userRoleType) ? formData.selectDepartment : undefined,
      warehouseDepartmentIdList: this.pharmacyRole === selectedUserRole.userRoleType || this.warehouseRole === selectedUserRole.userRoleType ? formData.selectDepartment : undefined,
      certificationNumber:formData.txtDoctorCertificate
    };
  }
}

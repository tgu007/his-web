import {Injectable} from '@angular/core';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private appService: AppService) {
  }

  getUserRoleList() {
    return this.appService.httpPost('public/user/role/list');
  }

  createNewUser(newEmployee: any) {
    return this.appService.httpPost('public/user/create', newEmployee);
  }

  getWarehouseList(warehouseFilter: any) {
    return this.appService.httpPost('public/warehouse/list', warehouseFilter);
  }

  getDepartmentList(departmentFilter: any) {
    return this.appService.httpPost('public/department/list', departmentFilter);
  }

  simpleLogin(credential: any) {
    return this.appService.httpPost('public/user/login/simple', credential);
  }

  resetPassword(resetPasswordData: any) {
    return this.appService.httpPost('api/user/password/reset', resetPasswordData);
  }

  getUserList(filter: any) {
    return this.appService.httpPost('api/user/list', filter);
  }

  activateUser(employeeId: any, enable: boolean) {
    return this.appService.httpPost(`api/user/${employeeId}/activation/${enable}`);
  }

  getUser(userId: any) {
    return this.appService.httpPost(`api/user/list/${userId}`);
  }

  updateUserPermission(updateDto: any) {
    return this.appService.httpPost(`api/user/permission/update`, updateDto);
  }

  updateProfile(employeeId:any, data: any) {
    return this.appService.httpPost(`api/user/profile/update/${employeeId}`, data);
  }
}

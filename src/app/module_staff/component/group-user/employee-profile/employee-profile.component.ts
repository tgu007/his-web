import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../../service/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  personalProfileForm: any;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private message: NzMessageService,
              private sessionService: SessionService,
              ) {

    this.personalProfileForm = this.fb.group({
      certificationNumber: ['', null],
      chkAllowSupervise: [false, null]
    });
  }

  ngOnInit() {
    this.personalProfileForm.patch
    this.personalProfileForm.patchValue({
      certificationNumber: this.sessionService.loginUser.certificationNumber,
      chkAllowSupervise: this.sessionService.loginUser.allowSupervise? this.sessionService.loginUser.allowSupervise : undefined
    });
  }

  update() {
    let data ={
      certificationNumber : this.personalProfileForm.value.certificationNumber,
      allowSupervise : this.personalProfileForm.value.chkAllowSupervise
    }
    this.userService.updateProfile(this.sessionService.loginUser.uuid, data)
      .subscribe(response => {
        let loginUser = this.sessionService.loginUser
        loginUser.certificationNumber = data.certificationNumber;
        loginUser.allowSupervise = this.personalProfileForm.value.chkAllowSupervise;
        this.sessionService.setLoginUser(loginUser);
        this.message.create("success", "更新成功");
      });
  }
}

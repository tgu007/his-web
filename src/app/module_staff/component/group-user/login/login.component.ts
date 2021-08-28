import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PatientDetailComponent} from "../../group-patient-sign-in/patient-detail/patient-detail.component";
import {NewUserComponent} from "../new-user/new-user.component";
import {UserService} from "../../../../service/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: any;
  newUserModalVisible: any = false;
  @ViewChild(NewUserComponent, {static: true}) newUserComponent: NewUserComponent;

  constructor(private fb: FormBuilder, private router: Router,
              private userService: UserService,
              private message: NzMessageService,
              private storageService: SessionService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }

    if (!this.loginForm.valid) {
      FormValidator.validateFormInput(this.loginForm);
      this.message.create("error", "验证错误");
      return;
    }

    let formData = this.loginForm.value;
    let credential = {phone: formData.userName, password: formData.password}
    this.userService.simpleLogin(credential)
      .subscribe(response => {
          if (response.content) {
            this.storageService.setLoginUser(response.content);
            this.router.navigateByUrl('staff/landing');
          }
        },
        error => {
          this.message.create("error", error.error.message);
        },
      );
  }

  newAccountClicked() {
    this.newUserModalVisible = true;
    this.newUserComponent.resetUi();
  }

  handleCancel() {
    this.newUserModalVisible = false;
  }

  saveNewUser() {
    this.newUserComponent.createNewUser();
  }
}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {UserService} from "../../../../service/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-user-password-reset',
  templateUrl: './user-password-reset.component.html',
  styleUrls: ['./user-password-reset.component.css']
})
export class UserPasswordResetComponent implements OnInit {
  resetPasswordForm: any;
  @Output() onPasswordResetEvent = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private message: NzMessageService) {

    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [this.confirmValidator]],
    });
  }

  ngOnInit() {
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.resetPasswordForm.controls.confirm.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {error: true, required: true};
    } else if (control.value !== this.resetPasswordForm.controls.newPassword.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      FormValidator.validateFormInput(this.resetPasswordForm);
      this.message.create("error", "验证错误");
      return;
    }
    let formData = this.resetPasswordForm.value;
    let resetPasswordData = {originalPassword: formData.oldPassword, newPassword: formData.newPassword}
    this.userService.resetPassword(resetPasswordData)
      .subscribe(response => {
          this.onPasswordResetEvent.emit();
          this.message.create("success", "密码重设成功");
        },
        error => {
          this.message.create("error", "密码重设失败");
        }
      );
  }

}

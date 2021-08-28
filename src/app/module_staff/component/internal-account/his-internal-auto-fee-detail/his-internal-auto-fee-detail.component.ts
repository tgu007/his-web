import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {InternalAccountService} from "../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-his-internal-auto-fee-detail',
  templateUrl: './his-internal-auto-fee-detail.component.html',
  styleUrls: ['./his-internal-auto-fee-detail.component.css']
})
export class HisInternalAutoFeeDetailComponent implements OnInit {

  itemList: any;
  isSaving: any = false;
  @Output() autoFeeSavedEvent = new EventEmitter<any>();
  autoFeeDetailForm: any;
  autoFee: any;
  @Input() patientSignIn:any;

  constructor(private fb: FormBuilder,
              private internalAccountService: InternalAccountService,
              private message: NzMessageService,) { }

  ngOnInit() {
    this.loadItemList();
    this.autoFeeDetailForm = this.fb.group({
      selectItem: [undefined, [Validators.required]],
      numberQuantity: [1, [Validators.required]],
      chkEnabled: [true, null],
    });
  }

  private loadItemList() {
    let filter ={enabled:true};
    this.internalAccountService.getItemList(filter)
      .subscribe(response => {
          if (response) {
            this.itemList = response.content;
            if (this.autoFee) {
              this.patchFormValue();
            }
          }
        },
        error => {
          this.message.create("error", "加载物品失败");
        });
  }

  resetUI(autoFee: any) {
    this.autoFeeDetailForm.reset();
    this.autoFee = autoFee;
    this.autoFeeDetailForm.controls['chkEnabled'].patchValue(true);
    this.autoFeeDetailForm.controls['numberQuantity'].patchValue(1);
    if (this.autoFee) {
      this.patchFormValue();
    }

  }

  saveAutoFee() {
    if (!this.autoFeeDetailForm.valid) {
      FormValidator.validateFormInput(this.autoFeeDetailForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.autoFeeDetailForm.getRawValue();
    let autoFee = this.getData(data);
    this.isSaving = true;
    this.internalAccountService.saveHisAutoFee(autoFee)
      .subscribe(response => {
          this.isSaving = false;
          if (response) {
            this.autoFee = response.content;
            this.message.create("success", "保存成功");
            this.autoFeeSavedEvent.emit();
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", "保存失败");
        });
  }

  private patchFormValue() {
    this.autoFeeDetailForm.patchValue({
      selectItem: this.autoFee.item.uuid,
      numberQuantity: this.autoFee.quantity,
      chkEnabled: this.autoFee.enabled
    });
  }

  private getData(data: any) {
    return{
      uuid: this.autoFee ? this.autoFee.uuid : undefined,
      itemId: data.selectItem,
      quantity: data.numberQuantity,
      enabled: data.chkEnabled,
      patientSignInId: this.patientSignIn.uuid
    }
  }
}

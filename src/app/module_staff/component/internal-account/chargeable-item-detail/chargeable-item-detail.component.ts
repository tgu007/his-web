import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {InternalAccountService} from "../../../../service/internal-account.service";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-chargeable-item-detail',
  templateUrl: './chargeable-item-detail.component.html',
  styleUrls: ['./chargeable-item-detail.component.css']
})
export class ChargeableItemDetailComponent implements OnInit {
  isSaving: any = false;
  @Output() itemSavedEvent = new EventEmitter<any>();
  itemDetailForm: any;
  item: any;

  constructor(private fb: FormBuilder,
              private internalAccountService: InternalAccountService,
              private message: NzMessageService,) {
  }

  ngOnInit() {

    this.itemDetailForm = this.fb.group({
      txtUom: [undefined, [Validators.required]],
      txtName: [undefined, [Validators.required]],
      numberPrice: [undefined, [Validators.required]],
      chkEnabled: [true, null],
      numberDefaultQuantity:[1, null]
    });
  }



  resetUI(item: any) {
    this.itemDetailForm.reset();
    this.item = item;
    this.itemDetailForm.controls['chkEnabled'].patchValue(true);
    this.itemDetailForm.controls['numberDefaultQuantity'].patchValue(1);
    if (this.item) {
      this.patchFormValue();
    }

  }

  saveItem() {
    if (!this.itemDetailForm.valid) {
      FormValidator.validateFormInput(this.itemDetailForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.itemDetailForm.getRawValue();
    let item = this.getData(data);
    this.isSaving = true;
    this.internalAccountService.saveItem(item)
      .subscribe(response => {
          this.isSaving = false;
          if (response) {
            this.item = response.content;
            this.message.create("success", "保存成功");
            this.itemSavedEvent.emit();
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", "保存失败");
        });
  }


  private patchFormValue() {
    this.itemDetailForm.patchValue({
      txtName: this.item.name,
      txtUom: this.item.uom,
      chkEnabled: this.item.enabled,
      numberPrice: this.item.listPrice,
      numberDefaultQuantity:this.item.defaultQuantity
    });
  }

  private getData(data: any) {
    return {
      uuid: this.item ? this.item.uuid : undefined,
      name: data.txtName,
      uom: data.txtUom,
      enabled: data.chkEnabled,
      listPrice: data.numberPrice,
      defaultQuantity:data.numberDefaultQuantity
    }
  }


}

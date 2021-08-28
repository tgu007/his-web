import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {InternalAccountService} from "../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";
import {FormValidator} from "../../../../../validation/FormValidator";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-his-internal-fee-detail',
  templateUrl: './his-internal-fee-detail.component.html',
  styleUrls: ['./his-internal-fee-detail.component.css']
})
export class HisInternalFeeDetailComponent implements OnInit {
  @Input() patientSignIn:any;
  itemList: any;
  isSaving: any = false;
  @Output() feeSavedEvent = new EventEmitter<any>();
  feeDetailForm: any;
  fee: any;


  constructor(private fb: FormBuilder,
              private internalAccountService: InternalAccountService,
              private message: NzMessageService,
              private datePipe: DatePipe,) { }

  ngOnInit() {
    this.loadItemList();
    this.feeDetailForm = this.fb.group({
      selectItem: [undefined, [Validators.required]],
      numberQuantity: [1, [Validators.required]],
      dateFeeDate: [new Date(), [Validators.required]],
    });
  }

  resetUI() {
    this.feeDetailForm.reset();
    this.feeDetailForm.controls['numberQuantity'].patchValue(1);
    this.feeDetailForm.controls['dateFeeDate'].patchValue(new Date());
    this.fee = undefined;
  }

  saveFee() {
    if (!this.feeDetailForm.valid) {
      FormValidator.validateFormInput(this.feeDetailForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.feeDetailForm.getRawValue();
    let fee = this.getData(data);
    this.isSaving = true;
    this.internalAccountService.saveHisFee(fee)
      .subscribe(response => {
          this.isSaving = false;
          if (response) {
            this.fee = response.content;
            this.message.create("success", "保存成功");
            this.feeSavedEvent.emit();
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", "保存失败");
        });
  }

  private loadItemList() {
    let filter ={enabled:true};
    this.internalAccountService.getItemList(filter)
      .subscribe(response => {
          if (response) {
            this.itemList = response.content;
          }
        },
        error => {
          this.message.create("error", "加载物品失败");
        });
  }

  private getData(data: any) {
    return{
      uuid:this.fee? this.fee.uuid:undefined,
      itemId: data.selectItem,
      quantity: data.numberQuantity,
      patientSignInId:this.patientSignIn.uuid,
      feeDate: this.datePipe.transform(data.dateFeeDate, 'yyyy-MM-dd HH:mm:ss')
    }
  }

}

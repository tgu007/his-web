import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FeeService} from "../../../../service/fee.service";
import {FormBuilder, Validators} from "@angular/forms";
import {InternalAccountService} from "../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";
import {FormValidator} from "../../../../../validation/FormValidator";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-his-internal-payment-detail',
  templateUrl: './his-internal-payment-detail.component.html',
  styleUrls: ['./his-internal-payment-detail.component.css']
})
export class HisInternalPaymentDetailComponent implements OnInit {
  @Input() patientSignIn:any;
  isSaving: any = false;
  paymentMethodList: any;
  paymentDetailForm: any;
  formatterDollar = (value: number) => `￥ ${value}`;
  parserDollar = (value: string) => value.replace('￥ ', '');
  @Output() paymentSavedEvent = new EventEmitter<any>();
  itemList: any;

  constructor(
    private feeService: FeeService,
    private fb: FormBuilder,
    private internalAccountService: InternalAccountService,
    private message: NzMessageService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.loadItemList();
    this.loadPaymentMethod();
    this.paymentDetailForm = this.fb.group({
      selectPaymentType: [undefined, [Validators.required]],
      numberAmount: [undefined, [Validators.required]],
      selectPaymentMethod: [undefined, [Validators.required]],
      datePaymentDate: [new Date(), [Validators.required]],
      selectItem: [undefined, undefined],
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

  resetUI() {
    this.paymentDetailForm.reset();
    this.paymentDetailForm.controls['selectPaymentType'].patchValue('0');
    this.paymentDetailForm.controls['numberAmount'].patchValue(0);
    this.paymentDetailForm.controls['datePaymentDate'].patchValue(new Date());
  }

  save() {
    if (!this.paymentDetailForm.valid) {
      FormValidator.validateFormInput(this.paymentDetailForm);
      this.message.create("error", "验证错误");
      return;
    }
    const data = this.paymentDetailForm.getRawValue();
    let payment = this.getData(data);
    this.isSaving = true;
    this.internalAccountService.saveHisPayment(payment)
      .subscribe(response => {
          this.isSaving = false;
          if (response) {
            this.message.create("success", "保存成功");
            this.paymentSavedEvent.emit();
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", "保存失败");
        });
  }

  private loadPaymentMethod() {
    this.feeService.getPaymentMethodList()
      .subscribe(response => {
        if (response) {
          this.paymentMethodList = response.content;
          this.paymentDetailForm.patchValue({
            selectPaymentMethod: this.paymentMethodList.find(t => t.defaultSelection === true).id,
          });
        }
      });
  }

  private getData(data: any) {
    return{
      paymentType: data.selectPaymentType,
      paymentMethodId: data.selectPaymentMethod,
      amount: data.numberAmount,
      patientSignInId:this.patientSignIn.uuid,
      paymentDate: this.datePipe.transform(data.datePaymentDate, 'yyyy-MM-dd HH:mm:ss'),
      itemId:data.selectItem,
    }
  }

}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FeeService} from "../../../../../service/fee.service";
import {FormBuilder, Validators} from "@angular/forms";
import {InternalAccountService} from "../../../../../service/internal-account.service";
import {NzMessageService} from "ng-zorro-antd";
import {FormValidator} from "../../../../../../validation/FormValidator";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-internal-payment-detail',
  templateUrl: './internal-payment-detail.component.html',
  styleUrls: ['./internal-payment-detail.component.css']
})
export class InternalPaymentDetailComponent implements OnInit {
  isSaving: any = false;
  paymentMethodList: any;
  paymentDetailForm: any;
  formatterDollar = (value: number) => `￥ ${value}`;
  parserDollar = (value: string) => value.replace('￥ ', '');
  @Output() paymentSavedEvent = new EventEmitter<any>();
  payment:any;
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
    this.loadPaymentMethod();
    this.paymentDetailForm = this.fb.group({
      txtSignInNumber: [undefined, [Validators.required]],
      txtPatientInfo: [undefined, [Validators.required]],
      selectPaymentType: [undefined, [Validators.required]],
      numberAmount: [undefined, [Validators.required]],
      selectPaymentMethod: [undefined, [Validators.required]],
      selectWard: [undefined, [Validators.required]],
      datePaymentDate: [new Date(), [Validators.required]],
      chkAddAutoFee:[false, undefined],
      selectItemList:[undefined, undefined],
      selectItem: [undefined, undefined],
    });

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
    this.paymentDetailForm.controls['selectWard'].patchValue(undefined);
    this.paymentDetailForm.controls['datePaymentDate'].patchValue(new Date());
    this.paymentDetailForm.controls['chkAddAutoFee'].patchValue(false);
    this.paymentDetailForm.controls['selectItemList'].patchValue(undefined);
    this.paymentDetailForm.controls['selectItem'].patchValue(undefined);

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
    this.internalAccountService.savePayment(payment)
      .subscribe(response => {
          this.isSaving = false;
          if (response) {
            this.message.create("success", "保存成功");
            this.paymentSavedEvent.emit();
          }
        },
        error => {
          this.isSaving = false;
          this.message.create("error", error.error.message);
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
      patientInfo: data.txtPatientInfo,
      singInNumber: data.txtSignInNumber,
      ward:data.selectWard,
      paymentDate: this.datePipe.transform(data.datePaymentDate, 'yyyy-MM-dd HH:mm:ss'),
      selectedItemIdList: data.chkAddAutoFee? data.selectItemList:undefined,
      itemId:data.selectItem,
    }
  }
}

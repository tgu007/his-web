import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AppService} from "../../../../service/app.service";
import {FeeService} from "../../../../service/fee.service";
import {FormValidator} from "../../../../../validation/FormValidator";
import {NzMessageService} from "ng-zorro-antd";
import * as globals from "../../../../../globals";

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {
  paymentForm: any;
  formErrors: Object = {};
  paymentMethodList: any;
  @Input() patientSignInId;
  @Output() newPaymentSavedEvent = new EventEmitter<any>();
  initialPramLoaded = false;
  formatterDollar = (value: number) => `￥ ${value}`;
  parserDollar = (value: string) => value.replace('￥ ', '');
  paymentType: any;
  originPaymentId: any;

  constructor(private fb: FormBuilder, private feeService: FeeService, private appService: AppService,
              private message: NzMessageService) {
  }

  ngOnInit() {
    this.appService.validationErrors.subscribe(err => {
      if (err) {
        this.formErrors = err;
      }
    });

    this.paymentForm = this.fb.group({
      selectPaymentType: ["0", [Validators.required]],
      numberAmount: [3000, [Validators.required]],
      selectPaymentMethod: ["", [Validators.required]]
    });


  }

  saveNewPayment() {
    FormValidator.validateForm(this.paymentForm, this.formErrors, false, 'formNewPrePayment');
    if (!this.paymentForm.valid) {
      FormValidator.validateFormInput(this.paymentForm);
      this.message.create("error", "验证错误")
      return;
    }
    let newPayment = this.getData();

    this.feeService.saveNewPayment(newPayment)
      .subscribe(response => {
          this.newPaymentSavedEvent.emit();
          this.message.create("success", "缴费成功");
        },
        error => {
          this.message.create("error", error.error.message);
        }
      );
  }

  private getData() {
    const data = this.paymentForm.value;
    return {
      signInId: this.patientSignInId,
      paymentType: data.selectPaymentType,
      amount: data.numberAmount,
      paymentMethodId: data.selectPaymentMethod.id,
      originPaymentId: this.originPaymentId
    };
  }

  resetUi(payment: any) {

    if (!this.initialPramLoaded) {
      this.loadPaymentMethod();
      this.initialPramLoaded = true;
    } else
      this.resetDefaultValue();

    if (payment) {
      this.originPaymentId = payment.uuid;
      this.paymentType = [{index: 1, name: '退费'}];
      this.paymentForm.patchValue({
        selectPaymentType: 1
      });
    } else {
      this.originPaymentId = undefined;
      this.paymentType = [{index: 0, name: '预交费'}, {index: 2, name: '结算缴费'}];
      this.paymentForm.patchValue({
        selectPaymentType: 0
      });
    }


  }

  private loadPaymentMethod() {
    this.feeService.getPaymentMethodList()
      .subscribe(response => {
        if (response) {
          this.paymentMethodList = response.content;
          this.paymentForm.patchValue({
            selectPaymentMethod: this.paymentMethodList.find(t => t.defaultSelection === true),
          });
        }
      });
  }

  private resetDefaultValue() {
    this.paymentForm.patchValue({
      txtPaymentNumber: "",
      selectPaymentType: "0",
      numberAmount: 3000,
      selectPaymentMethod: this.paymentMethodList.find(t => t.defaultSelection === true),
    });
  }


}

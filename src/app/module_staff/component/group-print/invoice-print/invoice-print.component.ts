import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.css']
})
export class InvoicePrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {

  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onInvoiceClose.emit();
  }

  getInfo1() {
    let info = undefined;
    if (this.printData) {
      info = `自负金额:${this.printData.ybSelfAmount}自理:${this.printData.ybSelfAmountRatio}自费:${this.printData.ybSelfAmountAll}卡余额:${this.printData.cardBalance}`;
    }
    return info;
  }

  getInfo2() {
    let info = undefined;
    if (this.printData) {
      info = `起付标准:${this.printData.ybAccessAmount}离休基金:${this.printData.retirementFund}医疗补助:${this.printData.medicalSubsidy}优抚补助:${this.printData.specialCareSubsidy}`;
    }
    return info;
  }

  getInfo3() {
    let info = undefined;
    if (this.printData) {
      info = `补充医疗保险:${this.printData.supplementInsurance}家庭共济基金:${this.printData.familyFund}`;
    }
    return info;
  }
}

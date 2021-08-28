import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {FeeService} from "../../../../service/fee.service";

@Component({
  selector: 'app-payment-print',
  templateUrl: './payment-print.component.html',
  styleUrls: ['./payment-print.component.css']
})
export class PaymentPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService,
              public feeService: FeeService,) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onPaymentClose.emit();
  }

}

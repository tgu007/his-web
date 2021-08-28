import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-internal-payment-print',
  templateUrl: './internal-payment-print.component.html',
  styleUrls: ['./internal-payment-print.component.css']
})
export class InternalPaymentPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService, public sessionService: SessionService,) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onInternalPaymentClose.emit();
  }

}

import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {BasePrint} from "../BasePrint";

@Component({
  selector: 'app-prescription-order-summary-print',
  templateUrl: './prescription-order-summary-print.component.html',
  styleUrls: ['./prescription-order-summary-print.component.css']
})
export class PrescriptionOrderSummaryPrintComponent extends BasePrint implements OnInit , AfterViewChecked{

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onPrescriptionOrderListClose.emit();
  }
}

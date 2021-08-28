import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-hy-invoice-print',
  templateUrl: './hy-invoice-print.component.html',
  styleUrls: ['./hy-invoice-print.component.css']
})
export class HyInvoicePrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onHYInvoiceClose.emit();
  }

}

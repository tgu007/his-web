import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-prescription-return-order-print',
  templateUrl: './prescription-return-order-print.component.html',
  styleUrls: ['./prescription-return-order-print.component.css']
})
export class PrescriptionReturnOrderPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onReturnOrderClose.emit();
  }

}

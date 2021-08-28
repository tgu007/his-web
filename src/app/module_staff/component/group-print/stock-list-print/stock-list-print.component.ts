import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-stock-list-print',
  templateUrl: './stock-list-print.component.html',
  styleUrls: ['./stock-list-print.component.css']
})
export class StockListPrintComponent  extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }


  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onStockListClose.emit();
  }
}

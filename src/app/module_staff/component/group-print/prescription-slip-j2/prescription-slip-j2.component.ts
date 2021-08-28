import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-prescription-slip-j2',
  templateUrl: './prescription-slip-j2.component.html',
  styleUrls: ['./prescription-slip-j2.component.css']
})
export class PrescriptionSlipJ2Component extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService,
              private datePipe: DatePipe,) {
    super(printService, sessionService);

  }

  ngOnInit() {
    //console.log(this.printData);
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onPrescriptionTypeTwoClose.emit();
  }

  getToday() {
    let date = new Date();
    return this.datePipe.transform(date, 'yyyy-MM-dd')
  }
}

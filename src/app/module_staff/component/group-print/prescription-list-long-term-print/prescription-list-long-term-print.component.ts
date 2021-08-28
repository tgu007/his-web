import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-prescription-list-long-term-print',
  templateUrl: './prescription-list-long-term-print.component.html',
  styleUrls: ['./prescription-list-long-term-print.component.css']
})
export class PrescriptionListLongTermPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService,
              ) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onLongTermPrescriptionListClose.emit();
  }

  getDescription(prescription) {
    let description = prescription.description;
    if (prescription.type == '药品') {
      if (prescription.serveInfo)
        description += ' ' + prescription.serveInfo;
    } else if (prescription.quantityInfo)
      description += ' ' + prescription.quantityInfo;

    if (prescription.frequency && !this.printData.isOneOff)
      description += ' ' + prescription.frequency;

    if (!this.printData.isOneOff && prescription.firstDayQuantityInfo && prescription.firstDayQuantityInfo != 0)
      description += ' 首日:' + prescription.firstDayQuantityInfo + '次';
    return description;
  }
}

import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {BasePrint} from "../BasePrint";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-pending-execution-prescription-print',
  templateUrl: './pending-execution-prescription-print.component.html',
  styleUrls: ['./pending-execution-prescription-print.component.css']
})
export class PendingExecutionPrescriptionPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService,
              public datePipe: DatePipe,) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onPendingPrescriptionListClose.emit();
  }

  getResolvedString() {
    if (this.printData.prescription.childTreatmentList)
      return this.printData.prescription.childTreatmentList.map(t => t.name).join(', ');
    return undefined;
  }
}

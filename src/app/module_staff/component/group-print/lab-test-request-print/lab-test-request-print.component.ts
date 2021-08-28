import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-lab-test-request-print',
  templateUrl: './lab-test-request-print.component.html',
  styleUrls: ['./lab-test-request-print.component.css']
})
export class LabTestRequestPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService,
              public datePipe: DatePipe,
  ) {
    super(printService, sessionService);
  }

  ngOnInit() {
    console.log(this.printData.patientSignIn);
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onLabTestRequestClose.emit();
  }

  getToday() {
    return new Date();
  }
}

import {AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PrintService} from "../../../../service/print.service";
import {BasePrint} from "../BasePrint";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-medical-record-main-print',
  templateUrl: './medical-record-main-print.component.html',
  styleUrls: ['./medical-record-main-print.component.css']
})
export class MedicalRecordMainPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService, public sessionService: SessionService,) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onMedicalRecordMainClose.emit();
  }

}

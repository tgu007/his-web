import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {DomSanitizer} from "@angular/platform-browser";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-patient-sign-in-print',
  templateUrl: './patient-sign-in-print.component.html',
  styleUrls: ['./patient-sign-in-print.component.css']
})
export class PatientSignInPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  constructor(printService: PrintService,
              public sessionService: SessionService,) {
    super(printService, sessionService);
  }

  ngOnInit() {

  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onPatientSignInDetailClose.emit();
  }

}

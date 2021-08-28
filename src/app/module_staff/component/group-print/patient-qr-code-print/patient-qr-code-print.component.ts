import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {PrintService} from "../../../../service/print.service";
import {BasePrint} from "../BasePrint";
import {DomSanitizer} from "@angular/platform-browser";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-patient-qr-code-print',
  templateUrl: './patient-qr-code-print.component.html',
  styleUrls: ['./patient-qr-code-print.component.css']
})
export class PatientQrCodePrintComponent extends BasePrint implements OnInit, AfterViewChecked {
  constructor(printService: PrintService,
              private sanitizer: DomSanitizer,
              public sessionService: SessionService,
  ) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onPatientQrCodeClose.emit();
  }

  getSafeQrCodeBase64() {
    return this.sanitizer.bypassSecurityTrustUrl(this.printData.qrCode);
  }
}

import {AfterViewChecked, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-medical-record-print',
  templateUrl: './medical-record-print.component.html',
  styleUrls: ['./medical-record-print.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class MedicalRecordPrintComponent extends BasePrint implements OnInit, AfterViewChecked {
  medicalRecordHtml: any;
  medicalRecordHeaderHtml: any;

  constructor(printService: PrintService, public sessionService: SessionService,
              private sanitizer: DomSanitizer
  ) {
    super(printService, sessionService);
  }

  ngOnInit() {
    this.medicalRecordHtml = this.sanitizer.bypassSecurityTrustHtml(this.printData.htmlString);
    this.medicalRecordHeaderHtml = this.sanitizer.bypassSecurityTrustHtml(this.printData.htmlHeaderString);
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onMedicalRecordClose.emit();
  }

}

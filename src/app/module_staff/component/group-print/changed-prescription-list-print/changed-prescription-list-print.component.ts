import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-changed-prescription-list-print',
  templateUrl: './changed-prescription-list-print.component.html',
  styleUrls: ['./changed-prescription-list-print.component.css']
})
export class ChangedPrescriptionListPrintComponent extends BasePrint implements OnInit, AfterViewChecked {
  pageSize: any = 9999;

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onChangedPrescriptionListClose.emit();
  }
}

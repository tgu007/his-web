import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-prescription-slip-mz',
  templateUrl: './prescription-slip-mz.component.html',
  styleUrls: ['./prescription-slip-mz.component.css']
})
export class PrescriptionSlipMzComponent extends BasePrint implements OnInit, AfterViewChecked {


  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {

  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onPrescriptionTypeOneClose.emit();
  }

}

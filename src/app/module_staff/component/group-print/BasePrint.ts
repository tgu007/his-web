import {AfterViewChecked, AfterViewInit, Input, OnInit} from "@angular/core";
import {PrintService} from "../../../service/print.service";
import {SessionService} from "../../../service/session.service";

export abstract class BasePrint implements AfterViewInit {
  @Input() printData;
  @Input() openPrintWidowAfterInit = true;
  canClose: any = false
  _printService: PrintService;
  hospitalName;

  protected constructor(printService: PrintService, public sessionService: SessionService,) {
    this._printService = printService;
    this.hospitalName = sessionService.loginUser.organization.name
  }

  ngAfterViewInit(): void {
    //console.log(this.printData);
    if (this.openPrintWidowAfterInit) {
      window.print();
      this.canClose = true;
    }
  }


}

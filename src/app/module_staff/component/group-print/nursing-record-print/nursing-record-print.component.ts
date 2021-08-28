import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-nursing-record-print',
  templateUrl: './nursing-record-print.component.html',
  styleUrls: ['./nursing-record-print.component.css']
})
export class NursingRecordPrintComponent extends BasePrint implements OnInit, AfterViewChecked {
  nursingRecordList: any = []

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
    this.nursingRecordList = this.printData.nursingRecordList.reverse();
    // for (let nursingRecord of this.printData.nursingRecordList) {
    //   nursingRecord["dateToSort"] = new Date(nursingRecord.recordDate)
    //   this.nursingRecordList.push(nursingRecord);
    // }
    // let test = this.nursingRecordList.sort((a, b) => a.dateToSort.getTime() - b.dateToSort.getTime());
    // console.log(test);
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onNursingRecordListClose.emit();
  }

}

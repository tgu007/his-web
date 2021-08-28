import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-chinese-medicine-slip',
  templateUrl: './chinese-medicine-slip.component.html',
  styleUrls: ['./chinese-medicine-slip.component.css']
})
export class ChineseMedicineSlipComponent extends BasePrint implements OnInit, AfterViewChecked {
  rows: any = [];
  columns: any = [];
  data: any = {};

  constructor(printService: PrintService,
              public sessionService: SessionService,
              private datePipe: DatePipe,) {
    super(printService, sessionService);
  }

  ngOnInit() {
    let rowCount = Math.ceil(this.printData.prescriptionList.length / 3)
    for (let i = 0; i < rowCount; i++)
      this.rows.push({});

    for (let i = 0; i < 3; i++)
      this.columns.push({});

    let colIndex;
    let rowIndex;
    for (let i = 0; i < this.printData.prescriptionList.length; i++) {
      rowIndex = Math.floor(i / 3);
      colIndex = i % 3;
      let key = rowIndex.toString() + colIndex.toString();
      this.data[key] = this.printData.prescriptionList[i];
    }

  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onChinseMedicineSlipClose.emit();
  }

  getToday() {
    let date = new Date();
    return this.datePipe.transform(date, 'yyyy-MM-dd')
  }

  getUseDescription() {
    if (this.printData.prescriptionList) {
      let sample = this.printData.prescriptionList[0];
      return `共${sample.fixedQuantity}帖，    ${sample.useMethod.name}`;
    }
    return undefined;
  }
}

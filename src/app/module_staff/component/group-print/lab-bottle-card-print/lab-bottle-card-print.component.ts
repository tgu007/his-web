import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-lab-bottle-card-print',
  templateUrl: './lab-bottle-card-print.component.html',
  styleUrls: ['./lab-bottle-card-print.component.css']
})
export class LabBottleCardPrintComponent extends BasePrint implements OnInit, AfterViewChecked {
  pages: any =[];
  rows: any = [];
  columns: any = [];
  data: any ={};

  constructor(printService: PrintService,
              public sessionService: SessionService) {
    super(printService, sessionService);
  }

  ngOnInit() {
    for (let i = 0; i < 9; i++)
      this.rows.push({});

    for (let i = 0; i < 4; i++)
      this.columns.push({});


    let startPosition = this.printData.positionIndex;
    if (!startPosition)
      startPosition = 0;
    let totalPosition = startPosition + this.printData.cardList.length;
    let pageSize = Math.ceil(totalPosition / 36);
    for (let i = 0; i < pageSize; i++)
      this.pages.push({});

    let pageIndex;
    let colIndex;
    let rowIndex;
    for (let i = 0; i < this.printData.cardList.length; i++) {
      let cardPosition = i + startPosition;
      pageIndex = Math.floor(cardPosition / 36);
      rowIndex = Math.floor((cardPosition % 36) / 4);
      colIndex =  cardPosition% 4;
      let key = pageIndex.toString() + rowIndex.toString() + colIndex.toString();
      this.data[key] = this.printData.cardList[i];
    }

  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onLabBottleCardClose.emit();
  }

}

import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";
import {BasePrint} from "../BasePrint";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-vein-drop-bottle-card',
  templateUrl: './vein-drop-bottle-card.component.html',
  styleUrls: ['./vein-drop-bottle-card.component.css']
})
export class VeinDropBottleCardComponent extends BasePrint implements OnInit, AfterViewChecked {

  pages: any = [];
  rows: any = [];
  columns: any = [];
  data: any = {};

  constructor(printService: PrintService,
              public sessionService: SessionService,) {
    super(printService, sessionService);
  }

  ngOnInit() {
    for (let i = 0; i < 4; i++)
      this.rows.push({});

    for (let i = 0; i < 2; i++)
      this.columns.push({});


    let startPosition = this.printData.positionIndex;
    if (!startPosition)
      startPosition = 0;
    let totalPosition = startPosition + this.printData.cardList.length;
    let pageSize = Math.ceil(totalPosition / 8);
    for (let i = 0; i < pageSize; i++)
      this.pages.push({});

    let pageIndex;
    let colIndex;
    let rowIndex;
    for (let i = 0; i < this.printData.cardList.length; i++) {
      let cardPosition = i + startPosition;
      pageIndex = Math.floor(cardPosition / 8);
      rowIndex = Math.floor((cardPosition % 8) / 2);
      colIndex = cardPosition % 2;
      let key = pageIndex.toString() + rowIndex.toString() + colIndex.toString();
      this.data[key] = this.printData.cardList[i];
    }
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onVeinDropBottleCardClose.emit();
  }


  getUseMethod(card) {
    let useMethod = card.nursingCardRespDtoList[0].useMethod;
    return useMethod;
  }
}

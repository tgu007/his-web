import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-prescription-nursing-card-detail',
  templateUrl: './prescription-nursing-card-detail.component.html',
  styleUrls: ['./prescription-nursing-card-detail.component.css']
})
export class PrescriptionNursingCardDetailComponent implements OnInit {
  @Input() patientCard;
  @Input() cardDate;


  constructor(public datePipe: DatePipe) {

  }

  ngOnInit() {
    this.patientCard.printCard = true;
  }

  getCardTitle() {
    let cardTitle = this.patientCard.cardTypeName;
    if (cardTitle == '静滴瓶贴' && this.patientCard.nursingCardRespDtoList.length > 0)
      cardTitle += ':' + this.patientCard.nursingCardRespDtoList[0].useMethod;
    return cardTitle;
  }
}

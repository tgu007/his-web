import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {PrescriptionService} from "../../../../service/prescription.service";
import {DatePipe} from "@angular/common";
import {FormControl, Validators} from "@angular/forms";
import {SessionService} from "../../../../service/session.service";
import {NzMessageService} from "ng-zorro-antd";
import {PrintService} from "../../../../service/print.service";

@Component({
  selector: 'app-prescription-nursing-card-list',
  templateUrl: './prescription-nursing-card-list.component.html',
  styleUrls: ['./prescription-nursing-card-list.component.css']
})
export class PrescriptionNursingCardListComponent implements OnInit, AfterViewInit {
  collapsed: any = false;
  selectCardType: any;
  dateCardDate: any = new Date();
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  cardList: any;
  cardTypeList = [
    {label: "口服/鼻饲卡", url: "oral", name: "oral", displayFormat: "table"},
    // {label: "鼻饲卡", url: "nose_feed", name: "noseFeed", displayFormat: "table"},
    {label: "注射卡", url: "injection", name: "injection", displayFormat: "table"},
    {label: "静滴卡", url: "vein_drop", name: "veinDrop", displayFormat: "table"},
    {label: "膀冲卡", url: "bladder_washout", name: "bladderWashout", displayFormat: "table"},
    {label: "雾化卡", url: "aerosol", name: "aerosol", displayFormat: "table"},
    {label: "外用卡", url: "external", name: "external", displayFormat: "table"},
    {label: "诊疗卡", url: "treatment", name: "treatment", displayFormat: "table"},
    {label: "静滴瓶贴", url: "vein_drop_bottle", name: "veinDropBottle", displayFormat: "card"},
    {label: "化验瓶贴", url: "lab_bottle", name: "labBottle", displayFormat: "card"}]
  isLoading: any = false;
  mapOfExpandData: { [key: string]: boolean } = {};
  positionIndex: any;
  mapOfTreatmentExpandData: { [key: string]: boolean } = {};


  constructor(private prescriptionService: PrescriptionService,
              private datePipe: DatePipe,
              private message: NzMessageService,
              public sessionService: SessionService,
              public printService: PrintService,) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    let wardFilter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      wardFilter['wardIdList'] = this.sessionService.loginUser.wardIdList;
    this.patientSelectComponent.loadPatientTree(wardFilter)
      .then(
        response => {
          this.patientSelectComponent.patientSelectChangedEvent.subscribe(selectedPatientIdList => {
            this.loadCardList();
          });
        }
      );
  }


  loadCardList() {
    if (this.selectCardType) {
      this.isLoading = true;
      this.prescriptionService.getPrescriptionNursingCardList(this.selectCardType.url, this.getFilter())
        .subscribe(response => {
            if (response) {

              for (let card of response.content)
                if (this.selectCardType.name != 'treatment')
                  this.mapOfExpandData[card.patientSignInId] = true;
                else
                  this.mapOfTreatmentExpandData[card.treatmentId] = true;

              this.cardList = response.content;
            }
            this.isLoading = false
          },
          error => {
            this.message.create("error", error.error.message);
          }
        );
    }
  }

  getFilter() {
    let filterDto = {
      patientSignInIdList: this.patientSelectComponent.getSelectedPatientList(),
      cardDate: this.datePipe.transform(this.dateCardDate, 'yyyy-MM-dd')
    };
    return filterDto;
  }


  signCard(cardSignatureType: any, card: any, index: number, prescription: any, signaturePropertyName: any, patientSignInId: any) {
    let signature = {};
    signature["patientSignInId"] = patientSignInId;
    signature["cardType"] = this.selectCardType.label;
    signature["cardSignatureType"] = cardSignatureType;
    signature["sequence"] = index;
    signature["cardDate"] = this.datePipe.transform(this.dateCardDate, 'yyyy-MM-dd');
    if (prescription)
      signature["prescriptionId"] = prescription.prescriptionId;
    this.isLoading = true;
    this.prescriptionService.sign(signature)
      .subscribe(response => {
          if (response) {
            let signature = response.content;
            if (prescription)
              prescription[signaturePropertyName] = signature;
            else
              card[signaturePropertyName] = signature;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );

  }

  cancelSignature(signature: any, detail = undefined, patientCard = undefined, propertyName = "") {
    this.isLoading = true;
    this.prescriptionService.deleteSignature(signature.uuid)
      .subscribe(response => {
          //signature = undefined;
          if (detail)
            detail[propertyName] = undefined;
          else if (patientCard)
            patientCard[propertyName] = undefined;
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );
  }

  printClicked() {
    if (!this.selectCardType)
      return;

    let printName;
    if (this.selectCardType.displayFormat == 'card') {
      printName = this.selectCardType.name;
    } else {
      if (this.selectCardType.name == 'treatment')
        printName = 'treatmentNursingCard';
      else
        printName = 'nursingCard';
    }

    let toPrintCardList: any = [];
    for (let card of this.cardList) {
      if (card.printCard == undefined || card.printCard == true)
        toPrintCardList.push(card);
    }
    this.printService.onPrintClicked.emit({
      name: printName,
      data: {
        cardList: toPrintCardList,
        positionIndex: this.positionIndex,
        cardDate: this.datePipe.transform(this.dateCardDate, 'yyyy-MM-dd')
      }
    });

  }

}

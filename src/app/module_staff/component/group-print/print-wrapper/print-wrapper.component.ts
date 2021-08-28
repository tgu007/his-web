import {Component, OnInit} from '@angular/core';
import {PrintService} from "../../../../service/print.service";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-print-wrapper',
  templateUrl: './print-wrapper.component.html',
  styleUrls: ['./print-wrapper.component.css']
})
export class PrintWrapperComponent implements OnInit {

  printData: any;
  showPrintMedicalRecordMain: boolean = false;
  showPatientQrCode: boolean = false;
  showTempRecordChart: boolean = false;
  showPatientSignInDetail: boolean = false;
  showPrescriptionList: boolean = false;
  showFeeList: boolean = false;
  showNursingRecordList: boolean = false;
  showStockList: boolean = false;
  showVeinDropBottleCard: boolean = false;
  showInternalPayment: boolean = false;
  showLabBottleCard: boolean = false;
  showPrescriptionSlipOne: boolean = false;
  showPrescriptionSlipTwo: boolean = false;
  showPayment: boolean = false;
  showPrescriptionOrderList: boolean = false;
  showInvoice: boolean = false;
  showFeeSummaryList: boolean = false;
  showFeeDaySummaryList: boolean = false;
  showMedicalRecord = false;
  showPendingPrescriptionList: boolean = false;
  showNursingCard = false;
  showTreatmentNursingCard = false;
  showLongTermPrescriptionList: boolean = false;
  showInternalFeeSummary: boolean = false;
  showReturnOrder: boolean = false;
  showChineseMedicineSlip: boolean = false;
  showSettlementPaymentRequest: boolean = false;
  showChangedPrescriptionList: boolean = false;
  showHYInvoice: boolean = false;
  showPaymentSummary: boolean = false;
  showLabTestRequest: boolean = false;

  constructor(public printService: PrintService,
              public sessionService: SessionService,
  ) {
  }

  ngOnInit() {
    this.printService.onPrintClicked.subscribe(printPram => {
      this.printData = printPram.data;
      if (printPram.name == 'internalPaymentList' || printPram.name == 'hisInternalPaymentList') {
        this.showInternalPayment = true;
      }


      if (printPram.name == 'prescriptionList') {
        this.showPrescriptionList = true;
      }

      if (printPram.name == 'medicalRecordMain') {
        this.showPrintMedicalRecordMain = true;
      }

      if (printPram.name == 'patientQrCode') {
        this.showPatientQrCode = true;
      }

      if (printPram.name == 'tempRecordChart') {
        this.showTempRecordChart = true;
      }

      if (printPram.name == 'patientSignInDetail') {
        this.showPatientSignInDetail = true;
      }

      if (printPram.name == 'feeList') {
        this.showFeeList = true;
      }

      if (printPram.name == 'feeSummaryList') {
        this.showFeeSummaryList = true;
      }

      if (printPram.name == 'feeDaySummaryList') {
        this.showFeeDaySummaryList = true;
      }

      if (printPram.name == 'nursingRecordList') {
        this.showNursingRecordList = true;
      }

      if (printPram.name == 'stockList') {
        this.showStockList = true;
      }

      if (printPram.name == 'prescriptionList') {
        this.showPrescriptionList = true;
      }

      if (printPram.name == 'longTermPrescriptionList') {
        this.showLongTermPrescriptionList = true;
      }

      if (printPram.name == 'veinDropBottle') {
        this.showVeinDropBottleCard = true;
      }

      if (printPram.name == 'labBottle') {
        this.showLabBottleCard = true;
      }


      if (printPram.name == 'prescriptionSlipTypeOne') {
        this.showPrescriptionSlipOne = true;
      }


      if (printPram.name == 'prescriptionSlipTypeTwo') {
        this.showPrescriptionSlipTwo = true;
      }

      if (printPram.name == 'payment') {
        this.showPayment = true;
      }

      if (printPram.name == 'prescriptionOrderSummaryList') {
        this.showPrescriptionOrderList = true;
      }

      if (printPram.name == 'invoice') {
        if (this.sessionService.loginUser.organization.name == '衡阳新安康复医院')
          this.showHYInvoice = true;
        else
          this.showInvoice = true;
      }

      if (printPram.name == 'medicalRecordList') {
        this.showMedicalRecord = true;
      }

      if (printPram.name == 'pendingExecutionPrescription') {
        this.showPendingPrescriptionList = true;
      }

      if (printPram.name == 'nursingCard') {
        this.showNursingCard = true;
      }

      if (printPram.name == 'treatmentNursingCard') {
        this.showTreatmentNursingCard = true;
      }

      if (printPram.name == 'internalFeeSummaryList') {
        this.showInternalFeeSummary = true;
      }

      if (printPram.name == 'prescriptionReturnOrder') {
        this.showReturnOrder = true;
      }

      if (printPram.name == 'chineseMedicineSlip') {
        this.showChineseMedicineSlip = true;
      }

      if (printPram.name == 'settlementPaymentRequest') {
        this.showSettlementPaymentRequest = true;
      }

      if (printPram.name == 'changedPrescriptionList') {
        this.showChangedPrescriptionList = true;
      }

      if (printPram.name == 'paymentSummary') {
        this.showPaymentSummary = true;
      }

      if (printPram.name == 'labTestRequest') {
        this.showLabTestRequest = true;
      }
    });

    this.printService.onLabTestRequestClose.subscribe(() => {
      setTimeout(() => {
        this.showLabTestRequest = false;
      }, 0);
    });

    this.printService.onPaymentSummaryClose.subscribe(() => {
      setTimeout(() => {
        this.showPaymentSummary = false;
      }, 0);
    });

    this.printService.onChangedPrescriptionListClose.subscribe(() => {
      setTimeout(() => {
        this.showChangedPrescriptionList = false;
      }, 0);
    });

    this.printService.onSettlementPaymentRequestClose.subscribe(() => {
      setTimeout(() => {
        this.showSettlementPaymentRequest = false;
      }, 0);
    });

    this.printService.onChinseMedicineSlipClose.subscribe(() => {
      setTimeout(() => {
        this.showChineseMedicineSlip = false;
      }, 0);
    });

    this.printService.onReturnOrderClose.subscribe(() => {
      setTimeout(() => {
        this.showReturnOrder = false;
      }, 0);
    });

    this.printService.onInternalFeeSummaryClose.subscribe(() => {
      setTimeout(() => {
        this.showInternalFeeSummary = false;
      }, 0);
    });

    this.printService.onNursingCardClose.subscribe(() => {
      setTimeout(() => {
        this.showNursingCard = false;
      }, 0);
    });

    this.printService.onTreatmentNursingClose.subscribe(() => {
      setTimeout(() => {
        this.showTreatmentNursingCard = false;
      }, 0);
    });

    this.printService.onPendingPrescriptionListClose.subscribe(() => {
      setTimeout(() => {
        this.showPendingPrescriptionList = false;
      }, 0);
    });

    this.printService.onMedicalRecordClose.subscribe(() => {
      setTimeout(() => {
        this.showMedicalRecord = false;
      }, 0);
    });

    this.printService.onInvoiceClose.subscribe(() => {
      setTimeout(() => {
        this.showInvoice = false;
      }, 0);
    });

    this.printService.onPrescriptionOrderListClose.subscribe(() => {
      setTimeout(() => {
        this.showPrescriptionOrderList = false;
      }, 0);
    });

    this.printService.onPaymentClose.subscribe(() => {
      setTimeout(() => {
        this.showPayment = false;
      }, 0);
    });

    this.printService.onPrescriptionTypeOneClose.subscribe(() => {
      setTimeout(() => {
        this.showPrescriptionSlipOne = false;
      }, 0);
    });

    this.printService.onPrescriptionTypeTwoClose.subscribe(() => {
      setTimeout(() => {
        this.showPrescriptionSlipTwo = false;
      }, 0);
    });

    this.printService.onLabBottleCardClose.subscribe(() => {
      setTimeout(() => {
        this.showLabBottleCard = false;
      }, 0);
    });

    this.printService.onInternalPaymentClose.subscribe(() => {
      setTimeout(() => {
        this.showInternalPayment = false;
      }, 0);
    });

    this.printService.onVeinDropBottleCardClose.subscribe(() => {
      setTimeout(() => {
        this.showVeinDropBottleCard = false;
      }, 0);
    });

    this.printService.onStockListClose.subscribe(() => {
      setTimeout(() => {
        this.showStockList = false;
      }, 0);
    });

    this.printService.onMedicalRecordMainClose.subscribe(() => {
      setTimeout(() => {
        this.showPrintMedicalRecordMain = false;
      }, 0);
    });

    this.printService.onPatientQrCodeClose.subscribe(() => {
      setTimeout(() => {
        this.showPatientQrCode = false;
      }, 0);
    });

    this.printService.onTempRecordChartClose.subscribe(() => {
      setTimeout(() => {
        this.showTempRecordChart = false;
      }, 0);
    });

    this.printService.onPatientSignInDetailClose.subscribe(() => {
      setTimeout(() => {
        this.showPatientSignInDetail = false;
      }, 0);
    });

    this.printService.onPrescriptionListClose.subscribe(() => {
      setTimeout(() => {
        this.showPrescriptionList = false;
      }, 0);
    });

    this.printService.onLongTermPrescriptionListClose.subscribe(() => {
      setTimeout(() => {
        this.showLongTermPrescriptionList = false;
      }, 0);
    });

    this.printService.onFeeListClose.subscribe(() => {
      setTimeout(() => {
        this.showFeeList = false;
      }, 0);
    });

    this.printService.onFeeSummaryListClose.subscribe(() => {
      setTimeout(() => {
        this.showFeeSummaryList = false;
      }, 0);
    });

    this.printService.onFeeDaySummaryListClose.subscribe(() => {
      setTimeout(() => {
        this.showFeeDaySummaryList = false;
      }, 0);
    });

    this.printService.onNursingRecordListClose.subscribe(() => {
      setTimeout(() => {
        this.showNursingRecordList = false;
      }, 0);
    });
  }


}

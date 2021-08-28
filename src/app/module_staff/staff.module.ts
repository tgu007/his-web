import {NgModule} from '@angular/core';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';


import {StaffRoutingModule} from './staff-routing.module';
import {PrescriptionComponent} from "./component/group-prescription/prescription/prescription.component";
import {PrescriptionListComponent} from "./component/group-prescription/prescription-list/prescription-list.component";
import {PrescriptionMedicineDetailComponent} from "./component/group-prescription/prescription-medicine-detail/prescription-medicine-detail.component";
import {PrescriptionTreatmentDetailComponent} from "./component/group-prescription/prescription-treatment-detail/prescription-treatment-detail.component";
import {PrescriptionTextDetailComponent} from "./component/group-prescription/prescription-text-detail/prescription-text-detail.component";
import {ErrorNotFoundComponent} from "./component/group-common/error-not-found/error-not-found.component";
import {LandingComponent} from "./component/landing/landing.component";
import {PatientDetailComponent} from "./component/group-patient-sign-in/patient-detail/patient-detail.component";
import {PatientListComponent} from "./component/group-patient-sign-in/patient-list/patient-list.component";
import {PatientSignInDetailComponent} from "./component/group-patient-sign-in/patient-sign-in-detail/patient-sign-in-detail.component";
import {PatientSignInListComponent} from "./component/group-patient-sign-in/patient-sign-in-list/patient-sign-in-list.component";
import {WardListComponent} from "./component/group-patient-sign-in/ward-list/ward-list.component";
import {PatientFeeListComponent} from "./component/group-fee/patient-fee-list/patient-fee-list.component";
import {PaymentListComponent} from "./component/group-fee/payment-list/payment-list.component";
import {PaymentDetailComponent} from "./component/group-fee/payment-detail/payment-detail.component";
import {PatientSelectComponent} from "./component/group-common/patient-select/patient-select.component";
import {PrescriptionChangedListComponent} from "./component/group-prescription/prescription-changed-list/prescription-changed-list.component";
import {MedicineDetailComponent} from "./component/group-setup/medicine-detail/medicine-detail.component";
import {MedicineListComponent} from "./component/group-setup/medicine-list/medicine-list.component";
import {PatientFeeDetailComponent} from "./component/group-fee/patient-fee-detail/patient-fee-detail.component";
import {ItemListComponent} from "./component/group-setup/item-list/item-list.component";
import {ItemDetailComponent} from "./component/group-setup/item-detail/item-detail.component";
import {CommonDynamicSelectComponent} from "./component/group-common/common-dynamic-select/common-dynamic-select.component";
import {StockListComponent} from "./component/group-inventory/stock-list/stock-list.component";
import {PriceDetailComponent} from "./component/group-setup/price-detail/price-detail.component";
import {OrderListComponent} from "./component/group-inventory/order-list/order-list.component";
import {TransferDetailComponent} from "./component/group-inventory/transfer-detail/transfer-detail.component";
import {TransferListComponent} from "./component/group-inventory/transfer-list/transfer-list.component";
import {OrderDetailTableComponent} from "./component/group-inventory/order-detail-table/order-detail-table.component";
import {TransferDetailTableComponent} from "./component/group-inventory/transfer-detail-table/transfer-detail-table.component";
import {OrderDetailComponent} from "./component/group-inventory/order-detail/order-detail.component";
import {PatientDetailContactComponent} from "./component/group-patient-sign-in/patient-detail-contact/patient-detail-contact.component";
import {PatientSignInDiseaseComponent} from "./component/group-patient-sign-in/patient-sign-in-disease/patient-sign-in-disease.component";
import {PatientSignInSelectComponent} from "./component/group-patient-sign-in/patient-sign-in-select/patient-sign-in-select.component";
import {PrescriptionTextMedicineDetailComponent} from "./component/group-prescription/prescription-text-medicine-detail/prescription-text-medicine-detail.component";
import {PatientSignInInfoComponent} from "./component/group-patient-sign-in/patient-sign-in-Info/patient-sign-in-info.component";
import {PrescriptionExecutionListComponent} from "./component/group-prescription/prescription-exectuion-list/prescription-execution-list.component";
import {PrescriptionMedicinePendingOrderListComponent} from "./component/group-prescription/prescription-medicine-pending-order-list/prescription-medicine-pending-order-list.component";
import {PrescriptionMedicineOrderListComponent} from "./component/group-inventory/prescription-medicine-order-list/prescription-medicine-order-list.component";
import {PrescriptionMedicineOrderProcessedListComponent} from "./component/group-inventory/prescription-medicine-order-processed-list/prescription-medicine-order-processed-list.component";
import {PrescriptionMedicineOrderProcessedListSummaryComponent} from "./component/group-inventory/prescription-medicine-order-processed-list-summary/prescription-medicine-order-processed-list-summary.component";
import {PrescriptionMedicineReturnOrderListComponent} from "./component/group-inventory/prescription-medicine-return-order-list/prescription-medicine-return-order-list.component";
import {PatientAutoFeeListComponent} from "./component/group-fee/patient-auto-fee-list/patient-auto-fee-list.component";
import {PrescriptionNursingCardListComponent} from "./component/group-prescription/prescription-nursing-card-list/prescription-nursing-card-list.component";
import {PrescriptionNursingCardDetailComponent} from "./component/group-prescription/prescription-nursing-card-detail/prescription-nursing-card-detail.component";
import {NursingRecordListComponent} from "./component/group-patient-sign-in/nursing-record-list/nursing-record-list.component";
import {TempRecordListComponent} from "./component/group-patient-sign-in/temp-record-list/temp-record-list.component";
import {TempRecordDetailComponent} from "./component/group-patient-sign-in/temp-record-detail/temp-record-detail.component";
import {NursingRecordDetailComponent} from "./component/group-patient-sign-in/nursing-record-detail/nursing-record-detail.component";
import {TempRecordListBatchComponent} from "./component/group-patient-sign-in/temp-record-list-batch/temp-record-list-batch.component";
import {PatientSignOutComponent} from "./component/group-patient-sign-in/patient-sign-out/patient-sign-out.component";
import {MedicalRecordComponent} from "./component/group-patient-sign-in/medical-record/medical-record.component";
import {LoginComponent} from "./component/group-user/login/login.component";
import {UserRegesitComponent} from "./component/group-common/user-regesit/user-regesit.component";
import {NewUserComponent} from "./component/group-user/new-user/new-user.component";
import {UserPasswordResetComponent} from "./component/group-user/user-password-reset/user-password-reset.component";
import {UserListComponent} from "./component/group-user/user-list/user-list.component";
import {TempRecordTableListComponent} from "./component/group-patient-sign-in/temp-record-table-list/temp-record-table-list.component";
import {TempRecordChartComponent} from "./component/group-patient-sign-in/temp-record-chart/temp-record-chart.component";
import {MedicalRecordTemplateListComponent} from "./component/group-setup/medical-record-template-list/medical-record-template-list.component";
import {MedicalRecordTemplateDetailComponent} from "./component/group-setup/medicial-record-template-detail/medical-record-template-detail.component";
import {MedicalRecordTemplateTagComponent} from "./component/group-setup/medical-record-template-tag/medical-record-template-tag.component";
import {MedicalRecordMainComponent} from "./component/group-patient-sign-in/medical-record-main/medical-record-main.component";
import {
  NZ_I18N,
  NzAlertModule,
  NzBadgeModule, NzButtonModule,
  NzCardModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzDatePickerModule,
  NzDescriptionsModule,
  NzDrawerModule, NzDropDownModule,
  NzFormModule, NzGridModule,
  NzIconModule, NzInputModule,
  NzInputNumberModule, NzLayoutModule, NzMenuModule,
  NzModalModule, NzPopconfirmModule, NzPopoverModule,
  NzResultModule, NzSelectModule, NzSpinModule,
  NzSwitchModule,
  NzTableModule,
  NzTabsModule,
  NzToolTipModule,
  NzTreeModule, zh_CN,
  NzDividerModule,
  NzTransferModule,
  NzTagModule,
  NzUploadModule, NzAnchorModule
} from "ng-zorro-antd";
import {IconsProviderModule} from "../icons-provider.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxEchartsModule} from "ngx-echarts";
import {UEditorModule} from "ngx-ueditor";
import zh from "@angular/common/locales/zh";
import {OrderRequestListComponent} from './component/group-inventory/order-request-list/order-request-list.component';
import {OrderRequestDetailComponent} from './component/group-inventory/order-request-detail/order-request-detail.component';
import {OrderRequestDetailTableComponent} from './component/group-inventory/order-request-detail-table/order-request-detail-table.component';
import {PartialOrderDetailTableComponent} from './component/group-inventory/partial-order-detail-table/partial-order-detail-table.component';
import {PartialOrderListComponent} from './component/group-inventory/partial-order-list/partial-order-list.component';
import {PartialOrderDetailComponent} from './component/group-inventory/partial-order-detail/partial-order-detail.component';
import {MedicalRecordMainPrintComponent} from './component/group-print/medical-record-main-print/medical-record-main-print.component';
import {PrintWrapperComponent} from './component/group-print/print-wrapper/print-wrapper.component';
import {PatientQrCodePrintComponent} from './component/group-print/patient-qr-code-print/patient-qr-code-print.component';
import {TempRecordChartPrintComponent} from './component/group-print/temp-record-chart-print/temp-record-chart-print.component';
import {PatientSignInPrintComponent} from './component/group-print/patient-sign-in-print/patient-sign-in-print.component';
import {PrescriptionListPrintComponent} from './component/group-print/prescription-list-print/prescription-list-print.component';
import {FeeListPrintComponent} from './component/group-print/fee-list-print/fee-list-print.component';
import {NursingRecordPrintComponent} from './component/group-print/nursing-record-print/nursing-record-print.component';
import {MedicineMatchComponent} from './component/group-yb/medicine-match/medicine-match.component';
import {PatientSignInSettleComponent} from './component/group-patient-sign-in/patient-sign-in-settle/patient-sign-in-settle.component';
import {HttpClientModule} from "@angular/common/http";
import {StockListPrintComponent} from './component/group-print/stock-list-print/stock-list-print.component';
import {PrescriptionMedicineUsageComponent} from './component/group-inventory/prescription-medicine-usage/prescription-medicine-usage.component';
import {EmployeeProfileComponent} from './component/group-user/employee-profile/employee-profile.component';
import {TreatmentListComponent} from './component/group-setup/treatment-list/treatment-list.component';
import {TreatmentDetailComponent} from './component/group-setup/treatment-detail/treatment-detail.component';
import {FeeCheckComponent} from "./component/group-fee/fee-check/fee-check.component";
import {VeinDropBottleCardComponent} from "./component/group-print/vein-dorp-bottle-card/vein-drop-bottle-card.component";
import {ChargeableItemListComponent} from "./component/internal-account/chargeable-item-list/chargeable-item-list.component";
import {ChargeableItemDetailComponent} from "./component/internal-account/chargeable-item-detail/chargeable-item-detail.component";
import {InternalAutoFeeListComponent} from './component/internal-account/temp/internal-auto-fee-list/internal-auto-fee-list.component';
import {InternalAutoFeeDetailComponent} from './component/internal-account/temp/internal-auto-fee-detail/internal-auto-fee-detail.component';
import {InternalFeeDetailComponent} from './component/internal-account/temp/internal-fee-detail/internal-fee-detail.component';
import {InternalFeeListComponent} from './component/internal-account/temp/internal-fee-list/internal-fee-list.component';
import {InternalPaymentListComponent} from './component/internal-account/temp/internal-payment-list/internal-payment-list.component';
import {InternalPaymentDetailComponent} from './component/internal-account/temp/internal-payment-detail/internal-payment-detail.component';
import {FeePaymentSummaryComponent} from './component/internal-account/temp/fee-payment-summary/fee-payment-summary.component';
import {InternalPaymentPrintComponent} from './component/group-print/internal-payment-print/internal-payment-print.component';
import {LabBottleCardPrintComponent} from "./component/group-print/lab-bottle-card-print/lab-bottle-card-print.component";
import {HisInternalAutoFeeListComponent} from './component/internal-account/his-internal-auto-fee-list/his-internal-auto-fee-list.component';
import {HisInternalAutoFeeDetailComponent} from './component/internal-account/his-internal-auto-fee-detail/his-internal-auto-fee-detail.component';
import {HisInternalFeeDetailComponent} from './component/internal-account/his-internal-fee-detail/his-internal-fee-detail.component';
import {HisInternalFeeListComponent} from './component/internal-account/his-internal-fee-list/his-internal-fee-list.component';
import {HisInternalPaymentListComponent} from './component/internal-account/his-internal-payment-list/his-internal-payment-list.component';
import {HisInternalPaymentDetailComponent} from './component/internal-account/his-internal-payment-detail/his-internal-payment-detail.component';
import {HisFeePaymentSummaryComponent} from './component/internal-account/his-fee-payment-summary/his-fee-payment-summary.component';
import {CenterFeeValidationComponent} from './component/group-fee/center-fee-validation/center-fee-validation.component';
import {YbImageUploadComponent} from './component/group-inventory/yb-image-upload/yb-image-upload.component';
import {PrescriptionSlipMzComponent} from './component/group-print/prescription-slip-mz/prescription-slip-mz.component';
import {PrescriptionSlipJ2Component} from './component/group-print/prescription-slip-j2/prescription-slip-j2.component';
import {PaymentPrintComponent} from './component/group-print/payment-print/payment-print.component';
import {PrescriptionOrderSummaryPrintComponent} from './component/group-print/prescription-order-summary-print/prescription-order-summary-print.component';
import {InvoicePrintComponent} from './component/group-print/invoice-print/invoice-print.component';
import {FeeSummaryListPrintComponent} from './component/group-print/fee-summary-list-print/fee-summary-list-print.component';
import {PreDefinedPrescriptionGroupComponent} from "./component/group-prescription/pre-defined-prescription-group/pre-defined-prescription-group.component";
import {DrgGroupListComponent} from "./component/group-patient-sign-in/drg-group-list/drg-group-list.component";
import {DrgGroupDetailComponent} from "./component/group-patient-sign-in/drg-group-detail/drg-group-detail.component";
import {MedicalRecordPrintComponent} from './component/group-print/medical-record-print/medical-record-print.component';
import {PendingExecutionPrescriptionPrintComponent} from './component/group-print/pending-execution-prescription-print/pending-execution-prescription-print.component';
import {DoctorAgreementComponent} from './component/group-user/doctor-agreement/doctor-agreement.component';
import {NursingCardPrintComponent} from './component/group-print/nursing-card-print/nursing-card-print.component';
import {NursingTreatmentCardPrintComponent} from './component/group-print/nursing-treatment-card-print/nursing-treatment-card-print.component';
import {YbSignInRecordComponent} from './component/group-patient-sign-in/yb-sign-in-record/yb-sign-in-record.component';
import {PrescriptionListLongTermPrintComponent} from "./component/group-print/prescription-list-long-term-print/prescription-list-long-term-print.component";
import { DrgRecordComponent } from './component/group-yb/drg-record/drg-record.component';
import { FeeDaySummaryPrintComponent } from './component/group-print/fee-day-summary-print/fee-day-summary-print.component';
import { InternalFeeSummaryPrintComponent } from './component/group-print/internal-fee-summary-print/internal-fee-summary-print.component';
import { PrescriptionReturnOrderPrintComponent } from './component/group-print/prescription-return-order-print/prescription-return-order-print.component';
import { DrgRecordOperationComponent } from './component/group-yb/drg-record-operation/drg-record-operation.component';
import {ChineseMedicineSlipComponent} from "./component/group-print/chinese-medicine-slip/chinese-medicine-slip.component";
import { SettlementSummaryComponent } from './component/group-yb/settlement-summary/settlement-summary.component';
import { DepartmentFeeSummaryComponent } from './component/group-fee/department-fee-summary/department-fee-summary.component';
import { SettlementPaymentRequestComponent } from './component/group-yb/settlement-payment-request/settlement-payment-request.component';
import { PrintSettlementPaymentRequestComponent } from './component/group-print/print-settlement-payment-request/print-settlement-payment-request.component';
import { ChangedPrescriptionListPrintComponent } from './component/group-print/changed-prescription-list-print/changed-prescription-list-print.component';
import { HyInvoicePrintComponent } from './component/group-print/hy-invoice-print/hy-invoice-print.component';
import { PaymentSummaryComponent } from './component/group-fee/payment-summary/payment-summary.component';
import { PaymentSummaryPrintComponent } from './component/group-print/payment-summary-print/payment-summary-print.component';
import { LabTestRequestPrintComponent } from './component/group-print/lab-test-request-print/lab-test-request-print.component';
import { PreDefinedMedicinePrescriptionComponent } from './component/group-prescription/pre-defined-medicine-prescription/pre-defined-medicine-prescription.component';
import { PaymentListAllComponent } from './component/group-fee/payment-list-all/payment-list-all.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    PrescriptionComponent,
    PrescriptionListComponent,
    PrescriptionMedicineDetailComponent,
    PrescriptionTreatmentDetailComponent,
    PrescriptionTextDetailComponent,
    ErrorNotFoundComponent,
    LandingComponent,
    PatientDetailComponent,
    PatientListComponent,
    PatientSignInDetailComponent,
    PatientSignInListComponent,
    WardListComponent,
    PatientFeeListComponent,
    PaymentListComponent,
    PaymentDetailComponent,
    PatientSelectComponent,
    PrescriptionChangedListComponent,
    MedicineDetailComponent,
    MedicineListComponent,
    PatientFeeDetailComponent,
    ItemListComponent,
    ItemDetailComponent,
    CommonDynamicSelectComponent,
    StockListComponent,
    PriceDetailComponent,
    OrderListComponent,
    TransferDetailComponent,
    TransferListComponent,
    OrderDetailTableComponent,
    TransferDetailTableComponent,
    OrderDetailComponent,
    PatientDetailContactComponent,
    PatientSignInDiseaseComponent,
    PatientSignInSelectComponent,
    PrescriptionTextMedicineDetailComponent,
    PatientSignInInfoComponent,
    PrescriptionExecutionListComponent,
    PrescriptionMedicinePendingOrderListComponent,
    PrescriptionMedicineOrderListComponent,
    PrescriptionMedicineOrderProcessedListComponent,
    PrescriptionMedicineOrderProcessedListSummaryComponent,
    PrescriptionMedicineReturnOrderListComponent,
    PatientAutoFeeListComponent,
    PrescriptionNursingCardListComponent,
    PrescriptionNursingCardDetailComponent,
    NursingRecordListComponent,
    TempRecordListComponent,
    TempRecordDetailComponent,
    NursingRecordDetailComponent,
    TempRecordListBatchComponent,
    PatientSignOutComponent,
    MedicalRecordComponent,
    LoginComponent,
    UserRegesitComponent,
    NewUserComponent,
    UserPasswordResetComponent,
    UserListComponent,
    TempRecordTableListComponent,
    TempRecordChartComponent,
    MedicalRecordTemplateListComponent,
    MedicalRecordTemplateDetailComponent,
    MedicalRecordTemplateTagComponent,
    MedicalRecordMainComponent,
    OrderRequestListComponent,
    OrderRequestDetailComponent,
    OrderRequestDetailTableComponent,
    PartialOrderDetailTableComponent,
    PartialOrderListComponent,
    PartialOrderDetailComponent,
    MedicalRecordMainPrintComponent,
    PrintWrapperComponent,
    PatientQrCodePrintComponent,
    TempRecordChartPrintComponent,
    PatientSignInPrintComponent,
    PrescriptionListPrintComponent,
    FeeListPrintComponent,
    NursingRecordPrintComponent,
    MedicineMatchComponent,
    PatientSignInSettleComponent,
    StockListPrintComponent,
    PrescriptionMedicineUsageComponent,
    EmployeeProfileComponent,
    TreatmentListComponent,
    TreatmentDetailComponent,
    FeeCheckComponent,
    VeinDropBottleCardComponent,
    ChargeableItemListComponent,
    ChargeableItemDetailComponent,
    InternalAutoFeeListComponent,
    InternalAutoFeeDetailComponent,
    InternalFeeDetailComponent,
    InternalFeeListComponent,
    InternalPaymentListComponent,
    InternalPaymentDetailComponent,
    FeePaymentSummaryComponent,
    InternalPaymentPrintComponent,
    LabBottleCardPrintComponent,
    HisInternalAutoFeeListComponent,
    HisInternalAutoFeeDetailComponent,
    HisInternalFeeDetailComponent,
    HisInternalFeeListComponent,
    HisInternalPaymentListComponent,
    HisInternalPaymentDetailComponent,
    HisFeePaymentSummaryComponent,
    CenterFeeValidationComponent,
    YbImageUploadComponent,
    PrescriptionSlipMzComponent,
    PrescriptionSlipJ2Component,
    PaymentPrintComponent,
    PrescriptionOrderSummaryPrintComponent,
    InvoicePrintComponent,
    FeeSummaryListPrintComponent,
    PreDefinedPrescriptionGroupComponent,
    DrgGroupListComponent,
    DrgGroupDetailComponent,
    MedicalRecordPrintComponent,
    PendingExecutionPrescriptionPrintComponent,
    DoctorAgreementComponent,
    NursingCardPrintComponent,
    NursingTreatmentCardPrintComponent,
    YbSignInRecordComponent,
    PrescriptionListLongTermPrintComponent,
    DrgRecordComponent,
    FeeDaySummaryPrintComponent,
    InternalFeeSummaryPrintComponent,
    PrescriptionReturnOrderPrintComponent,
    DrgRecordOperationComponent,
    ChineseMedicineSlipComponent,
    SettlementSummaryComponent,
    DepartmentFeeSummaryComponent,
    SettlementPaymentRequestComponent,
    PrintSettlementPaymentRequestComponent,
    ChangedPrescriptionListPrintComponent,
    HyInvoicePrintComponent,
    PaymentSummaryComponent,
    PaymentSummaryPrintComponent,
    LabTestRequestPrintComponent,
    PreDefinedMedicinePrescriptionComponent,
    PaymentListAllComponent,],
  imports: [
    NzAlertModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzTreeModule,
    NzCollapseModule,
    NzResultModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzDescriptionsModule,
    NzCardModule,
    NzBadgeModule,
    NzTabsModule,
    NzIconModule,
    NzSwitchModule,
    NzFormModule,
    NzModalModule,
    NzTableModule,
    NzInputNumberModule,
    NzPopconfirmModule,
    NzMenuModule,
    NzGridModule,
    NzLayoutModule,
    NzDropDownModule,
    NzSpinModule,
    NzInputModule,
    NzButtonModule,
    NzTableModule,
    NzSelectModule,
    NzPopoverModule,
    NzDividerModule,
    NzTransferModule,
    NzTagModule,
    CommonModule,
    IconsProviderModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule,
    HttpClientModule,
    NzUploadModule,
    UEditorModule.forRoot({
        js: [
          '/assets/ueditor/ueditor.all.js',
          '/assets/ueditor/ueditor.config.js',
          //'../../../../assets/ueditor/Formdesign4_1/formdesign/leipi.formdesign.v4.js',
        ],
        options: {UEDITOR_HOME_URL: '/assets/ueditor/'}
      }
    ),
    StaffRoutingModule,
    NzAnchorModule
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}, DatePipe],
  entryComponents: [
    PatientListComponent,
    PatientDetailComponent
  ],
  exports: [
    NgxEchartsModule
  ]
})
export class StaffModule {
}

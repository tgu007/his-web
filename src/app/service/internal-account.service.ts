import { Injectable } from '@angular/core';
import {AppService} from "./app.service";
import {AbstractControl, ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class InternalAccountService {

  constructor(private appService: AppService) { }

  getPagedItemList(searchCode: any, pageNum: any) {
    return this.appService.httpPost('api/internal_account/item/list/' + pageNum, searchCode);
  }

  getItemList(searchCode: any) {
    return this.appService.httpPost('api/internal_account/item/list', searchCode);
  }

  saveItem(item: any) {
    return this.appService.httpPost('api/internal_account/item/save', item);
  }

  getPagedAutoFeeList(filter: any, pageNum: any) {
    return this.appService.httpPost('api/internal_account/auto_fee/list/' + pageNum, filter);
  }

  saveAutoFee(autoFee: any) {
    return this.appService.httpPost('api/internal_account/auto_fee/save', autoFee);
  }

  cancelFee(uuid: any) {
    return this.appService.httpPost('api/internal_account/fee/cancel/' + uuid);
  }

  getPagedFeeList(filter: any, pageNum: any) {
    return this.appService.httpPost('api/internal_account/fee/list/' + pageNum, filter);
  }

  saveFee(fee: any) {
    return this.appService.httpPost('api/internal_account/fee/save', fee);
  }

  getPagedPaymentList(filter: any, pageNum: any) {
    return this.appService.httpPost('api/internal_account/payment/list/' + pageNum, filter);
  }

  savePayment(payment: any) {
    return this.appService.httpPost('api/internal_account/payment/save', payment);
  }

  cancelPayment(paymentId: any) {
    return this.appService.httpPost('api/internal_account/payment/cancel/' + paymentId);
  }

  confirmPayment(paymentId: any) {
    return this.appService.httpPost('api/internal_account/payment/confirm/' + paymentId);
  }

  getFeePaymentList() {
    return this.appService.httpPost('api/internal_account/fee/payment/summary');
  }

  getHisPagedAutoFeeList(patientSignInId: any, pageNum: any) {
    return this.appService.httpPost(`api/internal_account/his/auto_fee/list/${pageNum}/${patientSignInId}`);
  }

  saveHisAutoFee(autoFee: any) {
    return this.appService.httpPost('api/internal_account/his/auto_fee/save', autoFee);
  }

  getHisPagedFeeList(filter: {}, pageNum: any) {
    return this.appService.httpPost('api/internal_account/his/fee/list/' + pageNum, filter);
  }

  cancelHisFee(uuid: any) {
    return this.appService.httpPost('api/internal_account/his/fee/cancel/' + uuid);
  }

  saveHisFee(fee: any) {
    return this.appService.httpPost('api/internal_account/his/fee/save', fee);
  }

  getHisPagedPaymentList(filter: any, pageNum: any) {
    return this.appService.httpPost('api/internal_account/his/payment/list/' + pageNum, filter);
  }

  saveHisPayment(payment: any) {
    return this.appService.httpPost('api/internal_account/his/payment/save', payment);
  }

  cancelHisPayment(paymentId: any) {
    return this.appService.httpPost('api/internal_account/his/payment/cancel/' + paymentId);
  }

  confirmHisPayment(paymentId: any) {
    return this.appService.httpPost('api/internal_account/his/payment/confirm/' + paymentId);
  }

  getHisFeePaymentList() {
    return this.appService.httpPost('api/internal_account/his/fee/payment/summary');
  }

  getFeeSummaryList(patientSignInId: any) {
    return this.appService.httpPost(`api/internal_account/fee/${patientSignInId}/list/summary`);
  }
}

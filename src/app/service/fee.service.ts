import {Injectable} from '@angular/core';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  constructor(private appService: AppService) {
  }

  toChineseNumeral(num) {
    var numerals = {
      "-": "负", ".": "点", 0: "零", 1: "壹", 2: "贰", 3: "叁", 4: "肆", 5: "伍",
      6: "陆", 7: "柒", 8: "捌", 9: "玖", 10: "拾", 100: "佰", 1000: "仟", 10000: "万"
    };
    // 如果num为负数
    if (num < 0) {
      return numerals['-'] + this.toChineseNumeral(-num);
      // num 为 0或0点几的小数
    } else if (num < 1) {
      return num.toString().split('').reduce(function (p, n) {
        return p + numerals[n];
      }, '');
    } else if (num > Math.floor(num)) {
      return this.toChineseNumeral(Math.floor(num)) + this.toChineseNumeral(parseFloat(num.toString().replace(/^.*\./, '0.'))).slice(1);
    } else {
      return [10000, 1000, 100, 10, 1].reduce(function (p, n) {
        if (num >= n) {
          if (p.ling) p.ch += numerals[0];
          p.ch += numerals[Math.floor(num / n)];
          if (n != 1) p.ch += numerals[n];
          p.ling = false;
        } else if (p.ch) {
          p.ling = true;
        }
        num %= n;
        return p;
      }, {ch: '', ling: false}).ch.replace(/^一十/, '十');
    }
  }

  getFeeTypeList(patientSignInId: any) {
    return this.appService.httpPost(`api/fee/${patientSignInId}/type/list`);
  }

  getDepartmentFeeTypeList(filter: any) {
    return this.appService.httpPost(`api/fee/fee_type/department/list`, filter);
  }

  getFeeList(patientSignInId: any, pageNumber: any, filterDto: any, listType: any) {
    let url = `api/fee/${patientSignInId}/list/${listType}`;
    if (pageNumber)
      url = url + "/" + pageNumber;
    return this.appService.httpPost(url, filterDto);
  }

  getAllFeeList(filterDto: any, patientSignInId: any) {
    return this.appService.httpPost(`api/fee/${patientSignInId}/list/simple/all`, filterDto);
  }

  getPaymentSummaryList(dateFilter: any) {
    return this.appService.httpPost(`api/fee/payment/list/summary`, dateFilter);
  }


  createNewFee(newFee: any) {
    return this.appService.httpPost('api/fee/save', newFee);
  }

  getPatientPaymentList(signInId: any, pageIndex: any) {
    return this.appService.httpPost(`api/fee/payment/list/${signInId}/${pageIndex}`);
  }

  getAllPaymentList(filter: any, pageIndex: any) {
    return this.appService.httpPost(`api/fee/payment/list/all/${pageIndex}`, filter);
  }

  getPaymentMethodList() {
    return this.appService.httpGet('api/basic/payment_method');
  }

  saveNewPayment(newPayment: any) {
    return this.appService.httpPost('api/fee/payment/create', newPayment);
  }

  confirmPayment(uuid: any) {
    return this.appService.httpPost('api/fee/payment/confirm/' + uuid);
  }

  cancelPayment(uuid: any) {
    return this.appService.httpPost('api/fee/payment/cancel/' + uuid);
  }

  updateFeeStatus(feeIdList: any, action: any) {
    return this.appService.httpPost('api/fee/' + action, feeIdList);
  }

  createNewAutoFee(newAutoFee: any) {
    return this.appService.httpPost('api/fee/auto/create', newAutoFee);
  }

  getAutoFeeList(patientSignInId: any, pageNumber: number, filter: any) {
    return this.appService.httpPost(`api/fee/auto/${patientSignInId}/list/${pageNumber}`, filter);
  }

  enableAutoFee(autoFeeId: any) {
    return this.appService.httpPost('api/fee/auto/enable/' + autoFeeId);
  }

  disableAutoFee(autoFeeId: any) {
    return this.appService.httpPost('api/fee/auto/disable/' + autoFeeId);
  }


  timeAdjustment(feeTimeAdjust: any) {
    return this.appService.httpPost('api/fee/time_adjustment', feeTimeAdjust);
  }

  supervisorAdjustment(feeSupervisorAdjust: any) {
    return this.appService.httpPost('api/fee/supervisor_adjustment', feeSupervisorAdjust);
  }

  getFeeCheckList(patientSignInId: any, filter: any) {
    return this.appService.httpPost(`api/fee/check/${patientSignInId}`, filter);
  }

  cancelPartialFee(partialCancelFee: any) {
    return this.appService.httpPost('api/fee/cancel/partial', partialCancelFee);
  }

  getCurrentInvoiceNumber() {
    return this.appService.httpPost('api/fee/invoice_number/current');
  }

  generateInvoice(patientSignInId: any, currentInvoiceNumber: any) {
    return this.appService.httpPost(`api/fee/invoice/generate/${patientSignInId}/${currentInvoiceNumber}`);
  }


  autoFeeManualRun(autoFeeId: any) {
    return this.appService.httpPost(`api/fee/auto/${autoFeeId}/manual_run`);
  }


  getDepartmentFeeList(filterDto: any) {
    return this.appService.httpPost(`api/fee/department/summary/list`, filterDto);
  }

  nightlyJobManualRun() {
    return this.appService.httpPost('api/fee/daily_run/manual');
  }
}

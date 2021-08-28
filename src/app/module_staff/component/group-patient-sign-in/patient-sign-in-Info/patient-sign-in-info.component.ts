import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-patient-sign-in-Info',
  templateUrl: './patient-sign-in-info.component.html',
  styleUrls: ['./patient-sign-in-info.component.css']
})
export class PatientSignInInfoComponent implements OnInit {
  patientSignIn;

  constructor() {
  }

  ngOnInit() {
  }

  resetDisplayInfo(currentSignIn: any) {
    this.patientSignIn = currentSignIn;
  }

  getYBSignInDateCellColour() {
    let colour = 'green';
    if (this.patientSignIn != null) {
      if (this.patientSignIn.ybSignInRecordDaysLeft <= 0)
        colour = 'red';
      else if (this.patientSignIn.ybSignInRecordDaysLeft <= 5)
        colour = 'orange';
    }
    return {'color': colour};
  }

  getBalanceDescription(patientSignIn: any) {
    if(patientSignIn)
    {
      let description = '余额计算公式：预交金额减去与医保预结算后医保返回的现金支付总额：' +  this.patientSignIn.totalPaidAmount + '-' + this.patientSignIn.selfPayFeeAmount;
      if(patientSignIn.pendingFeeAmount > 0)
        description += `当前仍有${patientSignIn.pendingFeeAmount}元费用未结算，若需计算准确余额，请上传所有待传费用`
      else
        description += `所有费用已经上传，当前余额准确`
      return description;
    }
    return undefined;
  }
}

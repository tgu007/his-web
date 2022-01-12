import {Component, OnInit} from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-patient-insurance-info',
  templateUrl: './patient-insurance-info.component.html',
  styleUrls: ['./patient-insurance-info.component.css']
})
export class PatientInsuranceInfoComponent implements OnInit {
  name: any;
  idNumber: any;
  isLoading: boolean;
  patientBasicInfo: any;
  patientInsuranceInfo:any;

  constructor(
    private ybService: YbTzService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit() {
  }

  checkPatientInfoClicked() {
    this.patientBasicInfo = undefined;
    let pram = {};
    pram["name"] = this.name;
    pram["idNumber"] = this.idNumber;

    this.isLoading = true;
    this.ybService.getPatientInfo(pram)
      .subscribe(response => {
          if (response) {
            this.isLoading = false;
            this.patientBasicInfo = response.baseinfo;
            this.patientInsuranceInfo = response.insuinfo;
            for (let insuranceInfo of this.patientInsuranceInfo) {
              this.addFriendlyLabel(insuranceInfo);
            }
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        });

  }

  private addFriendlyLabel(insuranceInfo: any) {
    if(insuranceInfo.insutype =='310')
      insuranceInfo["insutypeText"] = '职工基本医疗保险';
    else if(insuranceInfo.insutype =='320')
      insuranceInfo["insutypeText"] = '公务员医疗补助';
    else if(insuranceInfo.insutype =='330')
      insuranceInfo["insutypeText"] = '大额医疗费用补助';
    else if(insuranceInfo.insutype =='340')
      insuranceInfo["insutypeText"] = '离休人员医疗保障';
    else if(insuranceInfo.insutype =='350')
      insuranceInfo["insutypeText"] = '一至六级残废军人医疗补助';
    else if(insuranceInfo.insutype =='360')
      insuranceInfo["insutypeText"] = '老红军医疗保障';
    else if(insuranceInfo.insutype =='370')
      insuranceInfo["insutypeText"] = '企业补充医疗保险';
    else if(insuranceInfo.insutype =='380')
      insuranceInfo["insutypeText"] = '新型农村合作医疗';
    else if(insuranceInfo.insutype =='391')
      insuranceInfo["insutypeText"] = '城镇居民基本医疗保险';
    else if(insuranceInfo.insutype =='392')
      insuranceInfo["insutypeText"] = '城乡居民大病医疗保险';
    else if(insuranceInfo.insutype =='399')
      insuranceInfo["insutypeText"] = '其他特殊人员医疗保障';
    else if(insuranceInfo.insutype =='410')
      insuranceInfo["insutypeText"] = '长期照护保险';
    else if(insuranceInfo.insutype =='510')
      insuranceInfo["insutypeText"] = '生育保险';

    if(insuranceInfo.psn_type =='11')
      insuranceInfo["psn_type_text"] = '在职';
    else if(insuranceInfo.psn_type =='12')
      insuranceInfo["psn_type_text"] = '退休';
    else if(insuranceInfo.psn_type =='1204')
      insuranceInfo["psn_type_text"] = '提前退休';
    else if(insuranceInfo.psn_type =='13')
      insuranceInfo["psn_type_text"] = '离休';
    else if(insuranceInfo.psn_type =='1401')
      insuranceInfo["psn_type_text"] = '新生儿';
    else if(insuranceInfo.psn_type =='1402')
      insuranceInfo["psn_type_text"] = '学龄前儿童';
    else if(insuranceInfo.psn_type =='1403')
      insuranceInfo["psn_type_text"] = '中小学生';
    else if(insuranceInfo.psn_type =='1404')
      insuranceInfo["psn_type_text"] = '大学生';
    else if(insuranceInfo.psn_type =='1405')
      insuranceInfo["psn_type_text"] = '未成年（未入学）';
    else if(insuranceInfo.psn_type =='15')
      insuranceInfo["psn_type_text"] = '居民（成年）';
    else if(insuranceInfo.psn_type =='16')
      insuranceInfo["psn_type_text"] = '居民（老年）';
    else if(insuranceInfo.psn_type =='1701')
      insuranceInfo["psn_type_text"] = '城乡居民';


  }
}

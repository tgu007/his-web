import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SwipeActionComponent, TabBarOnPressEvent} from "ng-zorro-antd-mobile";
import {PatientSelfService} from "../../service/patient-self.service";
import {PatientFeeDetailComponent} from "../../module_staff/component/group-fee/patient-fee-detail/patient-fee-detail.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-my-fee',
  templateUrl: './my-fee.component.html',
  styleUrls: ['./my-fee.component.css']
})
export class MyFeeComponent implements OnInit {
  patientSignInId: any;
  tabbarStyle: object = {height: '400px'};
  patientSignIn: any;
  right = [{
    text: '',
    style: {backgroundColor: '#ddd', color: 'white'}
  },];
  @ViewChild(SwipeActionComponent, {static: true}) swipeActionComponent: SwipeActionComponent;
  calendarState: any = {
    date: [new Date(), new Date()],
    show: false,
    rowSize: 'normal',
    maxDate: new Date(),
  };
  isLoading: any = false;
  summaryFeeList: any;
  feeSummaryTotal: any = 0;
  selectedTabIndex: any = 0;
  detailFeeList: any;
  feeDetailTotal: any = 0;
  requireRefreshOnTabChange: any = true;


  constructor(private route: ActivatedRoute,
              private patientSelfService: PatientSelfService,
              public datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.patientSignInId = this.route.snapshot.paramMap.get('patientId');
    this.getPatientInfo();
    this.getPatientFeeSummaryList();
  }

  getPatientInfo() {
    this.isLoading = true;
    this.patientSelfService.getPatientInfo(this.patientSignInId)
      .subscribe(response => {
          this.isLoading = false;
          if (response) {
            this.patientSignIn = response.content;
          }
        },
        error => {
          this.isLoading = false;
        });
  }

  getPatientFeeSummaryList() {
    let filter = {};
    filter["startDate"] = this.datePipe.transform(this.calendarState.date[0], 'yyyy-MM-dd HH:mm:ss');
    filter["endDate"] = this.datePipe.transform(this.calendarState.date[1], 'yyyy-MM-dd HH:mm:ss');
    this.isLoading = true;
    this.feeSummaryTotal = 0;
    this.patientSelfService.getFeeSummaryList(this.patientSignInId, filter)
      .subscribe(response => {
          this.isLoading = false;
          if (response) {
            this.summaryFeeList = response.content;
            if (this.summaryFeeList.length > 0)
              this.feeSummaryTotal = this.summaryFeeList.map(f => f.totalAmount).reduce((sum, current) => sum + current);
            else
              this.feeSummaryTotal = 0;
          }
        },
        error => {
          this.isLoading = false;
        });
  }

  private getPatientFeeDetailList() {
    let filter = {};
    filter["startDate"] = this.datePipe.transform(this.calendarState.date[0], 'yyyy-MM-dd HH:mm:ss');
    filter["endDate"] = this.datePipe.transform(this.calendarState.date[1], 'yyyy-MM-dd HH:mm:ss');
    this.isLoading = true;
    this.feeDetailTotal = 0;
    this.patientSelfService.getFeeDetailList(this.patientSignInId, filter)
      .subscribe(response => {
          this.isLoading = false;
          if (response) {
            this.detailFeeList = response.content;
            if (this.detailFeeList.length > 0)
              this.feeDetailTotal = this.detailFeeList.map(f => f.totalAmount).reduce((sum, current) => sum + current);
            else
              this.feeDetailTotal = 0;
          }
        },
        error => {
          this.isLoading = false;
        });
  }

  tabBarTabOnPress(pressParam: any) {
    this.selectedTabIndex = pressParam.index;
    if (this.requireRefreshOnTabChange) {
      this.requireRefreshOnTabChange = false;
      this.refresh();
    }
  }

  showDateSelect() {
    this.calendarState.show = true;
  }


  getSelectedDateRange() {
    return this.datePipe.transform(this.calendarState.date[0], 'MM/dd') + '-'
      + this.datePipe.transform(this.calendarState.date[1], 'MM/dd');
  }

  calendarDateClosed(isConfirm: boolean, value: any) {
    this.calendarState.show = false;
    this.swipeActionComponent.close();
    if (isConfirm) {
      const {startDate, endDate} = value;
      this.calendarState.date = [startDate, endDate];
      this.refresh();
      this.requireRefreshOnTabChange = true;
    }
  }

  refresh() {
    if (this.selectedTabIndex == 0)
      this.getPatientFeeSummaryList();
    else
      this.getPatientFeeDetailList();
  }

}


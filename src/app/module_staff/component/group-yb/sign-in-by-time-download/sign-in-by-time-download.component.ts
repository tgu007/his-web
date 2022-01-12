import { Component, OnInit } from '@angular/core';
import {BasicService} from "../../../../service/basic.service";
import {DatePipe} from "@angular/common";
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-sign-in-by-time-download',
  templateUrl: './sign-in-by-time-download.component.html',
  styleUrls: ['./sign-in-by-time-download.component.css']
})
export class SignInByTimeDownloadComponent implements OnInit {
  filterDateRange: any = ['2021-01-01', '2021-12-31'];
  busy: any = false;
  signInHistoryList: any;

  constructor(
    private datePipe: DatePipe,
    public ybService: YbTzService,
    private message: NzMessageService,

  ) { }

  ngOnInit() {
  }

  search() {
    let pram = {};
    pram['begntime'] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd');
    pram['endtime'] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd');
    this.busy = true;
    this.ybService.downloadSignInHistoryByTime(pram)
      .toPromise().then(response => {
      this.signInHistoryList = response;
      console.log(this.signInHistoryList);
      this.busy = false;
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });
  }
}

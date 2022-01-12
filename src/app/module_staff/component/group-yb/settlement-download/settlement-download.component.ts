import {Component, OnInit} from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-settlement-download',
  templateUrl: './settlement-download.component.html',
  styleUrls: ['./settlement-download.component.css']
})
export class SettlementDownloadComponent implements OnInit {
  signInNumber: any;
  settlement: any;
  busy: any = false;
  settlementDetailList: any;

  constructor(
    private ybService: YbTzService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit() {
  }

  searchSettlement() {
    this.busy = true;
    this.ybService.downloadSettlement(this.signInNumber)
      .toPromise().then(response => {
      this.settlement = response;
      this.busy = false;
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });

    this.ybService.downloadSettlementDetail(this.signInNumber)
      .toPromise().then(response => {
      this.settlementDetailList = response;
      this.busy = false;
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });
  }
}

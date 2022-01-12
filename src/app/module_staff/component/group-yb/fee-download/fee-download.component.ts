import { Component, OnInit } from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-fee-download',
  templateUrl: './fee-download.component.html',
  styleUrls: ['./fee-download.component.css']
})
export class FeeDownloadComponent implements OnInit {
  signInNumber: any;
  busy: any;
  feeList: any;

  constructor(
    private ybService: YbTzService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  searchFee() {
    this.busy = true;
    this.ybService.downloadFee(this.signInNumber)
      .toPromise().then(response => {
      this.feeList = response;
      this.busy = false;
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });
  }
}

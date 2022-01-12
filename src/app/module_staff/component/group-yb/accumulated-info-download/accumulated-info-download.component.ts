import { Component, OnInit } from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-accumulated-info-download',
  templateUrl: './accumulated-info-download.component.html',
  styleUrls: ['./accumulated-info-download.component.css']
})
export class AccumulatedInfoDownloadComponent implements OnInit {
  signInNumber: any;
  busy: any;
  infoList:any;

  constructor(
    private ybService: YbTzService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  searchAccumulatedInfo() {
    this.busy = true;
    this.ybService.downloadAccumulatedInfo(this.signInNumber)
      .toPromise().then(response => {
      this.infoList = response;
      this.busy = false;
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });
  }
}

import { Component, OnInit } from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-sign-in-histroy-download',
  templateUrl: './sign-in-histroy-download.component.html',
  styleUrls: ['./sign-in-histroy-download.component.css']
})
export class SignInHistroyDownloadComponent implements OnInit {
  signInNumber: any;
  signInHistoryList: any;
  busy: any = false;
  constructor(
    private ybService: YbTzService,
    private message: NzMessageService,

  ) { }

  ngOnInit() {
  }

  searchHistory() {
    this.busy = true;
    this.ybService.downloadSignInHistory(this.signInNumber)
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

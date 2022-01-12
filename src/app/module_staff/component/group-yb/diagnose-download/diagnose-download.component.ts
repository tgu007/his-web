import { Component, OnInit } from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-diagnose-download',
  templateUrl: './diagnose-download.component.html',
  styleUrls: ['./diagnose-download.component.css']
})
export class DiagnoseDownloadComponent implements OnInit {
  signInNumber: any;
  diagnoseList: any;
  busy: any = false;

  constructor(
    private ybService: YbTzService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {

  }

  searchDiagnose() {
    this.busy = true;
    this.ybService.downloadDiagnose(this.signInNumber)
      .toPromise().then(response => {
      this.diagnoseList = response;
      console.log(this.diagnoseList);
      this.busy = false;
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });
  }
}

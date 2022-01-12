import { Component, OnInit } from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-center-entity-limit-download',
  templateUrl: './center-entity-limit-download.component.html',
  styleUrls: ['./center-entity-limit-download.component.css']
})
export class CenterEntityLimitDownloadComponent implements OnInit {
  pageNumber: any = 1;
  busy: any = false;
  datalist: any = false;

  constructor(
    private ybService: YbTzService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit() {
  }

  search() {
    this.busy = true;
    this.ybService.searchCommon(this.pageNumber, '1318')
      .toPromise().then(response => {
      this.datalist = response;
      this.busy = false;
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });
  }

}

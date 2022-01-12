import {Component, OnInit} from '@angular/core';
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-center-entity-match-download',
  templateUrl: './center-entity-match-download.component.html',
  styleUrls: ['./center-entity-match-download.component.css']
})
export class CenterEntityMatchDownloadComponent implements OnInit {
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
    this.ybService.searchCommon(this.pageNumber, '1316')
      .toPromise().then(response => {
      this.datalist = response;
      this.busy = false;
      console.log(this.datalist);
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });
  }
}

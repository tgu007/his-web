import {Component, OnInit} from '@angular/core';
import {PatientService} from "../../../../service/patient.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {FeeService} from "../../../../service/fee.service";

@Component({
  selector: 'app-department-download',
  templateUrl: './department-download.component.html',
  styleUrls: ['./department-download.component.css']
})
export class DepartmentDownloadComponent implements OnInit {
  departmentList: any;
  busy: any = false;

  constructor(
    private ybService: YbTzService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit() {

  }

  search() {
    this.busy = true;
    this.ybService.downloadDepartment()
      .toPromise().then(response => {
      this.busy = false;
      this.departmentList = response;
    })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.busy = false;
      });

  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-download',
  templateUrl: './employee-download.component.html',
  styleUrls: ['./employee-download.component.css']
})
export class EmployeeDownloadComponent implements OnInit {
  employeeList: any;
  selectEmployeeType: any ='1';

  constructor() { }

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    //Mock
    this.employeeList = [];
    if(this.selectEmployeeType == '1')
      this.employeeList.push(
        {
          psn_cert_type:"身份证",
          certno:"12345",
          prac_psn_code:"123",
          prac_psn_name:"测试医生",
          hi_dr_flag:"1",
          begntime:"2021-01-01"
        }
      );
  }
}

import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AppService} from "./app.service";
import {SessionService} from "./session.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnInit {


  constructor(private appService: AppService, private sessionService: SessionService,
  ) {
  }

  ngOnInit(): void {

  }

  getMessageList() {
    if (!this.sessionService.loginUser)
      return;
    let filter = {
      userRoleType: this.sessionService.loginUser.userRole.userRoleType,
      departmentIdList: this.sessionService.loginUser.departmentIdList,
      warehouseIdList: this.sessionService.loginUser.warehouseIdList,
      employeeId: this.sessionService.loginUser.accountId,
    }
    return this.appService.httpPost(`api/basic/message/list`, filter).toPromise();
  }

  rebuildMessageList() {
    return this.appService.httpPost(`api/basic/message/rebuild`).toPromise();
  }
}

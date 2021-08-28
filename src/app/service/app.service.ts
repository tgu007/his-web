import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd";
import {UserService} from "./user.service";
import {SessionService} from "./session.service";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly baseUrl = environment.serverUrl;

  private veSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public validationErrors: Observable<any> = this.veSubject.asObservable();

  private systemErrorSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public systemErrors: Observable<any> = this.systemErrorSubject.asObservable();

  private systemInfoSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public systemInfo: Observable<any> = this.systemInfoSubject.asObservable();


  constructor(private http: HttpClient, private router: Router, private message: NzMessageService,
              private storageService: SessionService
  ) {
    // private sessionService: SessionService,
  }

  public httpGet(url: string): Observable<any> {

    //return this.http.get(this.baseUrl + '/' + url)
    return this.http.get(this.baseUrl + '/' + url, this.options())
      .pipe(
        catchError(this.handleError())
      );
  }


  public httpPost(url: string, content?: any, serverUrl: any = this.baseUrl,): Observable<any> {
    return this.http.post(serverUrl + '/' + url, content, this.options())

    //return this.http.post(this.baseUrl + '/' + url, content);
  }

  public token(): any {
    return this.storageService.loginUser ? 'Bearer ' + this.storageService.loginUser.account.token : '';
  }

  private options(): Object {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token()
      }),
    };
  }

  private handleError() {

    return (error: any): any => {
      switch (error.status) {
        case 403:
          this.systemErrorSubject.next('没有权限访问！');
          break;
        case 401:
          if (this.storageService.loginUser)
            this.storageService.loginUser.account.token = undefined;
          this.message.error("账号登录时间到期，请重新登录");
          this.router.navigateByUrl('staff/login');
          break;
        case 404:
          this.router.navigateByUrl('staff/page_not_found');
          break;
        case 500:
          this.systemErrorSubject.next('服务器错误！');
          break;
        case 422:
          this.veSubject.next(error.error.errors);
          break;
        case 423:
          this.systemInfoSubject.next(error.error.message);
          break;
        case 428:
        //检查message重设密码
        default:
          this.systemErrorSubject.next('未知错误！');
      }
      return of(null);
    };
  }
}

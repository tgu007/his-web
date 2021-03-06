import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, of} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
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

  public httpGetLocal(url: string): Observable<any> {
    let prams:HttpParams  = new HttpParams();
    prams.append("cardType", "03")

    let  headers:any = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token()
    });
    //return this.http.get(this.baseUrl + '/' + url)
    return this.http.get(url, {headers:headers, params:prams} )
      .pipe(
        catchError(this.handleError())
      );
  }

  // let params = new HttpParams();
  // params = params.append('var1', val1);
  // params = params.append('var2', val2);
  //
  // this.http.get(StaticSettings.BASE_URL, {params: params}).subscribe(...);


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
          this.systemErrorSubject.next('?????????????????????');
          break;
        case 401:
          if (this.storageService.loginUser)
            this.storageService.loginUser.account.token = undefined;
          this.message.error("??????????????????????????????????????????");
          this.router.navigateByUrl('staff/login');
          break;
        case 404:
          this.router.navigateByUrl('staff/page_not_found');
          break;
        case 500:
          this.systemErrorSubject.next('??????????????????');
          break;
        case 422:
          this.veSubject.next(error.error.errors);
          break;
        case 423:
          this.systemInfoSubject.next(error.error.message);
          break;
        case 428:
        //??????message????????????
        default:
          this.systemErrorSubject.next('???????????????');
      }
      return of(null);
    };
  }
}

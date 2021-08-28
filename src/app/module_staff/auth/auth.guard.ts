import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from "../../service/session.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private sessionService: SessionService,) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.sessionService.loginFromSession();
    if (this.sessionService.loginUser)
      return true;
    else {
      this.router.navigate(['staff/login']);
      return false;
    }
  }
}

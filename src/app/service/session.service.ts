import {Injectable} from '@angular/core';

@Injectable()
export class SessionService {
  public loginUser: any = undefined;
  filter: boolean;

  loginFromSession(): void {
    const login: string = localStorage.getItem('loginUser');
    if (login && login !== 'undefined') {
      this.loginUser = JSON.parse(login);
    }
  }

  setLoginUser(loginUser: Object) {
    localStorage.setItem('loginUser', JSON.stringify(loginUser));
    this.loginUser = loginUser;
  }

  removeLoginUser() {
    localStorage.removeItem('loginUser');
    this.loginUser = undefined;
  }

  getUserPermission() {
    return this.loginUser.uiPermission;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { LoginResponse, LoginUser, TokenRequest } from './login';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  COOKIE_TOKEN = 'user_token';
  COOKIE_ID = 'user_id';
  COOKIE_EMAIL = 'user_email';
  COOKIE_NAME = 'user_name';
  COOKIE_PICTURE = 'user_picture';

  baseUrl = 'http://localhost:5000/';
  loginUrl = this.baseUrl + 'auth/';

  private _user: LoginUser | undefined;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  loginToken(token: TokenRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, token);
  }

  getToken() {
    return this.cookieService.get(this.COOKIE_TOKEN);
  }

  getLoggedIn(): LoginUser | undefined {
    this.getValues();
    return this._user;
  }

  getValues() {
      if (this.cookieService.check(this.COOKIE_TOKEN)) {
          this._user = {
              id: this.cookieService.get(this.COOKIE_ID),
              email: this.cookieService.get(this.COOKIE_EMAIL),
              name: this.cookieService.get(this.COOKIE_NAME),
              picture: this.cookieService.get(this.COOKIE_PICTURE),
          }
      } else {
        this.logout();
      }
  }

  logout() {
    this.cookieService.delete(this.COOKIE_TOKEN);
    this.cookieService.delete(this.COOKIE_ID);
    this.cookieService.delete(this.COOKIE_EMAIL);
    this.cookieService.delete(this.COOKIE_NAME);
    this.cookieService.delete(this.COOKIE_PICTURE);
    this._user = undefined;
  }
}

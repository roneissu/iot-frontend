import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { LoginResponse, TokenRequest } from './login';


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

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  loginToken(token: TokenRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, token);
  }

  getToken() {
    return this.cookieService.get(this.COOKIE_TOKEN);
  }
}

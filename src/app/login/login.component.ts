declare var google: any;

import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialResponse } from 'google-one-tap';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastService } from '../toast/toast.service';
import { LoginResponse, TokenRequest } from './login';
import { LoginService } from './login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  subscriptions: Map<string, Subscription>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private ngZone: NgZone,
    private cookieService: CookieService,
    private toastService: ToastService
  ) {
    this.subscriptions = new Map();
  }

  ngAfterViewInit() {

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: CredentialResponse) => {
        this.ngZone.run(() => {
          let token = response.credential;
          console.log(token)
          let tokenRequest: TokenRequest = {
            token: token
          };
          this.subscriptions.set('loginToken',
            this.loginService.loginToken(tokenRequest).subscribe({
              next: (response: LoginResponse) => {
                if (response.email !== undefined) {
                  this.cookieService.set(this.loginService.COOKIE_TOKEN, response.token);
                  this.cookieService.set(this.loginService.COOKIE_ID, response.id.toString());
                  this.cookieService.set(this.loginService.COOKIE_EMAIL, response.email);
                  this.cookieService.set(this.loginService.COOKIE_NAME, response.name);
                  this.cookieService.set(this.loginService.COOKIE_PICTURE, response.picture);
                  this.router.navigateByUrl('/home');
                }
              },
              error: (error: HttpErrorResponse) => {
                this.toastService.showError(`Error ${error.status} (${error.statusText})`);
              }
            })
          )
        })
      }
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
    google.accounts.id.prompt();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}

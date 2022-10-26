declare var google: any;

import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialResponse } from 'google-one-tap';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private cookieService: CookieService
  ) {}

  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: CredentialResponse) => {
        this.ngZone.run(() => {
          this.cookieService.set('Token_OAuth2.0', response.credential);
          this.router.navigateByUrl('/');
        })
      }
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
    google.accounts.id.prompt();
  }
}

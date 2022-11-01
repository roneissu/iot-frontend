import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from './login/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'MediCare IoT';
    opened: boolean = false;
    shouldRun = true;
    destroyed = new Subject<void>();
    currentScreenSize: number | undefined;

    user: {
        id: string,
        email: string,
        name: string,
        picture: string
    } | undefined;

    displayNameMap = new Map([
      [Breakpoints.XSmall, 1],
      [Breakpoints.Small, 2],
      [Breakpoints.Medium, 3],
      [Breakpoints.Large, 4],
      [Breakpoints.XLarge, 5],
    ]);

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loginService: LoginService,
        private breakpointObserver: BreakpointObserver,
        private cookieService: CookieService
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(() => {
            this.getValues();
        });
        this.breakpointObserver
          .observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
          ])
          .pipe(takeUntil(this.destroyed))
          .subscribe(result => {
            for (const query of Object.keys(result.breakpoints)) {
              if (result.breakpoints[query]) {
                this.currentScreenSize = this.displayNameMap.get(query) ?? 0;
              }
            }
          });
    }

    getValues() {
        if (this.cookieService.check(this.loginService.COOKIE_TOKEN)) {
            this.user = {
                id: this.cookieService.get(this.loginService.COOKIE_ID),
                email: this.cookieService.get(this.loginService.COOKIE_EMAIL),
                name: this.cookieService.get(this.loginService.COOKIE_NAME),
                picture: this.cookieService.get(this.loginService.COOKIE_PICTURE),
            }
        }
    }

    openHome() {
        this.router.navigateByUrl('/home');
    }
    
    openUser() {
        this.router.navigateByUrl('/user');
    }

    logout() {
        this.cookieService.delete(this.loginService.COOKIE_TOKEN);
        this.cookieService.delete(this.loginService.COOKIE_ID);
        this.cookieService.delete(this.loginService.COOKIE_EMAIL);
        this.cookieService.delete(this.loginService.COOKIE_NAME);
        this.cookieService.delete(this.loginService.COOKIE_PICTURE);
        this.router.navigateByUrl('/login');
    }
}

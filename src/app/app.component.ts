import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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

    user: {
        id: string,
        email: string,
        name: string,
        picture: string
    } | undefined;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loginService: LoginService,
        private cookieService: CookieService
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(() => {
            this.getValues();
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'MediCare IoT';
    opened: boolean = false;
    shouldRun = true;

    constructor(
        private router: Router,
        private cookieService: CookieService
    ) {}

    changeRun() {
        this.shouldRun = !this.shouldRun;
    }

    logout() {
        this.cookieService.delete('Token_OAuth2.0');
        this.router.navigateByUrl('/login');
    }
}

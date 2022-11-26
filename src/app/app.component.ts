import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoginUser } from './login/login';
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

    displayNameMap = new Map([
        [Breakpoints.XSmall, 1],
        [Breakpoints.Small, 2],
        [Breakpoints.Medium, 3],
        [Breakpoints.Large, 4],
        [Breakpoints.XLarge, 5],
    ]);

    constructor(
        private router: Router,
        private loginService: LoginService,
        private breakpointObserver: BreakpointObserver
    ) { }

    ngOnInit(): void {
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

    getLoggedIn(): LoginUser | undefined {
        return this.loginService.getLoggedIn();
    }

    logout() {
        this.opened = false;
        this.loginService.logout();
        this.router.navigateByUrl('/login');
    }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'MediCare IoT';
    opened: boolean = false;
    shouldRun = true;

    constructor(private router: Router) {}

    changeRun() {
        this.shouldRun = !this.shouldRun;
    }

    openLogin() {
        this.router.navigate(['/login/']);
    }
}

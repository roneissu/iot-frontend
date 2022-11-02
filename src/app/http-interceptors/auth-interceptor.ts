import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';

import { finalize, Observable, tap } from 'rxjs';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private loginService: LoginService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders: {
                'Authorization': `${this.loginService.getToken()}`
            }
        });
        let ok: String;
        return next.handle(req)
            .pipe(
                tap({
                    next: (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
                    error: (error: HttpErrorResponse) => {
                        if (error.status === 401) this.router.navigateByUrl('login');
                    }
                }));
    }
}
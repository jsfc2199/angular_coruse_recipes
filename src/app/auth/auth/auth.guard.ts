import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, tap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean |
        UrlTree |
        Observable<boolean | UrlTree> |
        Promise<boolean | UrlTree> {

        //we want to return the status as we can derevie it from our auth service
        return this.authService.user.pipe(
            take(1),
            map(user => {
                const isAuth = user ? true : false
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']) //we can add an array of the possible urls we want to redirect
            })

            /*tap(isAuth => {
                if (!isAuth) {
                    this.router.navigate(['/auth'])
                }
            })*/
        );
    }
}
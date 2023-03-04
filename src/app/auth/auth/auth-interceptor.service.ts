import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpParams,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { take, exhaustMap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    //this interceptor should add the token to all outgoing requests
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap((user) => {
                if(!user){
                    return next.handle(req) //if there is no user we just let the params as they were
                }

                //we only add a token if we have a user
                const modifiedRequest = req.clone({
                    params: new HttpParams().set("auth", user.token),
                });
                return next.handle(modifiedRequest);
            })
        );
    }
}

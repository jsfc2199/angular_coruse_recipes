import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError, Subject, BehaviorSubject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { User } from "./user.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  //user = new Subject<User>(); //to emit a new user when is logging in or logging out

  //we can get acces to the currently active user even if we only subscribe afther that user has been emitted
  user = new BehaviorSubject<User>(null)

  /*we create this property because if the user logouts manually we need to set this to the initial state*/
  private tokenExpirationTimer: any 

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    //in the api key we need to set firebase api key, we just need to click in the gear icon in project settings
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn //the + is to make it a number
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+environment.firebaseKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn //the + is to make it a number
          );
        })
      );
  }

  logout(){
    this.user.next(null); //we set the user to null, this was the very initial state before authentication
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData');

    //if we have an active session and the user logs out manually we need to clear the timeout
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null
  }

  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autLogOut(expiresIn * 1000)

    //for save the user in a local storage
    localStorage.setItem('userData', JSON.stringify(user)) //we convert the user object as a string in order to the local storage to works
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = "An unknown error ocurred";
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case "EMAIL_NOT_FOUND":
        errorMessage = "This Email is not in our database";
        break;
      case "EMAIL_EXISTS":
        errorMessage = "This Email already exists";
        break;
    }
    return throwError(errorMessage);
  }

  autoLogin(){
    //we need to transform the string that the localstorage has into an object, for this we use JSON.parse
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData) {
      return;
    }

    //if we have a user in the local storage
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token, 
      new Date(userData._tokenExpirationDate))

      //if we still have the expiration date in the future
      if(loadedUser.token){
        //we load the user that we still having
        this.user.next(loadedUser)

        //setting the autoLog to maintain the timer, so we are calculating the remaining time to the token to expire
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
        this.autLogOut(expirationDuration)
      }
  }

  

  autLogOut(expirationDuration: number){ //in miliseconds
    //setting the timer to one hour
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout()
    }, expirationDuration);
  }
}

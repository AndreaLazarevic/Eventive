import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../environments/environment';
import {BehaviorSubject} from "rxjs";
import {User} from "./user.model";
import {map, tap} from "rxjs/operators";


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
}

export interface UserData {
  name?: string;
  surname?: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _isUserAuthenticated = false;
  private _user = new BehaviorSubject<User>(null);
  private _role = "guest";
  //private _role = new BehaviorSubject<string>("guest");

  constructor(private http: HttpClient) { }

  get isUserAuthenticated() {
    return this._user.asObservable().pipe(
        map((user) => {
          if(user){
            return !!user.token;
          } else{
            return false;
          }
        })
    );
  }


  logIn(user: UserData){
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`, {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    }).pipe(tap(userData => {
      const expirationDate = new Date(new Date().getTime() + +userData.expiresIn * 1000);
      const newUser = new User(userData.localId, userData.email, userData.idToken, expirationDate);
      this._user.next(newUser);
    }));
  }

  logOut(){
    this._isUserAuthenticated = false;
    this._user.next(null);
  }

  register(user: UserData){
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    }).pipe(tap(userData => {
      const expirationDate = new Date(new Date().getTime() + +userData.expiresIn * 1000);
      const newUser = new User(userData.localId, userData.email, userData.idToken, expirationDate);
      this._user.next(newUser);
    }));
  }

  get userId(){
    return this._user.asObservable().pipe(
        map((user) => {
          if(user){
            return user.id;
          } else{
            return null;
          }
        })
    );
  }

  set role(value: string){
    this._role = value;
  }

  get role(){
    return this._role;
  }
}

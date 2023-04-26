import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Role } from '../interfaces/role';
import decode from 'jwt-decode';
import { RouteConfigLoadEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkIfLoggedIn());
  currentlyLoggedIn = this.loggedIn.asObservable();

  private userApiUrl =
    'https://be-mortgage-calculator.onrender.com/api/v1/auth';

  private adminApiUrl =
    'https://be-mortgage-calculator.onrender.com/api/v1/auth/admin';

<<<<<<< HEAD
=======
    public loggedIn = false; 
    public userEmail$ = new BehaviorSubject<string>('');

    setUserEmail (email: string ){
      this.userEmail$.next(email);
    }
    getUserEmail(){
      return this.userEmail$.asObservable();
    }

>>>>>>> 9cc9d27 (monthly button bug fixed)
  public getToken(): string {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    //get the token
    const token = this.getToken();
    //return a boolean reflecting whether or not the token is expired
    // return tokenNotExpired(null,token);
    return !!token;
  }

  requestHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private httpClient: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<Role> {
    return this.httpClient
      .post<Role>(
        `${this.userApiUrl}/authenticate`,
        { email, password },
        { headers: this.requestHeader }
      )
      .pipe(
        tap((res: any) => {
          localStorage.setItem('userToken', res.access_token);
          this.changeLoggedIn(this.checkIfLoggedIn());
          console.log(localStorage.getItem('userToken'));
        })
      );
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    return this.httpClient.post(
      `${this.userApiUrl}/register`,
      { firstName, lastName, email, password },
      { headers: this.requestHeader }
    );
  }

  logout(): void {
    localStorage.removeItem('userToken');
    this.changeLoggedIn(this.checkIfLoggedIn());
  }

  changeLoggedIn(isLoggedIn: boolean) {
    this.loggedIn.next(isLoggedIn);
  }

  checkIfLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }
}

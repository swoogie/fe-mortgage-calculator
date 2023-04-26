import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Role } from '../interfaces/role';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkIfLoggedIn());
  private userEmail = new BehaviorSubject<string>('');
  currentUserEmail = this.userEmail.asObservable();
  currentlyLoggedIn = this.loggedIn.asObservable();

  private userApiUrl =
    'https://be-mortgage-calculator.onrender.com/api/v1/auth';

  private adminApiUrl =
    'https://be-mortgage-calculator.onrender.com/api/v1/auth/admin';

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  requestHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private httpClient: HttpClient) {}

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

  setEmail(email) {
    this.userEmail.next(email);
  }

  changeLoggedIn(isLoggedIn: boolean) {
    this.loggedIn.next(isLoggedIn);
  }

  checkIfLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }
}

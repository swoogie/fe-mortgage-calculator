import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Role } from '../interfaces/role';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private adminLoggedIn = new BehaviorSubject<boolean>(
    this.checkIfAdminLoggedIn()
  );
  private userLoggedIn = new BehaviorSubject<boolean>(
    this.checkIfUserLoggedIn()
  );
  private userEmail = new BehaviorSubject<string>('');
  currentUserEmail = this.userEmail.asObservable();
  currentlyAdmin = this.adminLoggedIn.asObservable();
  currentlyUser = this.userLoggedIn.asObservable();

  private userApiUrl = 'https://be-mortgage-calculator.onrender.com/api/v1';

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
    return this.httpClient.post<Role>(
      `${this.userApiUrl}/auth/authenticate`,
      { email, password },
      { headers: this.requestHeader }
    );
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    return this.httpClient.post(
      `${this.userApiUrl}/auth/register`,
      { firstName, lastName, email, password },
      { headers: this.requestHeader }
    );
  }
  userRole;
  getUserRole(email) {
    return this.httpClient.get(
      `${this.userApiUrl}/users/get-role?email=${email}`
    );
  }

  logout(): void {
    if (this.checkIfAdminLoggedIn) {
      localStorage.removeItem('adminToken');
      this.loginState();
    }
    if (this.checkIfUserLoggedIn) {
      localStorage.removeItem('userToken');
      this.loginState();
    }
  }

  setEmail(email) {
    this.userEmail.next(email);
  }

  loginState() {
    this.adminLoggedIn.next(this.checkIfAdminLoggedIn());
    this.userLoggedIn.next(this.checkIfUserLoggedIn());
    console.log('sending admin', this.checkIfAdminLoggedIn());
    console.log('sending user', this.checkIfUserLoggedIn());
  }

  checkIfUserLoggedIn() {
    return !!localStorage.getItem('userToken');
  }

  checkIfAdminLoggedIn() {
    return !!localStorage.getItem('adminToken');
  }
}

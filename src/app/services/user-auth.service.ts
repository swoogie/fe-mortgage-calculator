import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Role} from '../interfaces/role';

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
  // currentUserEmail = this.userEmail.asObservable();
  currentUserEmail = this.userEmail;
  currentlyAdmin = this.adminLoggedIn.asObservable();
  currentlyUser = this.userLoggedIn.asObservable();

  private userApiUrl = 'https://be-mortgage-calculator.onrender.com/api/v1';

  public getAdminToken(): string {
    return localStorage.getItem('adminToken');
  }

  public getToken(): string {
    return localStorage.getItem('userToken');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  requestHeader = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient) {
  }

  login(email: string, password: string): Observable<Role> {
    localStorage.setItem('userEmail', JSON.stringify(email));
    return this.httpClient.post<Role>(
      `${this.userApiUrl}/auth/authenticate`,
      {email, password},
      {headers: this.requestHeader}
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
      {firstName, lastName, email, password},
      {headers: this.requestHeader}
    );
  }

  userRole;

  getUserRole(email) {
    return this.httpClient.get(
      `${this.userApiUrl}/users/get-role?email=${email}`
    );
  }

  logout(): void {
    this.clearPersonalInfo();
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
  }

  checkIfUserLoggedIn() {
    return !!localStorage.getItem('userToken');
  }

  checkIfAdminLoggedIn() {
    return !!localStorage.getItem('adminToken');
  }

  clearPersonalInfo() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('incomeDetails');
    localStorage.removeItem('loanData');
    localStorage.removeItem('coApplicantsData');
    localStorage.removeItem('personalDetailData');
  }
}

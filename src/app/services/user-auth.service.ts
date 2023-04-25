import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Role } from '../interfaces/role';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private userApiUrl = "https://be-mortgage-calculator.onrender.com/api/v1/auth/authenticate";

  private adminApiUrl = "https://be-mortgage-calculator.onrender.com/api/v1/auth/admin"
  

  public getToken(): string{
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean{
    //get the token 
      const token = this.getToken();
      //return a boolean reflecting whether or not the token is expired 
      // return tokenNotExpired(null,token);
      return !!token;
  }
  
  requestHeader = new HttpHeaders(
    { "Content-Type" : "application/json"}
  )
  constructor(private httpClient : HttpClient){
    
  }

  login(email: string, password: string): Observable<Role> {
    return this.httpClient.post<Role>(`${this.userApiUrl}`, { email, password }, { headers:this.requestHeader});
    
  }

  logout(): void {
    localStorage.removeItem('userToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // encoded jwt token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFkbWluIiwiZW1haWwiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiJwYXNzd29yZCJ9.EqvUhXjW5ai-nRb735GKYoH5GndU15OHUSJ7LEpgKb0 
  // {
  //   "token": "admin",
  //   "email": "example@example.com",
  //   "password": "password"
  // }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Role } from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private userApiUrl = "https://be-mortgage-calculator.onrender.com//api/v1/auth/**";
  
  requestHeader = new HttpHeaders(
    { "No-Auth":"True"}
  )
  constructor(private httpClient : HttpClient){
    
  }


  login(email: string, password: string): Observable<Role> {
    return this.httpClient.post<Role>(`${this.userApiUrl}/login`, { email, password }, { headers:this.requestHeader});
  }

  

  logout(): void {
    localStorage.removeItem('userToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

 
}

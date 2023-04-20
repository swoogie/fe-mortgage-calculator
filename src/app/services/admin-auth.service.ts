import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  private adminApiUrl = "http://localhost:4200/api/auth/admin"
  
  constructor(private httpClient : HttpClient){

  }

 login(email: string, password: string): Observable<{token: string}> {
    return this.httpClient.post<{token: string}>(`${this.adminApiUrl}/login`, {email, password})
      .pipe(
        tap(res => {
          localStorage.setItem('adminToken', res.token);
        })
      );
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  logout(){
    localStorage.removeItem('adminToken');
  }

}

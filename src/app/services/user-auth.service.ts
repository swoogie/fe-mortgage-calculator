import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private userApiUrl = "http://localhost:4200/api/auth/user"
  
  constructor(private httpClient : HttpClient){}


  login(email: string, password: string): Observable<{token: string}> {
    return this.httpClient.post<{token: string}>(`${this.userApiUrl}/login`, {email, password})
      .pipe(
        tap(res => {
          localStorage.setItem('userToken', res.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('userToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }
}

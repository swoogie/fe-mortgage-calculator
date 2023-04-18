import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/authenticate';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<{ token: string }> {
    const requestBody = { email: email, password: password };
    return this.http.post<{ token: string }>(this.baseUrl, requestBody);
  }
}

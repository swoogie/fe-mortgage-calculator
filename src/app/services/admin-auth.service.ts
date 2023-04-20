import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {


  private isLoggedIn = false;

  login(email: string, password: string): Observable<boolean> {
    // Your authentication logic here
    if (email === 'admin@example.com' && password === 'password') {
      this.isLoggedIn = true;
      return of(true);
    } else {
      return of(false);
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
 
  logout(){
    return this.isLoggedIn;
  }

}

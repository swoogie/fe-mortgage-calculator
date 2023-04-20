import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private isLoggedIn = false;

  login(email: string, password: string): Observable<boolean> {
    // Your authentication logic here
    if (email === 'user@example.com' && password === 'password') {
      this.isLoggedIn = true;
      return of(true);
    } else {
      return of(false);
    }
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}

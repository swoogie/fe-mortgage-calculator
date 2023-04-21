import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private userAuthService: UserAuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.userAuthService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    } else {
      this.router.navigate(['user-page']);
      return true;
    }
  }
}

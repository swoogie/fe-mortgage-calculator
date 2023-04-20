import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private adminAuthService: AdminAuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.adminAuthService.isLoggedIn()) {
      this.router.navigate(['/admin-page']);
      return false;
    }else {
      this.router.navigate(['login']);
      return true;
    }
  }
  
}

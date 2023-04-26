import { Component, Input, OnInit } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isBurger = false;
  userLoggedIn = false;
  adminLoggedIn = false;
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.userAuthService.currentlyUser.subscribe((res) => {
      if (res) {
        console.log('user' + res);
        this.userLoggedIn = true;
        this.adminLoggedIn = false;
      } else {
        this.userLoggedIn = false;
      }
    });

    this.userAuthService.currentlyAdmin.subscribe((res) => {
      if (res) {
        console.log('admin:' + res);
        this.userLoggedIn = false;
        this.adminLoggedIn = true;
      } else {
        this.adminLoggedIn = false;
      }
    });
  }

  toggleBurger() {
    this.isBurger = !this.isBurger;
  }
  burgerFalse() {
    this.isBurger = false;
  }

  logout() {
    this.userAuthService.logout();
    this.router.navigate(['']);
    this.snackBar.open('Logout successful ✅', 'Dismiss', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}

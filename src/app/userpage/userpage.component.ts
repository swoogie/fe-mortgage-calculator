import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
})
export class UserpageComponent implements OnInit {
  userEmail: string;

  constructor(private user_authService: UserAuthService, private router : Router) {}

  Logout(): void {
    this.user_authService.logout();
    this.router.navigate(["/login"]);
  }

  ngOnInit() {}
}

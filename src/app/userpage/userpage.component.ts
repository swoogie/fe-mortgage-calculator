import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss']
})
export class UserpageComponent implements OnInit{
  userEmail : string; 

  constructor(private user_authService : UserAuthService ){

  }

  Logout(): void {
      this.user_authService.logout();
  }

  ngOnInit(){
    this.user_authService.getUserEmail().subscribe(email => {
      this.userEmail= email; 
    })
  }

}

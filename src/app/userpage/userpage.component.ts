import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { ApplicationData } from '../interfaces/application-data';
import { ApiService } from '../services/api.service';
import { UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
})
export class UserpageComponent implements OnInit {
  applications: ApplicationData[];
  email: string;

  constructor(
    private user_authService: UserAuthService,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    const decodedToken: any = jwtDecode(localStorage.getItem('userToken'));
    const email = decodedToken.sub;
    this.email = email;
  }

  ngOnInit() {
    this.handleApplicationDisplay();
  }

  handleApplicationDisplay() {
    this.apiService.getApplicationForUser(this.email).subscribe((data) => {
      this.applications = data;
      console.log(data);
    });
  }
}

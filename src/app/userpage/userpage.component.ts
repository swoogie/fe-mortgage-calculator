import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.user_authService.currentUserEmail.subscribe((email) => {
      this.email = email;
      console.log(email);
    });
    // this.apiService.listApplications().subscribe((data) => {
    //   this.applications = data;
    // });
  }

  handleApplicationDisplay() {
    const userId: number = +this.route.snapshot.paramMap.get('id');

    this.apiService.getApplicationForUser(userId).subscribe((data) => {
      this.applications = data;
    });
  }
}

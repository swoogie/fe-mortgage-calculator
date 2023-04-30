import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { ApplicationData } from '../interfaces/application-data';
import { ApiService } from '../services/api.service';
import { UserAuthService } from '../services/user-auth.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
})
export class UserpageComponent implements OnInit {
  applications: ApplicationData[];
  email: string;
  applicationStatus: string = '';
  activeStepIndex = ['RECEIVED', 'IN_PROGRESS', 'APPROVED', 'REJECTED'].indexOf(
    this.applicationStatus
  );

  constructor(
    private user_authService: UserAuthService,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef
  ) {
    const decodedToken: any = jwtDecode(localStorage.getItem('userToken'));
    const email = decodedToken.sub;
    this.email = email;
    console.log(this.applicationStatus);
  }

  ngOnInit() {
    this.handleApplicationDisplay();
  }

  handleApplicationDisplay() {
    this.apiService.getApplicationForUser(this.email).subscribe((data) => {
      this.applications = data;
      this.applicationStatus = this.applications[0].applicationStatus;
      this.cdRef.detectChanges();
      console.log(data);
      console.log(this.applicationStatus);
    });
  }
}

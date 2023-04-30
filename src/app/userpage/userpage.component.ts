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
  currentStepIndex = this.activeStepIndex;

  constructor(
    private user_authService: UserAuthService,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef
  ) {
    const decodedToken: any = jwtDecode(localStorage.getItem('userToken'));
    const email = decodedToken.sub;
    this.email = email;
  }

  ngOnInit() {
    this.handleApplicationDisplay();
  }

  getStepIndex(application: ApplicationData): number {
    const index = ['RECEIVED', 'IN_PROGRESS', 'APPROVED', 'REJECTED'].indexOf(
      application.applicationStatus
    );
    return index >= 0 ? index : 0;
  }

  handleApplicationDisplay() {
    this.apiService.getApplicationForUser(this.email).subscribe((data) => {
      this.applications = data;
      this.applicationStatus = this.applications[0].applicationStatus;
      this.currentStepIndex = [
        'RECEIVED',
        'IN_PROGRESS',
        'APPROVED',
        'REJECTED',
      ].indexOf(this.applicationStatus);
      this.cdRef.detectChanges();
      console.log(data);
      console.log(this.applicationStatus);
    });
  }
}

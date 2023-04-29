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
  statusMap = {
    RECEIVED: {
      text: 'Recieved',
      class: 'received',
    },
    IN_PROGRESS: {
      text: 'In Progress',
      class: 'in-progress',
    },
    APPROVED: {
      text: 'Approved',
      class: 'approved',
    },
    REJECTED: {
      text: 'Rejected',
      class: 'rejected',
    },
  };

  constructor(
    private user_authService: UserAuthService,
    private route: ActivatedRoute,
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

  handleApplicationDisplay() {
    this.apiService.getApplicationForUser(this.email).subscribe((data) => {
      this.applications = data;
      this.cdRef.detectChanges();
      console.log(data);
    });
  }
}

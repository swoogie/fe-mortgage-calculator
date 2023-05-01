import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { ApplicationData } from '../interfaces/application-data';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
})
export class UserpageComponent implements OnInit {
  panelOpenState = false;
  applications: ApplicationData[];
  email: string;
  applicationStatus: string = '';
  userName: string = '';

  constructor(
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef
  ) {
    const decodedToken: any = jwtDecode(localStorage.getItem('userToken'));
    const email = decodedToken.sub;
    this.email = email;
  }

  ngOnInit() {
    this.handleApplicationDisplay();
    this.getUserName();
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'RECEIVED':
        return 'blue';
      case 'IN_PROGRESS':
        return 'orange';
      case 'APPROVED':
        return 'green';
      case 'REJECTED':
        return 'red';
      default:
        return 'white';
    }
  }

  getUserName() {
    this.apiService.getPersonalInfo(this.email).subscribe((data) => {
      this.userName = data.firstName;
      this.cdRef.detectChanges();
      console.log(this.userName);
    });
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

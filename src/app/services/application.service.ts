import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private http: HttpClient) {}
  // private adminApiUrl = 'https://be-mortgage-calculator.onrender.com/api/v1';
  private adminApiUrl = 'https://be-mortgage-calculator.onrender.com/api/v1';

  getAllApplications() {
    return this.http.get(`${this.adminApiUrl}/admin/applications`);
  }
}

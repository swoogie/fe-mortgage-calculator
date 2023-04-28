import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  constructor(private http: HttpClient) {}
  private adminApiUrl = 'https://be-mortgage-calculator.onrender.com/api/v1';

  updateConstants(constants) {
    return this.http.put(`${this.adminApiUrl}/admin/constants`, constants, {
      responseType: 'text',
    });
  }
}

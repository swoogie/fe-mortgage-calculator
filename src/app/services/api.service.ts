import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../interfaces/constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://be-mortgage-calculator.onrender.com/api';

  constants: Constants;

  constructor(private http: HttpClient) {}

  getConstants(): Observable<Constants> {
    return this.http.get<Constants>(`${this.apiUrl}/constants`);
  }
}

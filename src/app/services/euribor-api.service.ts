import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EuriborApiService {

  private apiKey: string = "NaFEhJcWHq1Og5hrwGBLPQ==dHKsjAvXQygswVps";
  private apiUrl = 'https://api.api-ninjas.com/v1/interestrate';

  constructor(private http: HttpClient) { }

  getEuribor(name: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });
    const url = this.apiUrl;
    return this.http.get(`${url}?name=${name}`, {headers});
  }
}

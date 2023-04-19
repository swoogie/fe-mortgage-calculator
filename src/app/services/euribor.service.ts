import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Euribor} from "../interfaces/euribor";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EuriborService {

  private apiKey: string = "NaFEhJcWHq1Og5hrwGBLPQ==dHKsjAvXQygswVps";
  private apiUrl = 'https://api.api-ninjas.com/v1/interestrate?name=Euribor';

  constructor(private http: HttpClient) {}

  getEuribor(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

    const url = this.apiUrl;

    return this.http.get(url, { headers });
  }
}

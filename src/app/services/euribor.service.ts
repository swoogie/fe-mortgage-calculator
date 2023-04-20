// import {Injectable} from '@angular/core';
// import {Observable} from "rxjs";
// import {Euribor} from "../interfaces/euribor";
// import {HttpClient, HttpHeaders} from "@angular/common/http";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class EuriborService {
//
//   private euriborData: Euribor[] = [
//     {
//       timeInMonths: 3,
//       interestRate: 3.108,
//     },
//     {
//       timeInMonths: 6,
//       interestRate: 3.356,
//     },
//     {
//       timeInMonths: 12,
//       interestRate: 3.582,
//     },
//   ];
//
//   private apiKey: string = "NaFEhJcWHq1Og5hrwGBLPQ==dHKsjAvXQygswVps";
//   private apiUrl = 'https://api.api-ninjas.com/v1/interestrate';
//
//   constructor(private http: HttpClient) {
//   }
//
//   getEuriborValues() {
//     this.euriborData.forEach(euribor => {
//       const months = euribor.timeInMonths;
//       this.getEuribor(`${months} months`).subscribe(result => {
//         const fallbackRate = euribor.interestRate;
//         const ratePct = result.non_central_bank_rates.find(rate => rate.name === `Euribor - ${months} months`)?.rate_pct;
//         euribor.interestRate = ratePct || fallbackRate;
//         console.log(`${months} months: ${euribor.interestRate}`);
//       });
//     });
//     return this.euriborData;
//   }
//
//   getEuribor(name: string): Observable<any> {
//     const headers = new HttpHeaders({
//       'X-Api-Key': this.apiKey,
//       'Content-Type': 'application/json'
//     });
//     const url = this.apiUrl;
//     return this.http.get(`${url}?name=${name}`, {headers});
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EuriborService {

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

import { Injectable } from '@angular/core';
import { Euribor } from '../interfaces/euribor';
import { EuriborApiService } from './euribor-api.service';

@Injectable({
  providedIn: 'root'
})
export class EuriborValuesService {

  private euriborData: Euribor[] = [
    {
      timeInMonths: 3,
      interestRate: null
    },
    {
      timeInMonths: 6,
      interestRate: null
    },
    {
      timeInMonths: 12,
      interestRate: null
    }
  ];

  constructor(private euriborService: EuriborApiService) { }

  getEuriborValues() {
    this.euriborData.forEach(euribor => {
      const months = euribor.timeInMonths;
      this.euriborService.getEuribor(`${months} months`).subscribe(result => {
        const fallbackRate = euribor.interestRate;
        const ratePct = result.non_central_bank_rates.find(rate => rate.name === `Euribor - ${months} months`)?.rate_pct;
        euribor.interestRate = ratePct || fallbackRate;
        console.log(`${months} months: ${euribor.interestRate}`);
      });
    });
    return this.euriborData;
  }
}

import { Injectable } from '@angular/core';
import { FormGroup, NumberValueAccessor } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class MaxcalculationsService {
  constructor() {}

  maxForm: FormGroup;
  outstandingPrincipal: number;
  loanTermInMonths: number;
  monthlyInterestRate: number;
  linearTotal: number;
  setForm(form: FormGroup) {
    this.maxForm = form;
    this.outstandingPrincipal = this.loanAmount.value;
    this.loanTermInMonths = this.loanTerm.value * 12;
    this.monthlyInterestRate = this.interestRate.value / 100 / 12;
    this.linearTotal = 0;
  }

  calculateLinearTotal(form: FormGroup): number {
    this.setForm(form);
    const principal = this.loanAmount.value / this.loanTermInMonths;
    while (this.outstandingPrincipal > 0) {
      this.linearTotal +=
        principal + this.monthlyInterestRate * this.outstandingPrincipal;
      this.outstandingPrincipal -= principal;
    }
    return parseFloat(this.linearTotal.toFixed(2));
  }

  calculateAnnuityTotal(form: FormGroup): number {
    this.setForm(form);
    const monthlyAnnuity = this.calculateAnnuityMonthly();
    return parseFloat((monthlyAnnuity * this.loanTermInMonths).toFixed(2));
  }

  calculateAnnuityMonthly(): number {
    const monthlyAnnuity =
      (this.loanAmount.value * this.monthlyInterestRate) /
      (1 - Math.pow(1 + this.monthlyInterestRate, -this.loanTermInMonths));
    return monthlyAnnuity;
  }

  get loanAmount() {
    return this.maxForm.get('loanAmount');
  }
  get interestRate() {
    return this.maxForm.get('interestRate');
  }
  get loanTerm() {
    return this.maxForm.get('loanTerm');
  }
}

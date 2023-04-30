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
    return Math.round(this.linearTotal);
  }

  calculateAnnuityTotal(form: FormGroup): number {
    this.setForm(form);
    const monthlyAnnuity = this.calculateAnnuityMonthly();
    return Math.round(monthlyAnnuity * this.loanTermInMonths);
  }

  calculateAnnuityMonthly(): number {
    const monthlyAnnuity =
      (this.loanAmount.value * this.monthlyInterestRate) /
      (1 - Math.pow(1 + this.monthlyInterestRate, -1 * this.loanTermInMonths));
    return monthlyAnnuity;
  }

  getInterest(maxResult: number): number {
    const interestRate = this.interestRate.value;
    return Math.round(maxResult *  (interestRate / 100));
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

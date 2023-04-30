import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PaymentCalculationResult} from "../interfaces/payment-calculation-result";

@Injectable({
  providedIn: 'root',
})
export class MaxcalculationsService {
  constructor() {
  }

  maxForm: FormGroup;
  outstandingPrincipal: number;
  loanTermInMonths: number;
  monthlyInterestRate: number;
  linearTotal: number;
  result: PaymentCalculationResult;

  setForm(form: FormGroup) {
    this.maxForm = form;
    this.outstandingPrincipal = this.loanAmount.value;
    this.loanTermInMonths = this.loanTerm.value * 12;
    this.monthlyInterestRate = this.interestRate.value / 100 / 12;
    this.linearTotal = 0;
  }

  calculateLinearTotal(form: FormGroup): PaymentCalculationResult {
    this.setForm(form);
    const principal = this.loanAmount.value / this.loanTermInMonths;
    let interest = 0;
    let linearTotal = 0
    const firstMonthPayment = principal + this.monthlyInterestRate * this.outstandingPrincipal;
    while (this.outstandingPrincipal > 0) {
      interest = this.monthlyInterestRate * this.outstandingPrincipal;
      const monthlyPayment = principal + interest
      linearTotal += monthlyPayment;
      this.outstandingPrincipal -= principal;
    }
    this.result = {
      totalPayment: Math.round(linearTotal),
      totalInterest: Math.round(linearTotal - this.loanAmount.value),
      totalPrincipal: Math.round(this.loanAmount.value),
      monthlyPayment: Math.round(firstMonthPayment),
    }
    return this.result;
  }

  calculateAnnuityTotal(form: FormGroup): PaymentCalculationResult {
    this.setForm(form);
    const monthlyAnnuity = this.calculateAnnuityMonthly();
    const totalPayment = Math.round(monthlyAnnuity * this.loanTermInMonths);

    this.result = {
      totalPayment: Math.round(monthlyAnnuity * this.loanTermInMonths),
      totalInterest: Math.round(totalPayment - this.loanAmount.value),
      totalPrincipal: Math.round(this.loanAmount.value),
      monthlyPayment: Math.round(monthlyAnnuity),
    }
    return this.result;
  }

  calculateAnnuityMonthly(): number {
    const monthlyAnnuity =
      (this.loanAmount.value * this.monthlyInterestRate) /
      (1 - Math.pow(1 + this.monthlyInterestRate, -1 * this.loanTermInMonths));
    return monthlyAnnuity;
  }

  getInterest(maxResult: number): number {
    const interestRate = this.interestRate.value;
    return Math.round(maxResult * (interestRate / 100));
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

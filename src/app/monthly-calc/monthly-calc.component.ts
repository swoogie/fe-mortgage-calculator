import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-monthly-calc',
  templateUrl: './monthly-calc.component.html',
  styleUrls: ['./monthly-calc.component.scss'],
})
export class MonthlyCalcComponent implements OnInit {
  optionValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  monthlyPaymentResult: number;
  isDisabled: boolean = true;

  monthlyForm = fb.group(
    {
      applicants: ['', Validators.required],
      amountOfKids: ['', Validators.required],
      income: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      obligations: ['', Validators.pattern('[0-9]*')],
      monthlyPayment: [{ value: '', disabled: this.isDisabled }],
    },
    { updateOn: 'change' }
  );

  constructor() {
    this.monthlyForm.valueChanges.subscribe((value) => {
      console.log('form changed', value);
    });
  }

  ngOnInit() {
    this.monthlyForm.get('income').valueChanges.subscribe((res: any) => {
      this.monthlyPayment();
    });
    this.monthlyForm.get('obligations').valueChanges.subscribe((res: any) => {
      this.monthlyPayment();
    });
  }

  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  position = this.positionOptions[2];

  get applicants() {
    return this.monthlyForm.get('applicants');
  }

  get amountOfKids() {
    return this.monthlyForm.get('amountOfKids');
  }

  get income() {
    return this.monthlyForm.get('income');
  }
  get obligations() {
    return this.monthlyForm.get('obligations');
  }

  get interestRate() {
    return this.monthlyForm.get('interestRate');
  }

  monthlyPayment() {
    const income: number = Number(this.monthlyForm.get('income').value);
    const obligations: number = Number(
      this.monthlyForm.get('obligations').value
    );
    this.monthlyPaymentResult = income * 0.4 - obligations;
    console.log(this.monthlyPaymentResult);
  }
}

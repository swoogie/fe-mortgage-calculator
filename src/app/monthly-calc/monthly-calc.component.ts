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
  fields = [
    { label: 'Mortgage Loans', controlName: 'mortgageLoans' },
    { label: 'Consumer Loans', controlName: 'consumerLoans' },
    { label: 'Leasing Amount', controlName: 'leasingAmount' },
    { label: 'Credit Card Limit', controlName: 'creditCardLimit' },
  ];
  monthlyPaymentResult: number;
  isDisabled: boolean = true;

  monthlyForm = fb.group(
    {
      applicants: ['', Validators.required],
      amountOfKids: ['', Validators.required],
      income: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      monthlyPayment: [{ value: '', disabled: this.isDisabled }],
      obligation: [false as boolean, Validators.required],
      mortgageLoans: ['', Validators.pattern('[0-9]*')],
      consumerLoans: ['', Validators.pattern('[0-9]*')],
      leasingAmount: ['', Validators.pattern('[0-9]*')],
      creditCardLimit: ['', Validators.pattern('[0-9]*')],
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
    this.monthlyForm.get('mortgageLoans').valueChanges.subscribe((res: any) => {
      this.monthlyPayment();
    });
    this.monthlyForm.get('consumerLoans').valueChanges.subscribe((res: any) => {
      this.monthlyPayment();
    });
    this.monthlyForm.get('leasingAmount').valueChanges.subscribe((res: any) => {
      this.monthlyPayment();
    });
    this.monthlyForm
      .get('creditCardLimit')
      .valueChanges.subscribe((res: any) => {
        this.monthlyPayment();
      });
    this.monthlyForm.get('obligation').valueChanges.subscribe((value) => {
      if (!value) {
        this.monthlyForm.get('mortgageLoans').reset();
        this.monthlyForm.get('consumerLoans').reset();
        this.monthlyForm.get('leasingAmount').reset();
        this.monthlyForm.get('creditCardLimit').reset();
      }
    });
  }
  onSubmit() {
    if (this.monthlyForm.valid) {
      // submit form data
    } else {
      this.monthlyForm.markAllAsTouched(); // mark all fields as touched to trigger validation messages
    }
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
  get obligation() {
    return this.monthlyForm.get('obligation');
  }
  get mortgageLoans() {
    return this.monthlyForm.get('mortgageLoans');
  }
  get consumerLoans() {
    return this.monthlyForm.get('consumerLoans');
  }
  get leasingAmount() {
    return this.monthlyForm.get('leasingAmount');
  }
  get creditCardLimit() {
    return this.monthlyForm.get('creditCardLimit');
  }

  monthlyPayment() {
    const income = Number(this.monthlyForm.get('income').value);
    const creditCardLimit = Number(
      this.monthlyForm.get('creditCardLimit').value || 0
    );
    const leasingAmount = Number(
      this.monthlyForm.get('leasingAmount').value || 0
    );
    const consumerLoans = Number(
      this.monthlyForm.get('consumerLoans').value || 0
    );
    const mortgageLoans = Number(
      this.monthlyForm.get('mortgageLoans').value || 0
    );
    const monthlyPaymentResult =
      income * 0.4 -
      creditCardLimit -
      consumerLoans -
      mortgageLoans -
      leasingAmount;
    this.monthlyPaymentResult =
      monthlyPaymentResult > 0 ? monthlyPaymentResult : 0;
    console.log(this.monthlyPaymentResult);
  }
}

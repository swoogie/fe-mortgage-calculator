import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-max-calc',
  templateUrl: './max-calc.component.html',
  styleUrls: ['./max-calc.component.scss'],
})
export class MaxCalcComponent {
  maxCalcForm = fb.group(
    {
      realEstatePrice: [, [Validators.required, Validators.pattern('[0-9]*')]],
      downpayment: [, [Validators.required, Validators.pattern('[0-9]*')]],
      loanAmount: [, [Validators.required, Validators.pattern('[0-9]*')]],
      loanTerm: [, [Validators.required, Validators.pattern('[0-9]*')]],
      interestRate: [,],
      paymentScheduleType: [, [Validators.required]],
    },
    { updateOn: 'change' }
  );

  maxLoanTerm: number = 30;
  minLoanTerm: number = 1;
  maxRealEstatePrice: number = 3000000;
  minRealEstatePrice: number = 10000;
  maxLoanAmount: number = this.realEstatePrice.value * 0.85;
  minLoanAmount: number = this.minRealEstatePrice * 0.85;
  paymentSchedules: number[] = [3, 6, 12];

  constructor(private _snackBar: MatSnackBar) {
    this.maxCalcForm.valueChanges.subscribe((value) => {
      console.log('form changed', value);
      this.maxLoanAmount = Math.round(value.realEstatePrice * 0.85);
      if (value.loanAmount == this.maxLoanAmount) {
        this._snackBar.open('Max loan is 85% of real estate price', '', {
          duration: 2000,
        });
      }
      // if (this.maxCalcForm.valid) {
      //   switch (this.paymentScheduleType.value) {
      //     case 3:
      //       this.maxCalcForm.get('interestRate').setValue(2.5 + 3.108);
      //     case 6:
      //       this.maxCalcForm.get('interestRate').setValue(2.5 + 3.356);
      //     case 12:
      //       this.maxCalcForm.get('interestRate').setValue(2.5 + 3.582);
      //   }
      // }
    });
  }

  ngOnInit() {}
  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  position = this.positionOptions[2];

  updateSlider() {
    console.log('blurred');
  }

  get realEstatePrice() {
    return this.maxCalcForm.get('realEstatePrice');
  }

  get downpayment() {
    return this.maxCalcForm.get('downpayment');
  }

  get loanAmount() {
    return this.maxCalcForm.get('loanAmount');
  }
  get loanTerm() {
    return this.maxCalcForm.get('loanTerm');
  }

  get interestRate() {
    return this.maxCalcForm.get('interestRate');
  }

  // set interestRate(value: number) {
  //   this.maxCalcForm.get('interestRate').setValue(number);
  // }

  get paymentScheduleType() {
    return this.maxCalcForm.get('paymentScheduleType');
  }
}

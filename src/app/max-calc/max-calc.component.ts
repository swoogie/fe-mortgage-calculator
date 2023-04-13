import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';

const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-max-calc',
  templateUrl: './max-calc.component.html',
  styleUrls: ['./max-calc.component.scss'],
})
export class MaxCalcComponent {
  maxRealEstatePrice: number = 3000000;
  minRealEstatePrice: number = 10000;

  maxCalcForm = fb.group(
    {
      realEstatePrice: [
        this.minRealEstatePrice,
        [Validators.required, Validators.pattern('[0-9]*')],
      ],
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

  maxLoanAmount: number = this.realEstatePrice.value * 0.85;
  minLoanAmount: number = 0;
  paymentSchedules: number[] = [3, 6, 12];

  constructor(private _snackBar: MatSnackBar) {
    this.maxCalcForm.valueChanges.pipe(debounceTime(50)).subscribe((value) => {
      // console.log(value.realEstatePrice);
      // console.log('form changed', value);
      this.maxLoanAmount = Math.round(value.realEstatePrice * 0.85);
    });

    this.loanAmount.valueChanges.subscribe((value) => {
      if (value == this.maxLoanAmount) {
        this._snackBar.open('Max loan is 85% of real estate price', '', {
          duration: 2000,
        });
      }
    });

    this.paymentScheduleType.valueChanges.subscribe((value) => {
      console.log('bonjourno', value);
      switch (value) {
        case 3:
          this.maxCalcForm
            .get('interestRate')
            .setValue((2.5 + 3.108).toFixed(3));
          break;
        case 6:
          this.maxCalcForm
            .get('interestRate')
            .setValue((2.5 + 3.356).toFixed(3));
          break;
        case 12:
          this.maxCalcForm
            .get('interestRate')
            .setValue((2.5 + 3.582).toFixed(3));
          break;
        default:
      }

      console.log('after value', this.maxCalcForm.value);
    });

    this.realEstatePrice.valueChanges
      .pipe(debounceTime(50))
      .subscribe((value) => {
        this.maxLoanAmount = value * 0.85;
        if (this.loanAmount.value > this.maxLoanAmount) {
          this.loanAmount.setValue(this.maxLoanAmount as never, {});
        }
      });

    this.interestRate.disable();
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
  realEst: number;

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

  get paymentScheduleType() {
    return this.maxCalcForm.get('paymentScheduleType');
  }
}

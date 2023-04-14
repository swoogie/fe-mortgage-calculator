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
  minLoanAmount: number = 0;
  minLoanTerm: number = 1;
  maxLoanTerm: number = 30;

  maxCalcForm = fb.group(
    {
      realEstatePrice: [
        this.minRealEstatePrice as number,
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.max(this.maxRealEstatePrice),
          Validators.min(this.minRealEstatePrice),
        ],
      ],
      downpayment: [
        null as number,
        [Validators.required, Validators.pattern('[0-9]*')],
      ],
      loanAmount: [
        0 as number,
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.min(this.minLoanAmount),
        ],
      ],
      loanTerm: [
        this.minLoanTerm,
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.min(this.minLoanTerm),
          Validators.max(this.maxLoanTerm),
        ],
      ],
      interestRate: [,],
      paymentScheduleType: [, [Validators.required]],
    },
    { updateOn: 'change' }
  );

  paymentSchedules: number[] = [3, 6, 12];
  maxLoanAmount: number = this.realEstatePrice.value * 0.85;
  constructor(private _snackBar: MatSnackBar) {
    this.loanAmount.addValidators(Validators.max(this.maxLoanAmount));
    this.maxCalcForm.valueChanges.pipe(debounceTime(50)).subscribe((value) => {
      this.maxLoanAmount = Math.round(value.realEstatePrice * 0.85);
      this.loanAmount.setValidators(Validators.max(this.maxLoanAmount));
    });

    this.loanAmount.valueChanges.pipe(debounceTime(1)).subscribe((value) => {
      if (this.realEstatePrice.value && value >= this.maxLoanAmount) {
        this._snackBar.open('Max loan is 85% of real estate price', '', {
          duration: 2000,
        });
      }
      if (this.realEstatePrice.value && value > this.maxLoanAmount) {
        this.loanAmount.setValue(this.maxLoanAmount);
      }
      if (
        this.loanAmount.value &&
        this.loanAmount.valid &&
        value <= this.maxLoanAmount
      ) {
        this.downpayment.setValue(this.realEstatePrice.value - value);
      }
      if (!this.loanAmount.value) {
        this.downpayment.setValue(null);
      }
    });

    this.loanTerm.valueChanges.subscribe((value: number) => {
      if (value >= this.maxLoanTerm) {
        this._snackBar.open(`Max loan term is ${this.maxLoanTerm} years`, '', {
          duration: 2000,
        });
      }
      if (value > this.maxLoanTerm) {
        this.loanTerm.setValue(this.maxLoanTerm);
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
    this.downpayment.disable();
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

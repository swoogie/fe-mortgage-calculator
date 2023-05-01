import { Component, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { Euribor } from '../interfaces/euribor';
import { ApiService } from '../services/api.service';
import { Constants } from '../interfaces/constants';
import { MaxcalculationsService } from '../services/maxcalculations.service';
import { ApplicationDialogComponent } from '../application-dialog/application-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EuriborValuesService } from '../services/euribor-values-service.service';
import { EuriborApiService } from '../services/euribor-api.service';
import { PaymentCalculationResult } from '../interfaces/payment-calculation-result';

const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-max-calc',
  templateUrl: './max-calc.component.html',
  styleUrls: ['./max-calc.component.scss'],
})
export class MaxCalcComponent {
  maxRealEstatePrice: number = 3200000;
  minRealEstatePrice: number = 10000;
  minLoanAmount: number = 1000;
  minLoanTerm: number = null;
  maxLoanTerm: number = null;
  baseInterest: number = 2.5; // fallback values
  loanAmountPercentage: number = 0.85; // fallback values
  constants: Constants;
  euriborValues: Euribor[] = this.euriborValuesService.getEuriborValues();
  paymentScheduleTypes: string[] = ['annuity', 'linear'];
  chartData: number[] = [];

  fields = [
    { label: 'Principal', controlName: 'mortgageLoans' },
    { label: 'Interest', controlName: 'consumerLoans' },
  ];
  chartFields = [
    { label: 'Principal', controlName: 'mortgageLoans' },
    { label: 'Interest', controlName: 'consumerLoans' },
  ];
  chartLabels: string[] = this.chartFields.map((field) => field.label);

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
        this.minLoanAmount,
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
      interestRate: [
        parseFloat(
          (this.euriborValues[0].interestRate + this.baseInterest).toFixed(3)
        ) as number,
      ],
      paymentScheduleType: [
        this.paymentScheduleTypes[0] as string,
        [Validators.required],
      ],
      euribor: [this.euriborValues[0] as Euribor, [Validators.required]],
    },
    { updateOn: 'change' }
  );

  maxLoanAmount: number =
    this.realEstatePrice.value * this.loanAmountPercentage;

  constructor(
    private _snackBar: MatSnackBar,
    private api: ApiService,
    private euriborValuesService: EuriborValuesService,
    private calcService: MaxcalculationsService,
    public dialog: MatDialog,
    private euriborApi: EuriborApiService
  ) {
    this.loanAmount.addValidators(Validators.max(this.maxLoanAmount));
    this.realEstatePrice.valueChanges
      .pipe(debounceTime(10))
      .subscribe((value) => {
        this.maxLoanAmount = Math.round(value * this.loanAmountPercentage);
        this.loanAmount.setValidators(Validators.max(this.maxLoanAmount));
        if (value > this.maxRealEstatePrice) {
          this.realEstatePrice.setValue(this.maxRealEstatePrice);
          this._snackBar.open(
            `Max real estate price is ${this.maxRealEstatePrice} €`,
            '',
            {
              duration: 2000,
            }
          );
        }
      });

    this.loanAmount.valueChanges.pipe(debounceTime(10)).subscribe((value) => {
      if (this.realEstatePrice.value && value >= this.maxLoanAmount) {
        const percentage = this.loanAmountPercentage * 100;
        this._snackBar.open(
          `Max loan is ${percentage}% of real estate price`,
          '',
          {
            duration: 2000,
          }
        );
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

    this.euribor.valueChanges.subscribe((value) => {
      console.log(value);
      this.interestRate.setValue(
        parseFloat((value.interestRate + this.baseInterest).toFixed(3))
      );
    });

    this.realEstatePrice.valueChanges
      .pipe(debounceTime(50))
      .subscribe((value) => {
        this.maxLoanAmount = value * this.loanAmountPercentage;
        if (this.loanAmount.value > this.maxLoanAmount) {
          this.loanAmount.setValue(this.maxLoanAmount as never, {});
        }
      });
  }

  ngOnInit() {
    this.onWindowResize(null);
    this.api.getConstants().subscribe((constants) => {
      this.constants = constants;
      // console.log(constants.interestRateMargin);
      this.minLoanTerm = constants.minLoanTerm;
      this.maxLoanTerm = constants.maxLoanTerm;
      this.loanAmountPercentage = constants.loanAmountPercentage;
      this.maxLoanAmount =
        this.realEstatePrice.value * this.loanAmountPercentage;
      this.baseInterest = constants.interestRateMargin * 100;
      this.loanTerm.setValue(this.minLoanTerm);
      this.loanTerm.addValidators(Validators.min(this.minLoanTerm));
    });
  }

  linearTotal: number;
  annuityTotal: number;
  interestFromTotal: number;
  principalFromTotal: number;
  monthlyPayment: number;

  calculateMax() {
    if (this.loanAmount.value == 0) {
      this._snackBar.open(`Loan amount can't be 0 🥲`, '', {
        duration: 2000,
      });
    }

    this.linearTotal = null;
    this.annuityTotal = null;
    this.interestFromTotal = 0;
    this.principalFromTotal = 0;
    const eubieTheEuriborMonth = this.euribor.value.timeInMonths;
    this.euriborApi
      .getEuribor(`${eubieTheEuriborMonth} months`)
      .subscribe((result) => {
        const ratePct = result.non_central_bank_rates.find(
          (rate) => rate.name === `Euribor - ${eubieTheEuriborMonth} months`
        )?.rate_pct;
        this.interestRate.setValue(this.baseInterest + ratePct);
        if (this.maxCalcForm && this.paymentScheduleType.value == 'linear') {
          const result = this.calcService.calculateLinearTotal(
            this.maxCalcForm
          );
          this.linearTotal = result.totalPayment;
          this.interestFromTotal = result.totalInterest;
          this.principalFromTotal = result.totalPrincipal;
          this.monthlyPayment = result.monthlyPayment;
          this.chartData = [this.principalFromTotal, this.interestFromTotal];
        }
        if (this.maxCalcForm && this.paymentScheduleType.value == 'annuity') {
          const result = this.calcService.calculateAnnuityTotal(
            this.maxCalcForm
          );
          this.annuityTotal = result.totalPayment;
          this.interestFromTotal = result.totalInterest;
          this.principalFromTotal = result.totalPrincipal;
          this.monthlyPayment = result.monthlyPayment;
        }
        this.chartData = [this.principalFromTotal, this.interestFromTotal];
      });
  }

  private getInterest(result) {
    return this.calcService.getInterest(result);
  }

  overwriteIfLess() {
    if (this.realEstatePrice.value < this.minRealEstatePrice) {
      this.realEstatePrice.setValue(this.minRealEstatePrice);
      this._snackBar.open(
        `Min real estate price is ${this.minRealEstatePrice} €`,
        '',
        {
          duration: 2000,
        }
      );
    }

    if (this.loanAmount.value < this.minLoanAmount) {
      this.loanAmount.setValue(this.minLoanAmount);
      this._snackBar.open(
        `Loan amount must be more than ${this.minLoanAmount} €`,
        '',
        {
          duration: 2000,
        }
      );
    }

    if (this.loanTerm.value < this.minLoanTerm) {
      this.loanTerm.setValue(this.minLoanTerm);
      this._snackBar.open(
        `Loan term must be more than ${this.minLoanTerm} year(s)`,
        '',
        {
          duration: 2000,
        }
      );
    }
  }

  get euribor() {
    return this.maxCalcForm.get('euribor');
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

  get paymentScheduleType() {
    return this.maxCalcForm.get('paymentScheduleType');
  }

  openDialog(): void {
    this.dialog.open(ApplicationDialogComponent, {
      data: {
        loanTerm: this.loanTerm.value,
        loanAmount: this.loanAmount.value,
        downPayment: this.downpayment.value,
        realEstatePrice: this.realEstatePrice.value,
        euribor: this.euribor.value,
        paymentScheduleType: this.paymentScheduleType.value,
      },
      minWidth: '400px',
    });
  }

  helloSlider: boolean = true;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    if (window.innerWidth <= 900) {
      this.helloSlider = false;
    } else {
      this.helloSlider = true;
    }
  }

  clickMe(event: Event) {
    this._snackBar.open('Annuity - identical monthly installments', null, {
      duration: 7000,
    });
    event.stopPropagation();
  }

  clickMe2(event: Event) {
    this._snackBar.open(
      'Linear - identical monthly principle, interest is calculated on outstanding principle',
      null,
      {
        duration: 7000,
      }
    );
    event.stopPropagation();
  }

  unclickMe(event: Event) {
    this._snackBar.dismiss();
    event.stopPropagation();
  }
}

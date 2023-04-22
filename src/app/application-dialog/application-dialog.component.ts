import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Constants} from "../interfaces/constants";
import {ApplicationData} from "../interfaces/application-data";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Euribor} from "../interfaces/euribor";
import {EuriborValuesService} from "../services/euribor-values-service.service";
import {debounceTime} from "rxjs";
import {StepperSelectionEvent} from "@angular/cdk/stepper";

const formBuilder = new FormBuilder().nonNullable;

@Component({
  selector: 'app-application-dialog',
  templateUrl: './application-dialog.component.html',
  styleUrls: ['./application-dialog.component.scss']
})
export class ApplicationDialogComponent implements OnInit {
  maxRealEstatePrice: number = 3200000;
  minRealEstatePrice: number = 10000;
  minLoanAmount: number = 0;
  constants: Constants;
  minLoanTerm!: number;
  maxLoanTerm!: number;
  loanAmountPercentage: number;
  minKids: number;
  maxKids: number;
  maxNumOfApplicants: number;
  children: number[] = [];
  applicantsOptions: number[] = [];
  maxMonthlyObligationsPercentage: number;
  euriborValues: Euribor[];
  maxLoanAmount: number = 2720000;
  minDownPaymentAmount: number = 1500;

  paymentScheduleTypes: string[] = ['annuity', 'linear'];
  obligationFields = [
    {label: 'Mortgage Loans', controlName: 'mortgageLoans'},
    {label: 'Consumer Loans', controlName: 'consumerLoans'},
    {label: 'Leasing Amount', controlName: 'leasingAmount'},
    {label: 'Credit Card Limit', controlName: 'creditCardLimit'},
  ];
  isLinear = true;
  attemptedToProceed = false;
  loanDetailsForm = formBuilder.group({
      realEstatePrice: [this.applicationData.realEstatePrice, [
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),
        Validators.max(this.maxRealEstatePrice),
        Validators.min(this.minRealEstatePrice),
      ],
      ],
      downPayment: [this.applicationData.downPayment,
        [
          Validators.required,
          Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),
        ],
      ],
      loanAmount: [this.applicationData.loanAmount,
        [
          Validators.required,
          Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),
          Validators.min(this.minLoanAmount),
        ],
      ],
      loanTerm: [this.applicationData.loanTerm,
        [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.min(this.minLoanTerm),
          Validators.max(this.maxLoanTerm),
        ],
      ],
      euribor: [this.applicationData.euribor, [Validators.required]],
      paymentScheduleType: [this.applicationData.paymentScheduleType as string, [Validators.required]],
    },
    {updateOn: 'change'}
  );
  incomeDetailsForm = formBuilder.group({
    applicants: [this.applicationData.applicants, Validators.required],
    amountOfKids: [this.applicationData.amountOfKids, Validators.required],
    income: [this.applicationData.income,
      [
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
      ],
    ],
    coApplicantsIncome: [null as number],
    obligations: [this.applicationData.obligations, Validators.required],
    mortgageLoans: [this.applicationData.mortgageLoans,
      Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
    ],
    consumerLoans: [this.applicationData.consumerLoans,
      Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
    ],
    leasingAmount: [this.applicationData.leasingAmount,
      Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
    creditCardLimit: [this.applicationData.creditCardLimit,
      Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
    monthlyPayment: [this.applicationData.monthlyPayment,
      Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
  });
  personalDetailsForm = formBuilder.group({
    firstName: [this.applicationData.firstName, Validators.required],
    lastName: [this.applicationData.lastName, Validators.required],
    personalNumber: [this.applicationData.personalNumber, Validators.required],
    email: [this.applicationData.email,
      [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
    ],
    phoneNumber: [this.applicationData.phoneNumber,
      [
        Validators.required,
        Validators.pattern(/^(\+370|8)(5|6)\d{7}$/)],
    ],
    address: [this.applicationData.address, Validators.required]
  });

  constructor(private euriborValuesService: EuriborValuesService,
              private apiService: ApiService,
              public dialogRef: MatDialogRef<ApplicationDialogComponent>,
              @Inject(MAT_DIALOG_DATA)
              public applicationData: ApplicationData,
              private _snackBar: MatSnackBar,
  ) {
    this.realEstatePrice.valueChanges
      .pipe(debounceTime(10))
      .subscribe((value) => {
        this.updateMaxLoanAmount();
        this.updateMinDownPayment();
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
        // this._snackBar.open('Max loan is 85% of real estate price', '', {
        //   duration: 2000,
        // });
      }
      if (this.realEstatePrice.value && value > this.maxLoanAmount) {
        // this.loanAmount.setValue(this.maxLoanAmount);
      }
      if (
        this.loanAmount.value &&
        this.loanAmount.valid &&
        value <= this.maxLoanAmount
      ) {
        // this.downPayment.setValue(this.realEstatePrice.value - value);
      }
      if (!this.loanAmount.value) {
        // this.downPayment.setValue(null);
      }
    });

    this.loanTerm.valueChanges.subscribe((value: number) => {
      if (value >= this.maxLoanTerm) {
        // this._snackBar.open(`Max loan term is ${this.maxLoanTerm} years`, '', {
        //   duration: 2000,
        // });
      }
      if (value > this.maxLoanTerm) {
        // this.loanTerm.setValue(this.maxLoanTerm);
      }
    });


    this.applicants.valueChanges.subscribe((value: number) => {
      if (value > 1) {
        this.coApplicantsIncome.setValidators([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]);
      }
    });

    this.realEstatePrice.valueChanges
      .pipe(debounceTime(50))
      .subscribe((value) => {
        this.maxLoanAmount = value * this.loanAmountPercentage;
        if (this.loanAmount.value > this.maxLoanAmount) {
          // this.loanAmount.setValue(this.maxLoanAmount as never, {});
        }
      });
  }

  ngOnInit() {
    this.euriborValues = this.euriborValuesService.getEuriborValues();
    this.getConstants();
  }

  private getConstants() {
    this.apiService.getConstants().subscribe((constants) => {
      this.constants = constants;
      this.minLoanTerm = constants.minLoanTerm;
      this.maxLoanTerm = constants.maxLoanTerm;
      this.loanAmountPercentage = constants.loanAmountPercentage;
      this.minKids = constants.minKids;
      this.maxKids = constants.maxKids;
      this.maxMonthlyObligationsPercentage = constants.maxMonthlyObligationsPercentage;
      this.maxNumOfApplicants = constants.maxNumOfApplicants;
      for (let i = this.minKids; i <= this.maxKids; i++) {
        this.children.push(i);
      }
      for (let i = 1; i <= this.maxNumOfApplicants; i++) {
        this.applicantsOptions.push(i);
      }
      this.updateMaxLoanAmount();
      this.updateMinDownPayment();
    });
  }


  updateMinDownPayment() {
    this.minDownPaymentAmount = Math.round(this.realEstatePrice.value * (1 - this.loanAmountPercentage));
    this.downPayment.addValidators(Validators.min(this.minDownPaymentAmount));
  }

  updateMaxLoanAmount() {
    this.maxLoanAmount = Math.round(this.realEstatePrice.value * this.loanAmountPercentage);
    this.loanAmount.addValidators(Validators.max(this.maxLoanAmount));
  }

  get realEstatePrice() {
    return this.loanDetailsForm.get('realEstatePrice');
  }

  get downPayment() {
    return this.loanDetailsForm.get('downPayment');
  }

  get loanAmount() {
    return this.loanDetailsForm.get('loanAmount');
  }

  get loanTerm() {
    return this.loanDetailsForm.get('loanTerm');
  }

  get income() {
    return this.incomeDetailsForm.get('income');
  }

  get obligations() {
    return this.incomeDetailsForm.get('obligations');
  }

  get applicants() {
    return this.incomeDetailsForm.get('applicants');
  }

  get coApplicantsIncome() {
    return this.incomeDetailsForm.get('coApplicantsIncome');
  }

  onSubmitApplyClick(): void {
    //form validation and post to backend
    this.saveLoanDetails();
    console.log(this.applicationData)
    this.apiService.postApplication(this.applicationData).subscribe({
      next: (success) => {
        console.log(success);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  saveLoanDetails(): void {
    const loanDataKeys: string[] = ["realEstatePrice", "downPayment", "loanAmount", "loanTerm",
      "paymentScheduleType", "euribor"];
    const incomeDataKeys: string[] = ["applicants", "amountOfKids", "income", "coApplicantsIncome", "obligations", "mortgageLoans", "consumerLoans",
      "leasingAmount", "creditCardLimit", "monthlyPayment"];
    const personalDataKeys: string[] = ["firstName", "lastName", "personalNumber",
      "email", "phoneNumber", "address"];
    loanDataKeys.forEach((key) => {
      this.applicationData[key] = this.loanDetailsForm.value[key]
    });
    incomeDataKeys.forEach((key) => {
      this.applicationData[key] = this.incomeDetailsForm.value[key]
    });
    personalDataKeys.forEach((key) => {
      this.applicationData[key] = this.personalDetailsForm.value[key]
    });
  }

  selectedIndex: number = 0;

  setIndex(event: StepperSelectionEvent) {
    this.attemptedToProceed = false;
    this.selectedIndex = event.selectedIndex;
  }

  triggerClick(event) {
    this.attemptedToProceed = true;
    console.log(`Selected tab index: ${this.selectedIndex}`);
  }
}

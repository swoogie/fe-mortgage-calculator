import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Constants} from "../interfaces/constants";
import {ApplicationData} from "../interfaces/application-data";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Euribor} from "../interfaces/euribor";
import {EuriborValuesService} from "../services/euribor-values-service.service";
import {combineLatest, debounceTime} from "rxjs";
import {StepperSelectionEvent} from "@angular/cdk/stepper";

const formBuilder = new FormBuilder().nonNullable;

@Component({
  selector: 'app-application-dialog',
  templateUrl: './application-dialog.component.html',
  styleUrls: ['./application-dialog.component.scss']
})
export class ApplicationDialogComponent implements OnInit {
  constants: Constants;
  maxRealEstatePrice: number = 3200000;
  minRealEstatePrice: number = 10000;
  minLoanAmount: number = 1000;
  minLoanTerm: number;
  maxLoanTerm: number;
  loanAmountPercentage: number;
  minKids: number;
  maxKids: number;
  maxNumOfApplicants: number;
  children: number[] = [];
  applicantsOptions: number[] = [];
  loanAmount: number;
  maxMonthlyObligationsPercentage: number;
  euriborValues: Euribor[];
  maxLoanAmount: number = 2720000;
  interestRateMargin: number;
  minDownPaymentAmount: number = 1500;
  maxDownPaymentAmount: number = 3199000;
  monthlyPayment: number = 0;
  totalHouseHoldIncome: number = 0;
  isSufficientMonthlyPayment: boolean = true;
  totalMonthlyObligations: number = 0;
  availableMonthlyPayment: number = null;
  paymentScheduleTypes: string[] = ['annuity', 'linear'];
  obligationFields = [
    {label: 'Mortgage Loans', controlName: 'mortgageLoans'},
    {label: 'Consumer Loans', controlName: 'consumerLoans'},
    {label: 'Leasing Amount', controlName: 'leasingAmount'},
    {label: 'Credit Card Limit', controlName: 'creditCardLimit'},
  ];
  isLinear = true;
  attemptedToProceed = false;

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
    mortgageLoans: [this.applicationData.mortgageLoans],
    consumerLoans: [this.applicationData.consumerLoans],
    leasingAmount: [this.applicationData.leasingAmount],
    creditCardLimit: [this.applicationData.creditCardLimit],
    canProceed: [true, Validators.requiredTrue]
  });
  loanDetailsForm = formBuilder.group({
      realEstateAddress: [this.applicationData.realEstateAddress, Validators.required],
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
      loanTerm: [this.applicationData.loanTerm,
        [
          Validators.required,
          Validators.pattern('[0-9]*')
        ],
      ],
      euribor: [this.applicationData.euribor, [Validators.required]],
      paymentScheduleType: [this.applicationData.paymentScheduleType as string, [Validators.required]],
      canProceed: [true, Validators.requiredTrue]
    },
    {updateOn: 'blur'}
  );
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
              @Inject(MAT_DIALOG_DATA)
              public applicationData: ApplicationData,
              private _snackBar: MatSnackBar,
  ) {
    this.applicants.valueChanges.subscribe((value: number) => {
      this.updateCoApplicantsIncomeValidations(value);
    });

    this.income.valueChanges.subscribe((value: number) => {
      this.updateAvailableMonthlyPayment();
    });

    combineLatest([this.income.valueChanges, this.coApplicantsIncome.valueChanges]).subscribe(([income, coApplicantsIncome]) => {
      this.updateTotalHouseHoldIncome(income, coApplicantsIncome);
      this.updateAvailableMonthlyPayment();
    });

    this.obligations.valueChanges.subscribe((value: boolean) => {
      this.updateObligationsValidations(value);
    });

    combineLatest([this.mortgageLoans.valueChanges, this.consumerLoans.valueChanges, this.leasingAmount.valueChanges, this.creditCardLimit.valueChanges]).subscribe(([mortgageLoans, consumerLoans, leasingAmount, creditCardLimit]) => {
      this.updateMonthlyObligations(mortgageLoans, consumerLoans, leasingAmount, creditCardLimit);
    });

    this.realEstatePrice.valueChanges
      .pipe(debounceTime(50))
      .subscribe((realEstatePriceValue) => {
        this.updateRealEstatePriceValue(realEstatePriceValue);
        this.updateDownPayment();
        this.updateLoanAmount();
      });

    this.downPayment.valueChanges.subscribe((downPaymentValue) => {
      this.updateDownPayment();
    });

    this.loanTerm.valueChanges.subscribe((loanTermValue) => {
      this.updateLoanTerm(loanTermValue);
    });

    combineLatest([this.realEstatePrice.valueChanges, this.downPayment.valueChanges]).subscribe(([realEstatePrice, downPayment]) => {
      this.updateLoanAmount();
    });

    this.loanDetailsForm.valueChanges.subscribe((value) => {
      this.updateSufficientMonthlyPayment();
    });
  }

  private updateRealEstatePriceValue(realEstatePriceValue: number) {
    if (realEstatePriceValue > this.maxRealEstatePrice) {
      this.realEstatePrice.setValue(this.maxRealEstatePrice);
      this._snackBar.open(
        `Max real estate price is ${this.maxRealEstatePrice} €`,
        '',
        {duration: 2000}
      );
    } else if (realEstatePriceValue < this.minRealEstatePrice) {
      this.realEstatePrice.setValue(this.minRealEstatePrice);
      this._snackBar.open(
        `Min real estate price is ${this.minRealEstatePrice} €`,
        '',
        {duration: 2000}
      );
    }
  }

  private updateObligationsValidations(obligationsValue: boolean) {
    if (obligationsValue === true) {
      this.obligationFields.forEach((field) => {
        this.incomeDetailsForm.get(field.controlName).setValidators([Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]);
        this.incomeDetailsForm.get(field.controlName).setValue(0);
      });
    } else if (obligationsValue === false) {
      this.updateAvailableMonthlyPayment();
      this.obligationFields.forEach((field) => {
        this.incomeDetailsForm.get(field.controlName).clearValidators();
        this.incomeDetailsForm.get(field.controlName).setValue(null);
      });
    }
  }

  private updateCoApplicantsIncomeValidations(value: number) {
    if (value > 1) {
      this.coApplicantsIncome.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]);
    } else if (value === 1) {
      this.coApplicantsIncome.clearValidators();
      this.coApplicantsIncome.setValue(null);
    }
  }

  updateLoanTerm(loanTermValue: number) {
    const minLoanTerm = this.minLoanTerm;
    const maxLoanTerm = this.maxLoanTerm;
    if (loanTermValue < minLoanTerm) {
      this.loanTerm.setValue(minLoanTerm);
      this._snackBar.open(
        `Min loan term is ${minLoanTerm} ${minLoanTerm % 10 == 1 ? "year" : "years"}`,
        '',
        {duration: 2000}
      );
    } else if (loanTermValue > maxLoanTerm) {
      this.loanTerm.setValue(maxLoanTerm);
      this._snackBar.open(
        `Max loan term is ${maxLoanTerm} ${maxLoanTerm % 10 == 1 ? "year" : "years"}`,
        '',
        {duration: 2000}
      );
    }
  }

  ngOnInit() {
    this.euriborValues = this.euriborValuesService.getEuriborValues();
    this.getConstants();
    this.updateTotalHouseHoldIncome(this.income.value, this.coApplicantsIncome.value);
    this.updateAvailableMonthlyPayment()
  }

  getConstants() {
    this.apiService.getConstants().subscribe((constants) => {
      this.constants = constants;
      this.minLoanTerm = constants.minLoanTerm;
      this.maxLoanTerm = constants.maxLoanTerm;
      this.loanAmountPercentage = constants.loanAmountPercentage;
      this.minKids = constants.minKids;
      this.maxKids = constants.maxKids;
      this.maxMonthlyObligationsPercentage = constants.maxMonthlyObligationsPercentage;
      this.interestRateMargin = constants.interestRateMargin;
      this.maxNumOfApplicants = constants.maxNumOfApplicants;
      for (let i = this.minKids; i <= this.maxKids; i++) {
        this.children.push(i);
      }
      for (let i = 1; i <= this.maxNumOfApplicants; i++) {
        this.applicantsOptions.push(i);
      }

      this.updateDownPayment();

      this.loanDetailsForm.get('loanTerm').setValidators([
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.min(this.minLoanTerm),
        Validators.max(this.maxLoanTerm)])
    });
  }

  updateDownPayment() {
    const realEstatePrice = this.realEstatePrice.value;
    const isRealEstatePriceValid = realEstatePrice != null && realEstatePrice >= this.minRealEstatePrice && realEstatePrice <= this.maxRealEstatePrice;
    if (isRealEstatePriceValid) {
      const currentValue = this.downPayment.value;
      const minDownPaymentAmount = Math.round(realEstatePrice * (1 - this.loanAmountPercentage));
      const maxDownPaymentAmount = Math.round(realEstatePrice - this.minLoanAmount);
      this.minDownPaymentAmount = minDownPaymentAmount;
      this.maxDownPaymentAmount = maxDownPaymentAmount;

      this.downPayment.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),
        Validators.min(minDownPaymentAmount),
        Validators.max(maxDownPaymentAmount)
      ]);
      if (currentValue < minDownPaymentAmount) {
        this.downPayment.setValue(minDownPaymentAmount);
        this._snackBar.open(
          `Min Down Payment is ${minDownPaymentAmount} €`,
          '',
          {
            duration: 2000,
          }
        );
      } else if (currentValue > maxDownPaymentAmount) {
        this.downPayment.setValue(maxDownPaymentAmount);
        this._snackBar.open(
          `Max Down Payment is ${maxDownPaymentAmount} €`,
          '',
          {
            duration: 2000,
          }
        );
      }
    }
  }

  updateLoanAmount() {
    const loanAmount = Math.round(this.realEstatePrice.value - this.downPayment.value);
    this.loanAmount = loanAmount;
  }


  updateTotalHouseHoldIncome(income, coApplicantsIncome) {
    const totalHouseHoldIncome = +income + +coApplicantsIncome;
    this.totalHouseHoldIncome = totalHouseHoldIncome;
  }

  updateAvailableMonthlyPayment() {
    const income = this.getTotalIncome();
    const monthlyCapacity = income * this.maxMonthlyObligationsPercentage;
    if (monthlyCapacity > 0) {
      const monthlyObligations = this.totalMonthlyObligations;
      if (monthlyObligations > monthlyCapacity) {
        this.availableMonthlyPayment = 0;
        this.canProceedToLoanDetails.setValue(false);
        this.isSufficientMonthlyPayment = false;
      } else {
        this.availableMonthlyPayment = monthlyCapacity - monthlyObligations;
        this.canProceedToLoanDetails.setValue(true);
        this.updateSufficientMonthlyPayment();
      }
    } else {
      this.availableMonthlyPayment = null;
      this.canProceedToLoanDetails.setValue(false);
      this.isSufficientMonthlyPayment = false;
    }
  }

  getTotalIncome() {
    return this.applicants.value > 1 ? this.totalHouseHoldIncome : this.income.value;
  }

  updateMonthlyObligations(mortgageLoans, consumerLoans, leasingAmount, creditCardLimit) {
    const mortgageMonthly =
      (mortgageLoans * (0.055 / 12)) / (1 - Math.pow(1 + 0.055 / 12, -300));
    const consumerMonthly =
      (consumerLoans * (0.1 / 12)) / (1 - Math.pow(1 + 0.1 / 12, -60));
    const leasingMonthly =
      (leasingAmount * (0.07 / 12)) / (1 - Math.pow(1 + 0.07 / 12, -60));
    const creditCardMonthly = creditCardLimit / 36;

    const monthlyObligations = +mortgageMonthly + +consumerMonthly + +leasingMonthly + +creditCardMonthly;
    this.totalMonthlyObligations = monthlyObligations;
    this.updateAvailableMonthlyPayment();
  }

  onSubmitApplyClick()
    :
    void {
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

  saveLoanDetails()
    :
    void {
    const loanDataKeys
      :
      string[] = ["realEstateAddress", "realEstatePrice", "downPayment", "loanTerm",
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
    this.applicationData.loanAmount = this.loanAmount;
  }

  get realEstatePrice() {
    return this.loanDetailsForm.get('realEstatePrice');
  }

  get downPayment() {
    return this.loanDetailsForm.get('downPayment');
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

  get paymentScheduleType() {
    return this.loanDetailsForm.get('paymentScheduleType');
  }

  get mortgageLoans() {
    return this.incomeDetailsForm.get('mortgageLoans');
  }

  get consumerLoans() {
    return this.incomeDetailsForm.get('consumerLoans');
  }

  get leasingAmount() {
    return this.incomeDetailsForm.get('leasingAmount');
  }

  get creditCardLimit() {
    return this.incomeDetailsForm.get('creditCardLimit');
  }

  get canProceedToLoanDetails() {
    return this.incomeDetailsForm.get('canProceed');
  }

  get euribor() {
    return this.loanDetailsForm.get('euribor');
  }

  updateSufficientMonthlyPayment() {
    let totalMortgagePayment = 0;
    const loanTermInMonths = this.loanTerm.value * 12;
    const usersTotalCapacity = this.availableMonthlyPayment * loanTermInMonths;
    let isSufficientMonthlyPayment = usersTotalCapacity >= totalMortgagePayment;
    if (this.loanDetailsForm.valid) {
      const monthlyInterestRate = ((this.euribor.value.interestRate / 100) + this.interestRateMargin) / 12;
      let loanAmount: number = this.loanAmount;
      if (this.paymentScheduleType.value == 'annuity') {
        totalMortgagePayment = this.calculateTotalAnnuityMortgageAmount(loanAmount, monthlyInterestRate, loanTermInMonths);
      } else if (this.paymentScheduleType.value == 'linear') {
        totalMortgagePayment = this.calculateTotalLinearMortgageAmount(loanAmount, loanTermInMonths, monthlyInterestRate);
      }
      if (isSufficientMonthlyPayment) {
        console.log('call sufficient');
        this.canProceedToPersonalDetails.setValue(true);
      } else {
        this.canProceedToPersonalDetails.setValue(false);
      }
    }
    this.isSufficientMonthlyPayment = isSufficientMonthlyPayment;
console.log('call sufficient');
  }

  get canProceedToPersonalDetails() {
    return this.loanDetailsForm.get('canProceed');
  }

  calculateTotalLinearMortgageAmount(loanAmount: number, loanTermInMonths: number, monthlyInterestRate: number) {
    let outstandingLoan = loanAmount;
    let principal = loanAmount / loanTermInMonths;
    let totalMortgagePayment = 0;
    while (outstandingLoan > 0) {
      totalMortgagePayment += principal + monthlyInterestRate * outstandingLoan;
      outstandingLoan -= principal;
    }
    return totalMortgagePayment;
  }

  calculateTotalAnnuityMortgageAmount(loanAmount: number, monthlyInterestRate: number, loanTermInMonths: number) {
    const monthlyAnnuity = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermInMonths));
    return monthlyAnnuity * loanTermInMonths;
  }

  selectedIndex: number = 0;

  setIndex(event: StepperSelectionEvent) {
    if (this.selectedIndex != event.selectedIndex) {
      this.attemptedToProceed = false;
    } else {
      this.attemptedToProceed = true;
    }
    this.selectedIndex = event.selectedIndex;
  }

  triggerClick(event) {
    this.attemptedToProceed = true;
    console.log(`Selected tab index: ${this.selectedIndex}`);
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Constants} from "../interfaces/constants";
import {ApplicationData} from "../interfaces/application-data";
import {AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Euribor} from "../interfaces/euribor";
import {EuriborValuesService} from "../services/euribor-values-service.service";
import {debounceTime, merge} from "rxjs";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {catchError, map} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http"; // import map operator

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
  // monthlyPayment: number = 0;
  totalHouseHoldIncome: number = 0;
  minHouseholdIncome: number;
  isSufficientHouseholdIncome: boolean;
  isSufficientMonthlyPayment: boolean;
  totalMonthlyObligations: number = 0;
  availableMonthlyPayment: number = null;
  paymentScheduleTypes: string[] = ['annuity', 'linear'];
  phoneNumberHintMessage: string = "Valid phone number formats: +3706XXXXXXX, 86XXXXXXX +3705XXXXXXX or 85XXXXXXX";
  personalNumberHintMessage: string = "Valid personal number formats: 3YYMMDDXXXX, 4YYMMDDXXXX, 5YYMMDDXXXX, 6YYMMDDXXXX";

  obligationFields = [
    {label: 'Mortgage Loans', controlName: 'mortgageLoans'},
    {label: 'Consumer Loans', controlName: 'consumerLoans'},
    {label: 'Leasing Amount', controlName: 'leasingAmount'},
    {label: 'Credit Card Limit', controlName: 'creditCardLimit'},
  ];
  applicationDate = Date.now();
  isLinear = true;
  attemptedToProceed = false;
  showAgeWarning: boolean = false;
  userAge: number;
  ageAtLoanTermEnd: number;
  isEmailAvailable: boolean;
  emailNotAvailableMessage: string;
  incomeDetailsForm = formBuilder.group({
    applicants: [this.applicationData.applicants as number, Validators.required],
    amountOfKids: [this.applicationData.amountOfKids as number, Validators.required],
    monthlyIncome: [this.applicationData.monthlyIncome as number,
      [
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
      ],
    ],
    coApplicantsIncome: [null as number],
    obligations: [this.applicationData.obligations as boolean, Validators.required],
    mortgageLoans: [this.applicationData.mortgageLoans as number],
    consumerLoans: [this.applicationData.consumerLoans as number],
    leasingAmount: [this.applicationData.leasingAmount as number],
    creditCardLimit: [this.applicationData.creditCardLimit as number],
    canProceed: [true, Validators.requiredTrue]
  }, {
    updateOn: 'change'
  });
  loanDetailsForm = formBuilder.group({
      realEstateAddress: [this.applicationData.realEstateAddress, Validators.required],
      realEstatePrice: [this.applicationData.realEstatePrice as number, [
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),
        Validators.max(this.maxRealEstatePrice),
        Validators.min(this.minRealEstatePrice),
      ],
      ],
      downPayment: [this.applicationData.downPayment as number,
        [
          Validators.required,
          Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),
        ],
      ],
      loanTerm: [this.applicationData.loanTerm as number,
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
    personalNumber: [this.applicationData.personalNumber, [
      Validators.required, this.personalNumberValidator()
    ],
    ],
    email: [this.applicationData.email,
      [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      this.emailAvailabilityValidator()
    ],
    phoneNumber: [this.applicationData.phoneNumber,
      [
        Validators.required,
        Validators.pattern(/^(\+370|8)(5|6)\d{7}$/)],
    ],
    address: [this.applicationData.address, Validators.required]
  }, {updateOn: 'blur'});
  coApplicantDetailsForm = formBuilder.group({
    firstName: [this.applicationData.firstName, Validators.required],
    lastName: [this.applicationData.lastName, Validators.required],
    email: [this.applicationData.email,
      [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      this.emailAvailabilityValidator()
    ],
    phoneNumber: [this.applicationData.phoneNumber,
      [
        Validators.required,
        Validators.pattern(/^(\+370|8)(5|6)\d{7}$/)],
    ],
  });

  emailAvailabilityValidator() {
    return (control: FormControl) => {
      const email = control.value;
      return this.apiService.checkEmail(email).pipe(
        map((response: any) => {
          this.isEmailAvailable = true;
          return response.available ? null : {emailNotAvailable: true};
        }),
        catchError((error) => {
          if (error.status === 409) {
            this.isEmailAvailable = false;
            this.emailNotAvailableMessage = error.error;
            return [{emailNotAvailable: true}];
          } else {
            console.error('An unexpected error occurred:', error);
            return [];
          }
        })
      );
    };
  }

  private personalNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const regex = /^([3-6])(\d{2})(\d{2})(\d{2})(\d{4})$/;
      const matches = value.match(regex);

      if (!matches) {
        return {invalidPersonalNumber: true};
      }

      const yearString = matches[2];
      const monthString = matches[3];
      const dayString = matches[4];

      let yearPrefix = '19';
      if (matches[1] === '5' || matches[1] === '6') {
        yearPrefix = '20';
      }
      const year = parseInt(yearPrefix + yearString, 10);
      const month = parseInt(monthString, 10) - 1;
      const day = parseInt(dayString, 10);


      const birthDate = new Date(year, month, day);
      if (birthDate.getDate() !== day || birthDate.getMonth() !== month) {
        return {invalidPersonalNumber: true};
      }
      const ageDiff = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiff);

      const age = ageDate.getUTCFullYear() - 1970;
      this.userAge = age;
      if (matches[1] === '5' || matches[1] === '6') {
        if (age < 0) {
          return {invalidPersonalNumber: true};
        }
        if (age < 18) {
          return {invalidAge: true};
        }
      }
      this.updateShowAgeWarning(age, +this.loanTerm.value);
      return null;
    };
  }


  constructor(private euriborValuesService: EuriborValuesService,
              private apiService: ApiService,
              @Inject(MAT_DIALOG_DATA)
              public applicationData: ApplicationData,
              private _snackBar: MatSnackBar,
              private http: HttpClient
  ) {

    const sufficientIncomeFormControls = [this.applicants, this.amountOfKids, this.monthlyIncome, this.coApplicantsIncome]
    sufficientIncomeFormControls.forEach(control => {
      control.valueChanges.subscribe(() => {
        this.updateSufficientHouseholdIncome();
      });
    });

    const sufficientMonthlyPaymentFormControls = [this.realEstatePrice, this.downPayment, this.loanTerm]
    sufficientMonthlyPaymentFormControls.forEach(control => {
      control.valueChanges.subscribe(() => {
this.updateSufficientMonthlyPayment();
      });
    });
    this.paymentScheduleType.valueChanges.subscribe(() => {
      this.updateSufficientMonthlyPayment();
    });
    this.euribor.valueChanges.subscribe(() => {
      this.updateSufficientMonthlyPayment();
    });
    this.personalEmail.valueChanges.subscribe((email) => {
      this.apiService.checkEmail(email).subscribe(
        (response
           :
           any
        ) => {
          // Handle successful response (JSON object)
          this.isEmailAvailable = response.available;
          this.emailNotAvailableMessage = response.message;
        }
        ,
        (error) => {
          // Handle error response
          if (error.status === 409) {
            this.isEmailAvailable = false;
            this.emailNotAvailableMessage = error.error.message;
          } else {
            console.error('An unexpected error occurred:', error);
          }
        }
      );
    });

    this.applicants.valueChanges.subscribe((value: number) => {
      this.updateCoApplicantsIncomeValidations(value);
    });


    this.monthlyIncome.valueChanges.subscribe((value: number) => {
      this.updateAvailableMonthlyPayment();
    });

    merge([this.monthlyIncome.valueChanges, this.coApplicantsIncome.valueChanges]).subscribe(() => {
      this.updateTotalHouseHoldIncome(this.monthlyIncome.value, this.coApplicantsIncome.value);
      this.updateAvailableMonthlyPayment();
    });

    this.obligations.valueChanges.subscribe((value: boolean) => {
      this.updateObligationsValidations(value);
      this.updateMonthlyObligations(this.mortgageLoans.value, this.consumerLoans.value, this.leasingAmount.value, this.creditCardLimit.value);
    });

    this.obligationFields.forEach(formControl => {
      const control = this.incomeDetailsForm.get(formControl.controlName)
      control.valueChanges.subscribe((value) => {
        const stringValue = String(value);
        if (value > 0 && stringValue.startsWith('0')) {
          control.setValue(stringValue.substring(1));
        }

        this.updateMonthlyObligations(this.mortgageLoans.value, this.consumerLoans.value, this.leasingAmount.value, this.creditCardLimit.value);
        this.updateAvailableMonthlyPayment();
      });
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
      this.updateShowAgeWarning(this.userAge, loanTermValue);
    });

    merge([this.realEstatePrice.valueChanges, this.downPayment.valueChanges]).subscribe(() => {
      this.updateLoanAmount();
    });

    merge([this.realEstatePrice.valueChanges, this.downPayment.valueChanges, this.loanTerm.valueChanges, this.euribor.valueChanges, this.paymentScheduleType.valueChanges]).subscribe(() => {
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
    this.updateTotalHouseHoldIncome(this.monthlyIncome.value, this.coApplicantsIncome.value);
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
      if (this.obligations.value == true) {
        this.updateMonthlyObligations(this.mortgageLoans.value, this.consumerLoans.value, this.leasingAmount.value, this.creditCardLimit.value);
      }

      this.updateAvailableMonthlyPayment();

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
    this.updateSufficientHouseholdIncome();
  }

  updateSufficientHouseholdIncome() {
    this.isSufficientHouseholdIncome = true;
    let minHouseholdIncome = 0;
    if (this.applicants.value == 1) {
      if (!this.monthlyIncome.value) {
        return;
      }
      minHouseholdIncome = 600;
    } else if (this.applicants.value == 2) {
      if (!this.monthlyIncome.value || !this.coApplicantsIncome.value) {
        return;
      }
      minHouseholdIncome = 1000;
    }

    minHouseholdIncome = minHouseholdIncome + +this.amountOfKids.value * 300;
    this.minHouseholdIncome = minHouseholdIncome;
    const totalIncome = +this.monthlyIncome.value + +this.coApplicantsIncome.value;
    if (totalIncome < minHouseholdIncome) {
      this.isSufficientHouseholdIncome = false;
    } else {
      this.isSufficientHouseholdIncome = true;
    }
    this.updateCanProceedToLoanDetails();
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
  }

  updateAvailableMonthlyPayment() {
    const income = +this.monthlyIncome.value + +this.coApplicantsIncome.value;
    const monthlyCapacity = income * this.maxMonthlyObligationsPercentage;
    if (monthlyCapacity > 0) {
      const monthlyObligations = this.totalMonthlyObligations;
      if (monthlyObligations > monthlyCapacity) {
        this.availableMonthlyPayment = 0;
      } else {
        this.availableMonthlyPayment = Math.round(monthlyCapacity - monthlyObligations);

      }
    } else {
      this.availableMonthlyPayment = 0;
    }
    this.updateCanProceedToLoanDetails();
  }

  updateCanProceedToLoanDetails() {
    if (this.availableMonthlyPayment > 0 && this.isSufficientHouseholdIncome == true) {
      this.canProceedToLoanDetails.setValue(true);
      this.updateSufficientMonthlyPayment();
    } else {
      this.canProceedToLoanDetails.setValue(false);
    }
  }

  updateShowAgeWarning(age: number, loanTerm: number) {
    const ageAtLoanTermEnd = age + +this.loanTerm.value;
    this.ageAtLoanTermEnd = ageAtLoanTermEnd;

    if (this.loanTerm.value && ageAtLoanTermEnd > 65) {
      this.showAgeWarning = true;
    } else {
      this.showAgeWarning = false;
    }
  }

  getTotalIncome() {
    return this.applicants.value > 1 ? this.totalHouseHoldIncome : this.monthlyIncome.value;
  }

  onSubmitApplyClick(): void {
    //form validation and post to backend
    this.saveLoanDetails();
    console.log(this.applicationData)
    this.apiService.postApplication(this.applicationData).subscribe({
      next: () => {
        console.log("Application submitted successfully");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  saveLoanDetails(): void {
    const loanDataKeys: string[] = ["realEstatePrice", "downPayment", "loanTerm",
      ];
    const incomeDataKeys: string[] = ["applicants", "amountOfKids", "monthlyIncome", "coApplicantsIncome", "obligations", "mortgageLoans", "consumerLoans",
      "leasingAmount", "creditCardLimit"];
    const personalDataKeys: string[] = ["firstName", "lastName", "personalNumber",
      "email", "phoneNumber", "address"];

    loanDataKeys.forEach((key) => {
      this.applicationData[key] = +this.loanDetailsForm.value[key]
    });
    incomeDataKeys.forEach((key) => {
      this.applicationData[key] = +this.incomeDetailsForm.value[key]
    });
    personalDataKeys.forEach((key) => {
      this.applicationData[key] = this.personalDetailsForm.value[key]
    });
    this.applicationData.paymentScheduleType =  this.paymentScheduleType.value.toUpperCase();
    this.applicationData.realEstateAddress = this.realEstateAddress.value;
    this.applicationData.loanAmount = this.loanAmount;
    this.applicationData.interestRateMargin = this.interestRateMargin;
    this.applicationData.euriborTerm = this.euribor.value.timeInMonths;
    this.applicationData.interestRateEuribor = this.euribor.value.interestRate;
    this.applicationData.totalHouseholdIncome = this.totalHouseHoldIncome;
    this.applicationData.monthlyPayment = this.availableMonthlyPayment;
    this.applicationData.coApplicantEmail = this.coApplicantEmail.value;
  }

  get realEstateAddress() {
    return this.loanDetailsForm.get('realEstateAddress');
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

  get monthlyIncome() {
    return this.incomeDetailsForm.get('monthlyIncome');
  }

  get obligations() {
    return this.incomeDetailsForm.get('obligations');
  }

  get applicants() {
    return this.incomeDetailsForm.get('applicants');
  }

  get amountOfKids() {
    return this.incomeDetailsForm.get('amountOfKids');
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

  get personalFirstName() {
    return this.personalDetailsForm.get('firstName');
  }

  get personalLastName() {
    return this.personalDetailsForm.get('lastName');
  }


  get personalNumber() {
    return this.personalDetailsForm.get('personalNumber');
  }

  get personalEmail() {
    return this.personalDetailsForm.get('email');
  }

  get personalPhoneNumber() {
    return this.personalDetailsForm.get('phoneNumber');
  }

  get personalAddress() {
    return this.personalDetailsForm.get('address');
  }

  get coApplicantFirstName() {
    return this.coApplicantDetailsForm.get('firstName');
  }

  get coApplicantLastName() {
    return this.coApplicantDetailsForm.get('lastName');
  }

  get coApplicantEmail() {
    return this.coApplicantDetailsForm.get('email');
  }

  get coApplicantPhoneNumber() {
    return this.coApplicantDetailsForm.get('phoneNumber');
  }

  updateSufficientMonthlyPayment() {
    let totalMortgagePayment = 0;
    const loanTermInMonths = this.loanTerm.value * 12;
    const usersTotalCapacity = this.availableMonthlyPayment * loanTermInMonths;
if(!this.euribor.value){
  return;
}
    const monthlyInterestRate = ((this.euribor.value.interestRate / 100) + this.interestRateMargin) / 12;
    let loanAmount: number = this.loanAmount;
    if (this.paymentScheduleType.value == 'annuity') {
      totalMortgagePayment = this.calculateTotalAnnuityMortgageAmount(loanAmount, monthlyInterestRate, loanTermInMonths);
    } else if (this.paymentScheduleType.value == 'linear') {
      totalMortgagePayment = this.calculateTotalLinearMortgageAmount(loanAmount, loanTermInMonths, monthlyInterestRate);
    }
    let isSufficientMonthlyPayment = usersTotalCapacity >= totalMortgagePayment;
    this.isSufficientMonthlyPayment = isSufficientMonthlyPayment;
    if (isSufficientMonthlyPayment) {

      this.canProceedToPersonalDetails.setValue(true);
    } else {
      this.canProceedToPersonalDetails.setValue(false);
    }
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
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Constants} from "../interfaces/constants";
import {ApplicationData} from "../interfaces/application-data";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Euribor} from "../interfaces/euribor";
import {EuriborValuesService} from "../services/euribor-values-service.service";

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
  applicants: number[] = [];
  maxMonthlyObligationsPercentage: number;
  euriborValues: Euribor[];
  get maxLoanAmount(): number {
    return this.realEstatePrice.value * this.loanAmountPercentage;
  }
  get validLoanAmount():boolean {
    return this.loanAmount.value <= this.maxLoanAmount;
  }
  get validMinDownPaymentAmount():boolean {
    return this.downPayment.value >= this.realEstatePrice.value * (1-this.loanAmountPercentage);
  }

  paymentScheduleTypes: string[] = ['annuity', 'linear'];
  obligationFields = [
    {label: 'Mortgage Loans', controlName: 'mortgageLoans'},
    {label: 'Consumer Loans', controlName: 'consumerLoans'},
    {label: 'Leasing Amount', controlName: 'leasingAmount'},
    {label: 'Credit Card Limit', controlName: 'creditCardLimit'},
  ];
  isLinear = true;

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
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
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
  });
  incomeDetailsForm = formBuilder.group({
    applicants: [this.applicationData.applicants, Validators.required],
    amountOfKids: [this.applicationData.amountOfKids, Validators.required],
    income: [this.applicationData.income,
      [
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
      ],
    ],
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
        // Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
    ],
    phoneNumber: [this.applicationData.phoneNumber,
      [
        Validators.required,
        Validators.pattern(/^(\+370|8)(5|6)\d{7}$/)],
      ],
    address: [this.applicationData.address, Validators.required]
  });
  get realEstatePrice(){
    return this.loanDetailsForm.get('realEstatePrice');
  }
  get downPayment(){
    return this.loanDetailsForm.get('downPayment');
  }
  get loanAmount(){
    return this.loanDetailsForm.get('loanAmount');
  }



  constructor(private euriborValuesService: EuriborValuesService,
              private apiService: ApiService,
              public dialogRef: MatDialogRef<ApplicationDialogComponent>,
              @Inject(MAT_DIALOG_DATA)
              public applicationData: ApplicationData,
              private _snackBar: MatSnackBar,
  ) {
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
        this.applicants.push(i);
      }
    });
  }

  get obligations() {
    return this.incomeDetailsForm.get('obligations');
  }

  onCancelClick(): void {
    this.dialogRef.close();
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
    const incomeDataKeys: string[] = ["applicants", "amountOfKids", "income", "obligations", "mortgageLoans", "consumerLoans",
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
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Constants} from "../interfaces/constants";
import {ApplicationData} from "../interfaces/application-data";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Euribor} from "../interfaces/euribor";
import {EuriborService} from "../services/euribor.service";

const formBuilder = new FormBuilder().nonNullable;

@Component({
  selector: 'app-application-dialog',
  templateUrl: './application-dialog.component.html',
  styleUrls: ['./application-dialog.component.scss']
})
export class ApplicationDialogComponent implements OnInit {
  constants: Constants;
  minLoanTerm: number;
  maxLoanTerm: number;
  loanAmountPercentage: number;
  minKids: number;
  maxKids: number;
  maxNumOfApplicants: number;
  children: number[] = [];
  applicants: number[] = [];
  maxMonthlyObligationsPercentage: number;
  euriborValues: Euribor[] = [
    {
      timeInMonths: 3,
      interestRate: 3.108,
    },
    {
      timeInMonths: 6,
      interestRate: 3.356,
    },
    {
      timeInMonths: 12,
      interestRate: 3.582,
    },
  ];
  euriborValue: any;
  paymentScheduleTypes: string[] = ['Annuity', 'Linear'];
  obligationFields = [
    { label: 'Mortgage Loans', controlName: 'mortgageLoans' },
    { label: 'Consumer Loans', controlName: 'consumerLoans' },
    { label: 'Leasing Amount', controlName: 'leasingAmount' },
    { label: 'Credit Card Limit', controlName: 'creditCardLimit' },
  ];


  ngOnInit() {
    this.euriborService.getEuribor().subscribe((euribor) => {
      const ratePct = euribor.non_central_bank_rates.find(rate => rate.name === 'Euribor - 3 months').rate_pct;
      console.log("Euribor rate_pct: " + ratePct);
      console.log("euribor: " + JSON.stringify(euribor))
    });
    this.apiService.getConstants().subscribe((constants) => {
      console.log("constants minKids: " + constants.minKids)
      this.constants = constants;
      this.minLoanTerm = constants.minLoanTerm;
      this.maxLoanTerm = constants.maxLoanTerm;
      this.loanAmountPercentage = constants.loanAmountPercentage;
      this.minKids = constants.minKids;
      this.maxKids = constants.maxKids;
      this.maxMonthlyObligationsPercentage = constants.maxMonthlyObligationsPercentage;
      this.maxNumOfApplicants = constants.maxNumOfApplicants;
      console.log("min kids: ", this.minKids);
      for (let i = this.minKids; i <= this.maxKids; i++) {
        this.children.push(i);
      }
      for (let i = 1; i <= this.maxNumOfApplicants; i++) {
        this.applicants.push(i);
      }
    });
  }

  isLinear = true;

  loanDetailsForm = formBuilder.group({
    realEstatePrice: [this.applicationData.realEstatePrice, Validators.required],
    downPayment: [this.applicationData.downPayment, Validators.required],
    loanAmount: [this.applicationData.loanAmount, Validators.required],
    loanTerm: [this.applicationData.loanTerm, Validators.required],
    euribor: [this.applicationData.euribor, [Validators.required]],
    paymentScheduleType: [this.paymentScheduleTypes[0] as string, [Validators.required]],
  });
  incomeDetailsForm = formBuilder.group({
    applicants: [this.applicationData.applicants, Validators.required],
    amountOfKids: [this.applicationData.amountOfKids, Validators.required],
    income: [this.applicationData.income, Validators.required],
    obligations: [this.applicationData.obligations, Validators.required],
    mortgageLoans: [this.applicationData.mortgageLoans],
    consumerLoans: [this.applicationData.consumerLoans],
    leasingAmount: [this.applicationData.leasingAmount],
    creditCardLimit: [this.applicationData.creditCardLimit],
    monthlyPayment: [this.applicationData.monthlyPayment],
  });
  personalDetailsForm = formBuilder.group({
    firstName: [this.applicationData.firstName, Validators.required],
    lastName: [this.applicationData.lastName, Validators.required],
    personalNumber: [this.applicationData.personalNumber, Validators.required],
    email: [this.applicationData.email, Validators.required],
    phoneNumber: [this.applicationData.phoneNumber, Validators.required],
    address: [this.applicationData.address, Validators.required]
  });

  get obligations() {
    return this.incomeDetailsForm.get('obligations');
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onDoneClick(): void {
    //form validation and post to backend
    this.saveLoanDetails();
    console.log(this.applicationData)
    this.api.postApplication(this.applicationData).subscribe({
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
    loanDataKeys.forEach((key) => { this.applicationData[key] = this.loanDetailsForm.value[key] });
    incomeDataKeys.forEach((key) => { this.applicationData[key] = this.incomeDetailsForm.value[key] });
    personalDataKeys.forEach((key) => { this.applicationData[key] = this.personalDetailsForm.value[key] });
  }

  constructor(private euriborService: EuriborService,
              private apiService: ApiService,
              public dialogRef: MatDialogRef<ApplicationDialogComponent>,
              @Inject(MAT_DIALOG_DATA)
              public applicationData: ApplicationData,
              private _snackBar: MatSnackBar,
  ) {
  }
}

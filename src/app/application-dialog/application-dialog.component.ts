import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Constants} from "../interfaces/constants";
import {ApplicationData} from "../interfaces/application-data";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {euriborValues} from "../interfaces/euribor";
import {Euribor} from "../interfaces/euribor";


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
  maxKids: number;
  maxMonthlyObligationsPercentage: number;
  euriborValues: Euribor[] = euriborValues;
  paymentScheduleTypes: string[] = ['Annuity', 'Linear'];
  obligationFields = [
    { label: 'Mortgage Loans', controlName: 'mortgageLoans' },
    { label: 'Consumer Loans', controlName: 'consumerLoans' },
    { label: 'Leasing Amount', controlName: 'leasingAmount' },
    { label: 'Credit Card Limit', controlName: 'creditCardLimit' },
  ];
  ngOnInit() {
    this.apiService.getConstants().subscribe((constants) => {
      this.constants = constants;
      this.minLoanTerm = constants.minLoanTerm;
      this.maxLoanTerm = constants.maxLoanTerm;
      this.loanAmountPercentage = constants.loanAmountPercentage;
      this.maxKids = constants.maxKids;
      this.maxMonthlyObligationsPercentage = constants.maxMonthlyObligationsPercentage;
    });
  }

  secondFormGroup = formBuilder.group({
    secondApplicationForm: ['', Validators.required],
  });
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
  get obligations() {
    return this.incomeDetailsForm.get('obligations');
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    console.log(`The dialog was closed with result: ${this.applicationData.applicants}`);
  }

  maxApplicants(): number[] {
    return Array(this.constants.maxNumOfApplicants).fill(0).map((x, i) => i + 1);
  }

  children(): number[] {
    const minKids = this.constants.minKids;
    const maxKids = this.constants.maxKids;
    const kids = [];
    for (let i = minKids; i <= maxKids; i++) {
      kids.push(i);
    }
    return kids;
  }

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public applicationData: ApplicationData,
    private _snackBar: MatSnackBar,
  ) {
  }


}

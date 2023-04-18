import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Constants} from "../interfaces/constants";
import {ApplicationData} from "../interfaces/application-data";
import {FormBuilder} from "@angular/forms";

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
  maxNumOfApplicants: number;

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public applicationData: ApplicationData,
  ) {
  }

  ngOnInit() {
    this.apiService.getConstants().subscribe((constants) => {
      this.constants = constants;
      this.minLoanTerm = constants.minLoanTerm;
      this.maxLoanTerm = constants.maxLoanTerm;
      this.loanAmountPercentage = constants.loanAmountPercentage;
      this.maxKids = constants.maxKids;
      this.maxMonthlyObligationsPercentage = constants.maxMonthlyObligationsPercentage;
      this.maxNumOfApplicants = constants.maxNumOfApplicants;
    });
  }

  applicationForm = formBuilder.group({
    applicants: [this.applicationData.applicants],
    amountOfKids: [this.applicationData.amountOfKids],
    income: [this.applicationData.income],
    mortgageLoans: [this.applicationData.mortgageLoans],
    consumerLoans: [this.applicationData.consumerLoans],
    leasingAmount: [this.applicationData.leasingAmount],
    creditCardLimit: [this.applicationData.creditCardLimit],
    monthlyPayment: [this.applicationData.monthlyPayment],
      });

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    console.log(`The dialog was closed with result: ${this.applicationData.applicants}`);
  }

  maxApplicants(): number[] {
    return Array(this.maxNumOfApplicants).fill(0).map((x, i) => i + 1);
  }
}

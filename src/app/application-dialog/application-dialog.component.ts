import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../services/api.service";
import {Constants} from "../interfaces/constants";
import {ApplicationData} from "../interfaces/application-data";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Euribor, euriborValuesConst} from "../interfaces/euribor";


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
  euriborValues: Euribor[] = euriborValuesConst;
  paymentScheduleTypes: string[] = ['Annuity', 'Linear'];
  obligationFields = [
    {label: 'Mortgage Loans', controlName: 'mortgageLoans'},
    {label: 'Consumer Loans', controlName: 'consumerLoans'},
    {label: 'Leasing Amount', controlName: 'leasingAmount'},
    {label: 'Credit Card Limit', controlName: 'creditCardLimit'},
  ];

  ngOnInit() {
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
    })
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
    console.log(`The dialog was closed with result: ${this.applicationData.realEstatePrice}`);
  }

  saveLoanDetails(): void {
    this.applicationData.realEstatePrice = this.loanDetailsForm.value.realEstatePrice;
//update other fields
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

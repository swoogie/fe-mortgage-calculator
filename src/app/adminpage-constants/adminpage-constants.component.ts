import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Constants } from '../interfaces/constants';
const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-adminpage-constants',
  templateUrl: './adminpage-constants.component.html',
  styleUrls: ['./adminpage-constants.component.scss']
})
export class AdminpageConstantsComponent {
  constants: Constants;
  cardItems: any[];
  constructor (private api: ApiService) {}

  
  adminConstants = fb.group(
    {
      maxLoanTerm: [''],
      minLoanTerm: [''],
      interestRateMargin: [''],
      loanAmountPercentage: [''],
      maxKids: [''],
      maxMonthlyObligationsPercentage: [''],
      maxApplicants: [''],
      // maxRealEstatePrice: [''],
      // minRealEstatePrice: [''],
      // minLoan: [''],
      // interestBaseRate: [''],
      // ltvRatio: [''],
      // dtiRatio: [''],
    }
    
  );
  ngOnInit() {
    this.api.getConstants().subscribe((constants) => {
      console.log(constants);
      this.constants = constants
      this.cardItems = [{
        name: "Maximum loan term", 
        desc: "The maximum loan term that the user can choose",
        formControlName: "maxLoanTerm",
        current: this.constants.maxLoanTerm,
      },
      {
        name: "Minimum loan term", 
        desc: "The minimum loan term that the user can choose",
        formControlName: "minLoanTerm",
        current: this.constants.minLoanTerm,
      },
      {
        name: "Interest Rate margin", 
        desc: "The difference between interest income and interest cost in terms of average assets.",
        formControlName: "interestRateMargin",
        current: `${this.constants.interestRateMargin * 100}%`,
      },
      {
        name: "Loan amount percentage", 
        desc: "The max loan amount in percentage of a users monthly income that they can take",
        formControlName: "loanAmountPercentage",
        current: `${this.constants.loanAmountPercentage * 100}%`,
      },
      {
        name: "Maximum kids", 
        desc: "The maximum amount of kids that a user can have",
        formControlName: "maxKids",
        current: this.constants.maxKids,
      },
      {
        name: "Maximum monthly obligations percentage", 
        desc: "The maximum allowed monthly obligations (in percentage) that a user can have",
        formControlName: "maxMonthlyObligationsPercentage",
        current: `${this.constants.maxMonthlyObligationsPercentage * 100}%`,
      },
      {
        name: "Maximum number of applicants", 
        desc: "The maximum amount of applicants allowed when applying for a loan",
        formControlName: "maxApplicants",
        current: this.constants.maxNumOfApplicants,
      },
    ]
    });
  }
}


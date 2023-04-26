import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
const fb = new FormBuilder().nonNullable;

@Component({
  selector: 'app-adminpage-constants',
  templateUrl: './adminpage-constants.component.html',
  styleUrls: ['./adminpage-constants.component.scss']
})
export class AdminpageConstantsComponent {
  constants: any[] = [{
    name: "Maximum loan term", 
    desc: "The maximum loan term that the user can choose",
    formControlName: "maxLoanTerm",
    current: 30,
  },
  {
    name: "Minimum loan term", 
    desc: "The minimum loan term that the user can choose",
    formControlName: "minLoanTerm",
    current: 1,
  },
  {
    name: "Maximum real estate price", 
    desc: "The maximum real estate price a user can provide",
    formControlName: "maxRealEstatePrice",
    current: 1000000,
  },
  {
    name: "Minimum real estate price", 
    desc: "The minimum real estate price a user can provide",
    formControlName: "minRealEstatePrice",
    current: 10000,
  },
  {
    name: "Minimum loan amount", 
    desc: "The minimum loan that a user can take",
    formControlName: "minLoan",
    current: 1000,
  },
  {
    name: "Interest Rate margin", 
    desc: "The difference between interest income and interest cost in terms of average assets.",
    formControlName: "interestRateMargin",
    current: "",
  },
  {
    name: "Interest base rate", 
    desc: "The interest rate that a central bank can change",
    formControlName: "interestBaseRate",
    current: "2.5%",
  },
  {
    name: "LTV ratio", 
    desc: "LTV ratio is a figure (expressed in the form of a percentage) that measures the appraised value of a home that you want to buy or refinance against the loan amount that you're seeking to borrow",
    formControlName: "ltvRatio",
    current: "",
  },
  {
    name: "DTI ratio", 
    desc: "The DTI ratio is all your monthly debt payments divided by your gross monthly income",
    formControlName: "dtiRatio",
    current: "",
  },

]
  adminConstants = fb.group(
    {
      maxLoanTerm: [''],
      minLoanTerm: [''],
      maxRealEstatePrice: [''],
      minRealEstatePrice: [''],
      minLoan: [''],
      interestRateMargin: [''],
      interestBaseRate: [''],
      ltvRatio: [''],
      dtiRatio: [''],
    }
  );
}

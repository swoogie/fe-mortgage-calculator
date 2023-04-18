import {Euribor} from "./euribor";

export interface ApplicationData {
  loanTerm: number;
  loanAmount: number;
  downPayment: number;
  realEstatePrice: number;
  applicants?: number;
  amountOfKids?: number;
  income?: number;
  obligations: boolean;
  mortgageLoans?: number;
  consumerLoans?: number;
  leasingAmount?: number;
  creditCardLimit?: number;
  monthlyPayment?: number;
  euribor?: Euribor;
}

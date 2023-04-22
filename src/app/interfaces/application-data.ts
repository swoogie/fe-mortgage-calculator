import {Euribor} from "./euribor";

export interface ApplicationData {
  realEstatePrice: number;
  downPayment: number;
  loanAmount: number;
  loanTerm: number;
  paymentScheduleType: string;
  euribor: Euribor;
  applicants: number;
  amountOfKids: number;
  income?: number;
  coApplicantsIncome: number;
  obligations: boolean;
  mortgageLoans: number;
  consumerLoans: number;
  leasingAmount: number;
  creditCardLimit: number;
  monthlyPayment: number;
  firstName: string;
  lastName: string;
  personalNumber: number;
  email: string;
  phoneNumber: string;
  address: string;
}

import {Euribor} from "./euribor";

export interface ApplicationData {
  applicants: number;
  amountOfKids: number;
  monthlyIncome: number;
  coApplicantsIncome: number;
  obligations: boolean;
  mortgageLoans: number;
  consumerLoans: number;
  leasingAmount: number;
  creditCardLimit: number;
  monthlyPayment: number;
  realEstateAddress: string;
  realEstatePrice: number;
  downPayment: number;
  loanAmount: number;
  loanTerm: number;
  paymentScheduleType: string;
  euribor: Euribor;
  firstName: string;
  lastName: string;
  personalNumber: number;
  email: string;
  phoneNumber: string;
  address: string;
  interestRateMargin: number;
  euriborTerm: number;
  interestRateEuribor: number;
  totalHouseholdIncome: number;
}

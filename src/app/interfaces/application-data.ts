import {Euribor} from "./euribor";

export interface ApplicationData {
  realEstatePrice: number;
  downPayment: number;
  loanAmount: number;
  loanTerm: number;
  paymentScheduleType: string;
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
  firstName: string;
  lastName: string;
  personalNumber: number;
  email: string;
  phoneNumber: string;
  address: string;
}

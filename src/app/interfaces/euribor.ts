export interface Euribor {
  timeInMonths: number;
  interestRate: number;
}

export const euriborValues: Euribor[] = [
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

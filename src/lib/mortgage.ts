export type RepaymentFrequency = "monthly" | "fortnightly" | "weekly";
export type DepositMode = "amount" | "percent";

export { formatGbp, formatGbpPrecise } from "./format";

export const MAX_ANNUAL_RATE = 20;
export const MAX_TERM_YEARS = 40;

export const FREQUENCIES: Record<
  RepaymentFrequency,
  { label: string; periodsPerYear: number; periodLabel: string }
> = {
  monthly: {
    label: "Monthly",
    periodsPerYear: 12,
    periodLabel: "month",
  },
  fortnightly: {
    label: "Fortnightly",
    periodsPerYear: 26,
    periodLabel: "fortnight",
  },
  weekly: {
    label: "Weekly",
    periodsPerYear: 52,
    periodLabel: "week",
  },
};

export const DEFAULTS = {
  propertyPrice: "300000",
  depositAmount: "60000",
  depositPercent: "20",
  annualRate: "4.5",
  termYears: "25",
  frequency: "monthly" as RepaymentFrequency,
  depositMode: "amount" as DepositMode,
};

export interface MortgageInputs {
  propertyPrice: number;
  depositAmount: number;
  annualRate: number;
  termYears: number;
  frequency: RepaymentFrequency;
}

export interface MortgageYear {
  year: number;
  payments: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface MortgageResult {
  loanAmount: number;
  periodicPayment: number;
  totalPeriods: number;
  periodsPerYear: number;
  periodLabel: string;
  totalRepaid: number;
  totalInterest: number;
  schedule: MortgageYear[];
}

/**
 * Calculates a level-payment mortgage and its year-by-year amortisation.
 * Returns `null` for inputs that cannot produce a meaningful estimate.
 */
export function calculateMortgage(
  inputs: MortgageInputs,
): MortgageResult | null {
  const { propertyPrice, depositAmount, annualRate, termYears, frequency } =
    inputs;

  if (
    !Number.isFinite(propertyPrice) ||
    propertyPrice <= 0 ||
    !Number.isFinite(depositAmount) ||
    depositAmount < 0 ||
    depositAmount >= propertyPrice ||
    !Number.isFinite(annualRate) ||
    annualRate < 0 ||
    annualRate > MAX_ANNUAL_RATE ||
    !Number.isFinite(termYears) ||
    termYears < 1 ||
    termYears > MAX_TERM_YEARS
  ) {
    return null;
  }

  const loanAmount = propertyPrice - depositAmount;
  const { periodsPerYear, periodLabel } = FREQUENCIES[frequency];
  const totalPeriods = Math.round(termYears * periodsPerYear);
  const periodRate = annualRate / 100 / periodsPerYear;

  const periodicPayment =
    periodRate === 0
      ? loanAmount / totalPeriods
      : (loanAmount * periodRate) /
        (1 - Math.pow(1 + periodRate, -totalPeriods));

  const years: MortgageYear[] = [];
  let balance = loanAmount;

  for (let period = 1; period <= totalPeriods; period++) {
    const interest = balance * periodRate;
    // Adjust the final payment so the balance reaches exactly zero.
    const principal =
      period === totalPeriods
        ? balance
        : Math.min(balance, periodicPayment - interest);
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);

    const year = Math.ceil(period / periodsPerYear);
    const entry = years[year - 1] ?? {
      year,
      payments: 0,
      principal: 0,
      interest: 0,
      balance: 0,
    };

    entry.payments += payment;
    entry.principal += principal;
    entry.interest += interest;
    entry.balance = balance;
    years[year - 1] = entry;
  }

  return {
    loanAmount,
    periodicPayment,
    totalPeriods,
    periodsPerYear,
    periodLabel,
    totalRepaid: years.reduce((sum, entry) => sum + entry.payments, 0),
    totalInterest: years.reduce((sum, entry) => sum + entry.interest, 0),
    schedule: years,
  };
}

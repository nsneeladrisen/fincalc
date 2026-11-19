export type CompoundingFrequency = "monthly" | "quarterly" | "annually"

export const MAX_ANNUAL_RATE = 20
export const MAX_TERM_YEARS = 40

export const COMPOUNDING_FREQUENCIES: Record<
  CompoundingFrequency,
  { label: string; periodsPerYear: number }
> = {
  monthly: { label: "Monthly", periodsPerYear: 12 },
  quarterly: { label: "Quarterly", periodsPerYear: 4 },
  annually: { label: "Annually", periodsPerYear: 1 },
}

export const DEFAULTS = {
  initialAmount: "10000",
  monthlyContribution: "250",
  annualRate: "5",
  termYears: "20",
  frequency: "monthly" as CompoundingFrequency,
}

export interface CompoundInterestInputs {
  initialAmount: number
  monthlyContribution: number
  annualRate: number
  termYears: number
  frequency: CompoundingFrequency
}

export interface CompoundInterestYear {
  year: number
  contributions: number
  interest: number
  balance: number
}

export interface CompoundInterestResult {
  initialAmount: number
  monthlyContribution: number
  annualRate: number
  termYears: number
  frequencyLabel: string
  monthlyRate: number
  totalContributions: number
  totalInterest: number
  finalBalance: number
  schedule: CompoundInterestYear[]
}

/**
 * Projects savings growth with monthly contributions. Interest is converted
 * to a monthly equivalent rate based on the chosen compounding frequency.
 * Returns `null` for inputs that cannot produce a meaningful estimate.
 */
export function calculateCompoundInterest(
  inputs: CompoundInterestInputs,
): CompoundInterestResult | null {
  const {
    initialAmount,
    monthlyContribution,
    annualRate,
    termYears,
    frequency,
  } = inputs

  if (
    !Number.isFinite(initialAmount) ||
    initialAmount < 0 ||
    !Number.isFinite(monthlyContribution) ||
    monthlyContribution < 0 ||
    (initialAmount === 0 && monthlyContribution === 0) ||
    !Number.isFinite(annualRate) ||
    annualRate < 0 ||
    annualRate > MAX_ANNUAL_RATE ||
    !Number.isFinite(termYears) ||
    termYears < 1 ||
    termYears > MAX_TERM_YEARS
  ) {
    return null
  }

  const { label: frequencyLabel, periodsPerYear } =
    COMPOUNDING_FREQUENCIES[frequency]
  const effectiveAnnualRate =
    Math.pow(1 + annualRate / 100 / periodsPerYear, periodsPerYear) - 1
  const monthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1
  const totalMonths = Math.round(termYears * 12)

  const schedule: CompoundInterestYear[] = Array.from(
    { length: termYears },
    (_, index) => ({
      year: index + 1,
      contributions: index === 0 ? initialAmount : 0,
      interest: 0,
      balance: 0,
    }),
  )

  let balance = initialAmount

  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * monthlyRate
    balance += interest + monthlyContribution

    const entry = schedule[Math.ceil(month / 12) - 1]
    entry.contributions += monthlyContribution
    entry.interest += interest
    entry.balance = balance
  }

  return {
    initialAmount,
    monthlyContribution,
    annualRate,
    termYears,
    frequencyLabel,
    monthlyRate,
    totalContributions: schedule.reduce(
      (sum, entry) => sum + entry.contributions,
      0,
    ),
    totalInterest: schedule.reduce((sum, entry) => sum + entry.interest, 0),
    finalBalance: balance,
    schedule,
  }
}

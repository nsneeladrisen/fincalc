"use client"

import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CircleDollarSignIcon, InfoIcon, RotateCcwIcon } from "lucide-react"

import {
  calculateCompoundInterest,
  COMPOUNDING_FREQUENCIES,
  DEFAULTS,
  MAX_ANNUAL_RATE,
  MAX_TERM_YEARS,
  type CompoundingFrequency,
} from "@/lib/compound-interest"
import { formatGbp } from "@/lib/format"

const chartConfig = {
  contributions: {
    label: "Paid in",
    color: "var(--chart-1)",
  },
  interest: {
    label: "Interest earned",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const MAX_INITIAL_AMOUNT = 100000
const MAX_MONTHLY_CONTRIBUTION = 5000

function parseInput(value: string) {
  return value.trim() === "" ? Number.NaN : Number(value)
}

function safeNumber(value: string, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function sliderValue(value: number, max: number) {
  return [Math.min(Math.max(value, 0), max)]
}

const frequencies = Object.entries(COMPOUNDING_FREQUENCIES).map(
  ([value, details]) => ({
    value: value as CompoundingFrequency,
    label: details.label,
  }),
)

export function CompoundInterestCalculator() {
  const [initialAmount, setInitialAmount] = useState(DEFAULTS.initialAmount)
  const [monthlyContribution, setMonthlyContribution] = useState(
    DEFAULTS.monthlyContribution,
  )
  const [annualRate, setAnnualRate] = useState(DEFAULTS.annualRate)
  const [termYears, setTermYears] = useState(DEFAULTS.termYears)
  const [frequency, setFrequency] = useState<CompoundingFrequency>(
    DEFAULTS.frequency,
  )

  const starting = parseInput(initialAmount)
  const monthly = parseInput(monthlyContribution)
  const rate = parseInput(annualRate)
  const years = parseInput(termYears)

  const errors = {
    initialAmount:
      !Number.isFinite(starting) || starting < 0
        ? "Enter a starting amount of £0 or more."
        : undefined,
    monthlyContribution:
      !Number.isFinite(monthly) || monthly < 0
        ? "Enter a monthly contribution of £0 or more."
        : undefined,
    savings:
      Number.isFinite(starting) &&
      Number.isFinite(monthly) &&
      starting <= 0 &&
      monthly <= 0
        ? "Add a starting amount or a monthly contribution greater than £0."
        : undefined,
    rate:
      !Number.isFinite(rate) || rate < 0 || rate > MAX_ANNUAL_RATE
        ? `Enter an interest rate between 0% and ${MAX_ANNUAL_RATE}%.`
        : undefined,
    term:
      !Number.isFinite(years) || years < 1 || years > MAX_TERM_YEARS
        ? `Enter a term between 1 and ${MAX_TERM_YEARS} years.`
        : undefined,
  }

  const isValid = Object.values(errors).every((error) => !error)
  const result = useMemo(
    () =>
      isValid
        ? calculateCompoundInterest({
            initialAmount: starting,
            monthlyContribution: monthly,
            annualRate: rate,
            termYears: years,
            frequency,
          })
        : null,
    [isValid, starting, monthly, rate, years, frequency],
  )

  function handleReset() {
    setInitialAmount(DEFAULTS.initialAmount)
    setMonthlyContribution(DEFAULTS.monthlyContribution)
    setAnnualRate(DEFAULTS.annualRate)
    setTermYears(DEFAULTS.termYears)
    setFrequency(DEFAULTS.frequency)
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your savings plan</CardTitle>
          <CardDescription>
            Adjust the numbers and your estimate updates straight away.
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">
              <CircleDollarSignIcon data-icon="inline-start" />
              GBP
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldLegend className="sr-only">Savings details</FieldLegend>
            <FieldGroup>
              <Field data-invalid={Boolean(errors.initialAmount)}>
                <FieldLabel htmlFor="initial-amount">
                  Starting amount
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="initial-amount"
                    type="number"
                    min={0}
                    step={500}
                    inputMode="numeric"
                    value={initialAmount}
                    onChange={(event) => setInitialAmount(event.target.value)}
                    aria-invalid={Boolean(errors.initialAmount)}
                  />
                  <InputGroupAddon>£</InputGroupAddon>
                </InputGroup>
                <div className="py-2">
                  <Slider
                    aria-label="Starting amount"
                    min={0}
                    max={MAX_INITIAL_AMOUNT}
                    step={500}
                    value={sliderValue(
                      safeNumber(initialAmount, 0),
                      MAX_INITIAL_AMOUNT,
                    )}
                    onValueChange={(value) =>
                      setInitialAmount(
                        String(Array.isArray(value) ? value[0] : value),
                      )
                    }
                  />
                </div>
                <FieldDescription>The amount you start with.</FieldDescription>
                <FieldError>{errors.initialAmount}</FieldError>
                <FieldError>{errors.savings}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.monthlyContribution)}>
                <FieldLabel htmlFor="monthly-contribution">
                  Monthly contribution
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="monthly-contribution"
                    type="number"
                    min={0}
                    step={50}
                    inputMode="numeric"
                    value={monthlyContribution}
                    onChange={(event) =>
                      setMonthlyContribution(event.target.value)
                    }
                    aria-invalid={Boolean(errors.monthlyContribution)}
                  />
                  <InputGroupAddon>£</InputGroupAddon>
                </InputGroup>
                <div className="py-2">
                  <Slider
                    aria-label="Monthly contribution"
                    min={0}
                    max={MAX_MONTHLY_CONTRIBUTION}
                    step={50}
                    value={sliderValue(
                      safeNumber(monthlyContribution, 0),
                      MAX_MONTHLY_CONTRIBUTION,
                    )}
                    onValueChange={(value) =>
                      setMonthlyContribution(
                        String(Array.isArray(value) ? value[0] : value),
                      )
                    }
                  />
                </div>
                <FieldDescription>
                  Added at the end of each month.
                </FieldDescription>
                <FieldError>{errors.monthlyContribution}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.rate)}>
                <FieldLabel htmlFor="interest-rate">Interest rate</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="interest-rate"
                    type="number"
                    min={0}
                    max={MAX_ANNUAL_RATE}
                    step={0.1}
                    inputMode="decimal"
                    value={annualRate}
                    onChange={(event) => setAnnualRate(event.target.value)}
                    aria-invalid={Boolean(errors.rate)}
                  />
                  <InputGroupAddon>%</InputGroupAddon>
                </InputGroup>
                <div className="py-2">
                  <Slider
                    aria-label="Annual interest rate"
                    min={0}
                    max={MAX_ANNUAL_RATE}
                    step={0.1}
                    value={sliderValue(
                      safeNumber(annualRate, 0),
                      MAX_ANNUAL_RATE,
                    )}
                    onValueChange={(value) =>
                      setAnnualRate(
                        String(Array.isArray(value) ? value[0] : value),
                      )
                    }
                  />
                </div>
                <FieldDescription>
                  The annual rate before compounding.
                </FieldDescription>
                <FieldError>{errors.rate}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.term)}>
                <FieldLabel htmlFor="term-years">Timeframe</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="term-years"
                    type="number"
                    min={1}
                    max={MAX_TERM_YEARS}
                    step={1}
                    inputMode="numeric"
                    value={termYears}
                    onChange={(event) => setTermYears(event.target.value)}
                    aria-invalid={Boolean(errors.term)}
                  />
                  <InputGroupAddon>years</InputGroupAddon>
                </InputGroup>
                <div className="py-2">
                  <Slider
                    aria-label="Timeframe in years"
                    min={1}
                    max={MAX_TERM_YEARS}
                    step={1}
                    value={sliderValue(
                      safeNumber(termYears, 1),
                      MAX_TERM_YEARS,
                    )}
                    onValueChange={(value) =>
                      setTermYears(
                        String(Array.isArray(value) ? value[0] : value),
                      )
                    }
                  />
                </div>
                <FieldDescription>How long your money grows.</FieldDescription>
                <FieldError>{errors.term}</FieldError>
              </Field>

              <Field>
                <FieldTitle id="frequency-label">
                  Compounding frequency
                </FieldTitle>
                <ToggleGroup
                  variant="outline"
                  spacing={2}
                  value={[frequency]}
                  onValueChange={(value) => {
                    const next = value[0]
                    if (
                      next === "monthly" ||
                      next === "quarterly" ||
                      next === "annually"
                    ) {
                      setFrequency(next)
                    }
                  }}
                  aria-labelledby="frequency-label"
                >
                  {frequencies.map((option) => (
                    <ToggleGroupItem key={option.value} value={option.value}>
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <FieldDescription>
                  How often interest is added to your balance.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcwIcon data-icon="inline-start" />
            Reset to defaults
          </Button>
        </CardFooter>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your estimated balance</CardTitle>
            <CardDescription>
              Based on regular contributions and compound growth.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {result ? (
              <>
                <div className="flex flex-col gap-1">
                  <p className="text-3xl font-semibold tracking-tight tabular-nums">
                    {formatGbp(result.finalBalance)}
                  </p>
                  <p className="text-muted-foreground">
                    after {result.termYears} years
                  </p>
                </div>
                <Separator />
                <ItemGroup>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Starting amount</ItemTitle>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium tabular-nums">
                        {formatGbp(result.initialAmount)}
                      </span>
                    </ItemContent>
                  </Item>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Monthly contribution</ItemTitle>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium tabular-nums">
                        {formatGbp(result.monthlyContribution)}
                      </span>
                    </ItemContent>
                  </Item>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Total paid in</ItemTitle>
                      <ItemDescription>
                        Starting amount plus deposits
                      </ItemDescription>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium tabular-nums">
                        {formatGbp(result.totalContributions)}
                      </span>
                    </ItemContent>
                  </Item>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Interest earned</ItemTitle>
                      <ItemDescription>
                        Interest on interest included
                      </ItemDescription>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium tabular-nums">
                        {formatGbp(result.totalInterest)}
                      </span>
                    </ItemContent>
                  </Item>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Compounding</ItemTitle>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium">
                        {result.frequencyLabel}
                      </span>
                    </ItemContent>
                  </Item>
                </ItemGroup>
                <Alert>
                  <InfoIcon />
                  <AlertTitle>Estimate only</AlertTitle>
                  <AlertDescription>
                    This is a guide, not financial advice. Real returns vary and
                    taxes or fees are not included.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <Alert variant="destructive">
                <InfoIcon />
                <AlertTitle>Check your details</AlertTitle>
                <AlertDescription>
                  Fix the highlighted inputs to see your estimated balance.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {result ? (
          <Card>
            <CardHeader>
              <CardTitle>Growth breakdown</CardTitle>
              <CardDescription>
                See how your deposits and interest build up year by year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[260px] w-full"
                  >
                    <AreaChart
                      accessibilityLayer
                      data={result.schedule}
                      margin={{ left: 4, right: 12, top: 12 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        width={56}
                        tickFormatter={(value: number) =>
                          `£${Math.round(value / 1000)}k`
                        }
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            formatter={(value) => formatGbp(Number(value))}
                          />
                        }
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Area
                        dataKey="contributions"
                        stackId="growth"
                        fill="var(--color-contributions)"
                        stroke="var(--color-contributions)"
                        strokeWidth={2}
                      />
                      <Area
                        dataKey="interest"
                        stackId="growth"
                        fill="var(--color-interest)"
                        stroke="var(--color-interest)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </TabsContent>
                <TabsContent value="schedule">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Paid in</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.schedule.map((entry) => (
                        <TableRow key={entry.year}>
                          <TableCell>{entry.year}</TableCell>
                          <TableCell>
                            {formatGbp(entry.contributions)}
                          </TableCell>
                          <TableCell>{formatGbp(entry.interest)}</TableCell>
                          <TableCell>{formatGbp(entry.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>
                          {formatGbp(result.totalContributions)}
                        </TableCell>
                        <TableCell>{formatGbp(result.totalInterest)}</TableCell>
                        <TableCell>{formatGbp(result.finalBalance)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

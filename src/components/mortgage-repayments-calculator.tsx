"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CircleDollarSignIcon, InfoIcon, RotateCcwIcon } from "lucide-react";

import {
  calculateMortgage,
  DEFAULTS,
  FREQUENCIES,
  formatGbp,
  formatGbpPrecise,
  MAX_ANNUAL_RATE,
  MAX_TERM_YEARS,
  type DepositMode,
  type RepaymentFrequency,
} from "@/lib/mortgage";

const chartConfig = {
  principal: {
    label: "Principal",
    color: "var(--chart-1)",
  },
  interest: {
    label: "Interest",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function parseInput(value: string) {
  return value.trim() === "" ? Number.NaN : Number(value);
}

function safeNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function finiteNumber(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function sliderValue(value: number, max: number) {
  return [Math.min(Math.max(value, 0), max)];
}

const frequencies = Object.entries(FREQUENCIES).map(([value, details]) => ({
  value: value as RepaymentFrequency,
  label: details.label,
}));

export function MortgageRepaymentsCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(DEFAULTS.propertyPrice);
  const [depositAmount, setDepositAmount] = useState(DEFAULTS.depositAmount);
  const [depositPercent, setDepositPercent] = useState(DEFAULTS.depositPercent);
  const [annualRate, setAnnualRate] = useState(DEFAULTS.annualRate);
  const [termYears, setTermYears] = useState(DEFAULTS.termYears);
  const [frequency, setFrequency] = useState<RepaymentFrequency>(
    DEFAULTS.frequency,
  );
  const [depositMode, setDepositMode] = useState<DepositMode>(
    DEFAULTS.depositMode,
  );

  const price = parseInput(propertyPrice);
  const deposit = parseInput(depositAmount);
  const percent = parseInput(depositPercent);
  const rate = parseInput(annualRate);
  const years = parseInput(termYears);

  const depositValue =
    depositMode === "amount"
      ? deposit
      : Number.isFinite(price)
        ? (price * percent) / 100
        : Number.NaN;

  const errors = {
    price:
      !Number.isFinite(price) || price <= 0
        ? "Enter a property price greater than £0."
        : undefined,
    deposit:
      !Number.isFinite(depositValue) || depositValue < 0
        ? depositMode === "amount"
          ? "Enter a deposit of £0 or more."
          : "Enter a deposit percentage of 0 or more."
        : Number.isFinite(price) && depositValue >= price
          ? "Your deposit must be less than the property price."
          : undefined,
    rate:
      !Number.isFinite(rate) || rate < 0 || rate > MAX_ANNUAL_RATE
        ? `Enter an interest rate between 0% and ${MAX_ANNUAL_RATE}%.`
        : undefined,
    term:
      !Number.isFinite(years) || years < 1 || years > MAX_TERM_YEARS
        ? `Enter a term between 1 and ${MAX_TERM_YEARS} years.`
        : undefined,
  };

  const isValid = Object.values(errors).every((error) => !error);
  const result = useMemo(
    () =>
      isValid
        ? calculateMortgage({
            propertyPrice: price,
            depositAmount: depositValue,
            annualRate: rate,
            termYears: years,
            frequency,
          })
        : null,
    [isValid, price, depositValue, rate, years, frequency],
  );

  const priceForSlider = safeNumber(propertyPrice, 0);
  const maxDeposit = Math.max(1000, Math.floor(priceForSlider));
  const depositForSlider =
    depositMode === "amount"
      ? safeNumber(depositAmount, 0)
      : safeNumber(depositPercent, 0);
  const maxDepositPercent = depositMode === "amount" ? maxDeposit : 100;
  const depositStep = depositMode === "amount" ? 1000 : 1;

  function handleDepositModeChange(value: string[]) {
    const next = value[0];
    if (next !== "amount" && next !== "percent") {
      return;
    }

    if (next === "percent" && depositMode === "amount") {
      if (Number.isFinite(price) && price > 0 && Number.isFinite(deposit)) {
        const calculated = Math.min(100, Math.max(0, (deposit / price) * 100));
        setDepositPercent(String(Number(calculated.toFixed(1))));
      }
    }

    if (next === "amount" && depositMode === "percent") {
      if (Number.isFinite(price) && Number.isFinite(percent)) {
        setDepositAmount(String(Math.round((price * percent) / 100)));
      }
    }

    setDepositMode(next);
  }

  function handleReset() {
    setPropertyPrice(DEFAULTS.propertyPrice);
    setDepositAmount(DEFAULTS.depositAmount);
    setDepositPercent(DEFAULTS.depositPercent);
    setAnnualRate(DEFAULTS.annualRate);
    setTermYears(DEFAULTS.termYears);
    setFrequency(DEFAULTS.frequency);
    setDepositMode(DEFAULTS.depositMode);
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your loan details</CardTitle>
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
            <FieldLegend className="sr-only">Loan details</FieldLegend>
            <FieldGroup>
              <Field data-invalid={Boolean(errors.price)}>
                <FieldLabel htmlFor="property-price">Property price</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="property-price"
                    type="number"
                    min={1}
                    step={1000}
                    inputMode="numeric"
                    value={propertyPrice}
                    onChange={(event) => setPropertyPrice(event.target.value)}
                    aria-invalid={Boolean(errors.price)}
                  />
                  <InputGroupAddon>£</InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  The price of the home you are buying.
                </FieldDescription>
                <FieldError>{errors.price}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.deposit)}>
                <FieldLabel htmlFor="deposit">Deposit</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="deposit"
                    type="number"
                    min={0}
                    step={depositStep}
                    inputMode="numeric"
                    value={
                      depositMode === "amount" ? depositAmount : depositPercent
                    }
                    onChange={(event) =>
                      depositMode === "amount"
                        ? setDepositAmount(event.target.value)
                        : setDepositPercent(event.target.value)
                    }
                    aria-invalid={Boolean(errors.deposit)}
                  />
                  <InputGroupAddon>
                    {depositMode === "amount" ? "£" : "%"}
                  </InputGroupAddon>
                </InputGroup>
                <div className="py-2">
                  <Slider
                    aria-label={
                      depositMode === "amount"
                        ? "Deposit amount"
                        : "Deposit percentage"
                    }
                    min={0}
                    max={maxDepositPercent}
                    step={depositStep}
                    value={sliderValue(depositForSlider, maxDepositPercent)}
                    onValueChange={(value) => {
                      const next = Array.isArray(value) ? value[0] : value;
                      const text = String(next);
                      if (depositMode === "amount") {
                        setDepositAmount(text);
                      } else {
                        setDepositPercent(text);
                      }
                    }}
                  />
                </div>
                <ToggleGroup
                  variant="outline"
                  size="sm"
                  spacing={2}
                  value={[depositMode]}
                  onValueChange={handleDepositModeChange}
                  aria-label="Deposit unit"
                >
                  <ToggleGroupItem value="amount">£ amount</ToggleGroupItem>
                  <ToggleGroupItem value="percent">% of price</ToggleGroupItem>
                </ToggleGroup>
                <FieldDescription>
                  {depositMode === "amount"
                    ? `${formatGbp(finiteNumber(depositValue, 0))} of your own money.`
                    : `${finiteNumber(depositValue, 0).toFixed(1)}% of the property price.`}
                </FieldDescription>
                <FieldError>{errors.deposit}</FieldError>
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
                  The annual rate for your mortgage.
                </FieldDescription>
                <FieldError>{errors.rate}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.term)}>
                <FieldLabel htmlFor="term-years">Mortgage term</FieldLabel>
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
                    aria-label="Mortgage term in years"
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
                <FieldDescription>
                  How long you will take to repay.
                </FieldDescription>
                <FieldError>{errors.term}</FieldError>
              </Field>

              <Field>
                <FieldTitle id="frequency-label">
                  Repayment frequency
                </FieldTitle>
                <ToggleGroup
                  variant="outline"
                  spacing={2}
                  value={[frequency]}
                  onValueChange={(value) => {
                    const next = value[0];
                    if (
                      next === "monthly" ||
                      next === "fortnightly" ||
                      next === "weekly"
                    ) {
                      setFrequency(next);
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
                  How often you make a repayment.
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
            <CardTitle>Your estimated repayment</CardTitle>
            <CardDescription>
              Based on a level repayment over the full term.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {result ? (
              <>
                <div className="flex flex-col gap-1">
                  <p className="text-3xl font-semibold tracking-tight tabular-nums">
                    {formatGbpPrecise(result.periodicPayment)}
                  </p>
                  <p className="text-muted-foreground">
                    per {result.periodLabel}
                  </p>
                </div>
                <Separator />
                <ItemGroup>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Loan amount</ItemTitle>
                      <ItemDescription>Price less your deposit</ItemDescription>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium tabular-nums">
                        {formatGbp(result.loanAmount)}
                      </span>
                    </ItemContent>
                  </Item>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Annual interest rate</ItemTitle>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium tabular-nums">{rate}%</span>
                    </ItemContent>
                  </Item>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Total interest</ItemTitle>
                      <ItemDescription>Over the full term</ItemDescription>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium tabular-nums">
                        {formatGbp(result.totalInterest)}
                      </span>
                    </ItemContent>
                  </Item>
                  <Item variant="muted">
                    <ItemContent>
                      <ItemTitle>Total repaid</ItemTitle>
                      <ItemDescription>Principal plus interest</ItemDescription>
                    </ItemContent>
                    <ItemContent className="flex-none items-end">
                      <span className="font-medium tabular-nums">
                        {formatGbp(result.totalRepaid)}
                      </span>
                    </ItemContent>
                  </Item>
                </ItemGroup>
                <Alert>
                  <InfoIcon />
                  <AlertTitle>Estimate only</AlertTitle>
                  <AlertDescription>
                    This is a guide, not financial advice. Your lender may
                    include fees or use a different calculation.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <Alert variant="destructive">
                <InfoIcon />
                <AlertTitle>Check your details</AlertTitle>
                <AlertDescription>
                  Fix the highlighted inputs to see your estimated repayment.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {result ? (
          <Card>
            <CardHeader>
              <CardTitle>Repayment breakdown</CardTitle>
              <CardDescription>
                See how each year splits between paying down the loan and paying
                interest.
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
                    <BarChart
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
                      <Bar
                        dataKey="principal"
                        stackId="repayment"
                        fill="var(--color-principal)"
                      />
                      <Bar
                        dataKey="interest"
                        stackId="repayment"
                        fill="var(--color-interest)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </TabsContent>
                <TabsContent value="schedule">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.schedule.map((entry) => (
                        <TableRow key={entry.year}>
                          <TableCell>{entry.year}</TableCell>
                          <TableCell>{formatGbp(entry.payments)}</TableCell>
                          <TableCell>{formatGbp(entry.principal)}</TableCell>
                          <TableCell>{formatGbp(entry.interest)}</TableCell>
                          <TableCell>{formatGbp(entry.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{formatGbp(result.totalRepaid)}</TableCell>
                        <TableCell>{formatGbp(result.loanAmount)}</TableCell>
                        <TableCell>{formatGbp(result.totalInterest)}</TableCell>
                        <TableCell>{formatGbp(0)}</TableCell>
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
  );
}

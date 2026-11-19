import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CalculatorIcon, HouseIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MortgageRepaymentsCalculator } from "@/components/mortgage-repayments-calculator";

export const metadata: Metadata = {
  title: "Mortgage Repayments Calculator | FinCalc",
  description:
    "Estimate your mortgage repayments in pounds, see the total interest you will pay and explore a year-by-year repayment breakdown.",
};

export default function MortgageRepaymentsCalculatorPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="w-full">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CalculatorIcon />
            FinCalc
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Button
              variant="ghost"
              render={<Link href="/#calculators" />}
              nativeButton={false}
            >
              Calculators
            </Button>
            <Button
              variant="ghost"
              render={<Link href="/#why-fincalc" />}
              nativeButton={false}
            >
              Why FinCalc
            </Button>
            <Button
              variant="ghost"
              render={<Link href="/#faq" />}
              nativeButton={false}
            >
              FAQ
            </Button>
          </nav>
          <Button render={<Link href="/" />} nativeButton={false}>
            All calculators
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        <Separator />
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-20">
          <div className="flex flex-col gap-5">
            <Badge variant="secondary" className="w-fit">
              <HouseIcon data-icon="inline-start" />
              Home
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Mortgage repayments calculator
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
              Find out what your home loan could cost each month, how much
              interest you will pay and where your money goes over time.
            </p>
          </div>
        </section>

        <section className="w-full bg-muted/30 py-14 sm:py-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <MortgageRepaymentsCalculator />
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <Badge variant="outline">FAQ</Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Mortgage questions, answered.
              </h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Good to know</CardTitle>
                <CardDescription>
                  A few things to keep in mind as you plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion defaultValue={["how-calculated"]}>
                  <AccordionItem value="how-calculated">
                    <AccordionTrigger>
                      How is my repayment calculated?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        We spread the amount you borrow across your chosen term
                        using a level repayment, with interest charged on the
                        balance you still owe. Changing the rate or term
                        recalculates the estimate instantly.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="deposit">
                    <AccordionTrigger>
                      Why does my deposit matter so much?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        A larger deposit reduces the amount you need to borrow.
                        That lowers each repayment and can also help you qualify
                        for a better interest rate.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="rate-changes">
                    <AccordionTrigger>
                      Will my repayments stay the same?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Not always. If your lender changes its rate, your
                        repayments can change too. Try a few different rates to
                        see how much room you have in your budget.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="advice">
                    <AccordionTrigger>
                      Are these results financial advice?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        No. This calculator gives an estimate to help you plan.
                        Actual offers may include fees and other costs, so
                        always check the details with your lender.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="w-full">
        <Separator />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <CalculatorIcon />
            FinCalc
          </span>
          <span>Simple tools for confident money decisions.</span>
        </div>
      </footer>
    </div>
  );
}

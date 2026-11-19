import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, CalculatorIcon, TrendingUpIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CompoundInterestCalculator } from "@/components/compound-interest-calculator"

export const metadata: Metadata = {
  title: "Compound Interest Calculator | FinCalc",
  description:
    "See how regular savings grow with compound interest, with a clear year-by-year breakdown of your deposits and interest earned.",
}

export default function CompoundInterestCalculatorPage() {
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
              <TrendingUpIcon data-icon="inline-start" />
              Savings
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Compound interest calculator
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
              See what regular saving could become, how much interest you could
              earn and how your balance grows over time.
            </p>
          </div>
        </section>

        <section className="w-full bg-muted/30 py-14 sm:py-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <CompoundInterestCalculator />
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <Badge variant="outline">FAQ</Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Savings questions, answered.
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
                      How is my balance calculated?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        We add your monthly contribution at the end of each
                        month and apply interest to the balance you have built
                        up. Changing the rate, timeframe or compounding
                        frequency recalculates the estimate instantly.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="compounding">
                    <AccordionTrigger>
                      What does compounding frequency mean?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        It is how often interest is added to your balance. More
                        frequent compounding means interest starts earning its
                        own interest sooner. We convert your chosen frequency to
                        an equivalent monthly rate for the projection.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="contributions">
                    <AccordionTrigger>
                      Why do regular contributions matter?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        The sooner you pay in, the longer that money has to
                        grow. Try increasing your monthly contribution to see
                        how much difference even a small amount can make over a
                        longer timeframe.
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
                        It assumes a steady rate and does not include tax,
                        inflation or fees, so actual returns may differ.
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
  )
}

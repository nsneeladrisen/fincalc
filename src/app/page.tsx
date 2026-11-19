import Link from "next/link";
import {
  ArrowRightIcon,
  CalculatorIcon,
  ChartNoAxesCombinedIcon,
  CheckIcon,
  CircleDollarSignIcon,
  HouseIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";

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
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";

export default function Home() {
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
              render={<Link href="#calculators" />}
              nativeButton={false}
            >
              Calculators
            </Button>
            <Button
              variant="ghost"
              render={<Link href="#why-fincalc" />}
              nativeButton={false}
            >
              Why FinCalc
            </Button>
            <Button
              variant="ghost"
              render={<Link href="#faq" />}
              nativeButton={false}
            >
              FAQ
            </Button>
          </nav>
          <Button render={<Link href="#calculators" />} nativeButton={false}>
            Get started
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        <Separator />
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge variant="secondary">
              <SparklesIcon data-icon="inline-start" />
              Two focused financial tools
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Big money decisions, made simple.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
              Plan a home loan or watch your savings grow. FinCalc gives you
              clear, instant answers with two calculators built for everyday
              decisions.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                render={<Link href="#mortgage-repayment" />}
                nativeButton={false}
              >
                Mortgage repayment calculator
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="#compound-interest" />}
                nativeButton={false}
              >
                Compound interest calculator
              </Button>
            </div>
          </div>
        </section>

        <section id="calculators" className="scroll-mt-16 bg-muted/30 py-20">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
            <div className="flex flex-col gap-3">
              <Badge variant="outline" className="w-fit">
                The calculator toolkit
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need to plan what&apos;s next.
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                Two calculators, no spreadsheets and no guesswork — just the
                numbers that matter to you.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card id="mortgage-repayment" className="scroll-mt-20">
                <CardHeader>
                  <CardAction>
                    <Badge variant="secondary">
                      <HouseIcon data-icon="inline-start" />
                      Home
                    </Badge>
                  </CardAction>
                  <CardTitle>Mortgage repayment calculator</CardTitle>
                  <CardDescription>
                    See what a home really costs each month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemGroup>
                    <Item>
                      <ItemMedia variant="icon">
                        <CircleDollarSignIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Monthly repayment</ItemTitle>
                        <ItemDescription>
                          See your estimated payment in seconds.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item>
                      <ItemMedia variant="icon">
                        <ChartNoAxesCombinedIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Principal vs. interest</ItemTitle>
                        <ItemDescription>
                          Understand where each payment goes.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item>
                      <ItemMedia variant="icon">
                        <CheckIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>What-if scenarios</ItemTitle>
                        <ItemDescription>
                          Change the rate or term and compare instantly.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </CardContent>
                <CardFooter className="gap-2">
                  <Badge variant="outline">Free to use</Badge>
                  <span className="text-muted-foreground">
                    No account required
                  </span>
                </CardFooter>
              </Card>

              <Card id="compound-interest" className="scroll-mt-20">
                <CardHeader>
                  <CardAction>
                    <Badge variant="secondary">
                      <TrendingUpIcon data-icon="inline-start" />
                      Savings
                    </Badge>
                  </CardAction>
                  <CardTitle>Compound interest calculator</CardTitle>
                  <CardDescription>
                    Find out what your savings can become.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemGroup>
                    <Item>
                      <ItemMedia variant="icon">
                        <TrendingUpIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Long-term growth</ItemTitle>
                        <ItemDescription>
                          Project savings with regular contributions.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item>
                      <ItemMedia variant="icon">
                        <ChartNoAxesCombinedIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Compounding effect</ItemTitle>
                        <ItemDescription>
                          See how interest builds on interest over time.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item>
                      <ItemMedia variant="icon">
                        <CheckIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Flexible inputs</ItemTitle>
                        <ItemDescription>
                          Adjust the rate, deposits and timeframe.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </CardContent>
                <CardFooter className="gap-2">
                  <Badge variant="outline">Free to use</Badge>
                  <span className="text-muted-foreground">
                    No account required
                  </span>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="why-fincalc" className="scroll-mt-16 py-20">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
            <div className="flex flex-col gap-3">
              <Badge variant="outline" className="w-fit">
                Why FinCalc
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Clear answers, without the clutter.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card size="sm">
                <CardHeader>
                  <CardTitle>Fast by design</CardTitle>
                  <CardDescription>
                    Enter a few numbers and get results right away.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card size="sm">
                <CardHeader>
                  <CardTitle>Easy to understand</CardTitle>
                  <CardDescription>
                    Plain-language breakdowns you can actually use.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card size="sm">
                <CardHeader>
                  <CardTitle>Yours to explore</CardTitle>
                  <CardDescription>
                    Tweak any input and see how the picture changes.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-16 bg-muted/30 py-20">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
            <div className="flex flex-col gap-3">
              <Badge variant="outline" className="w-fit">
                How it works
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Three steps to a better plan.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card size="sm">
                <CardHeader>
                  <CardAction>
                    <Badge variant="secondary">01</Badge>
                  </CardAction>
                  <CardTitle>Pick a calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Choose the mortgage or compound interest tool.
                  </p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardHeader>
                  <CardAction>
                    <Badge variant="secondary">02</Badge>
                  </CardAction>
                  <CardTitle>Enter your numbers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add the details that match your situation.
                  </p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardHeader>
                  <CardAction>
                    <Badge variant="secondary">03</Badge>
                  </CardAction>
                  <CardTitle>Read the results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Use the breakdown to decide what comes next.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <Badge variant="outline">FAQ</Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Questions, answered.
              </h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Common questions</CardTitle>
                <CardDescription>
                  A few things people ask before they start.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion defaultValue={["what-can-i-calculate"]}>
                  <AccordionItem value="what-can-i-calculate">
                    <AccordionTrigger>
                      What can I calculate with FinCalc?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Two things: estimate your monthly mortgage repayment and
                        see how your savings can grow with compound interest.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="no-account">
                    <AccordionTrigger>
                      Do I need to create an account?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        No. Pick a calculator, enter your numbers and get your
                        results straight away.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="compare-scenarios">
                    <AccordionTrigger>
                      Can I compare different scenarios?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Yes. Change the inputs as often as you like to see how a
                        different rate, term or contribution affects the result.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="advice">
                    <AccordionTrigger>
                      Are the results financial advice?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        No. The calculators provide estimates to help you plan.
                        They are not advice, and actual offers may differ.
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

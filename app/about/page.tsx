import type { Metadata } from "next"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About | attend75",
  description:
    "Learn how attend75 helps students stay on top of attendance goals with clarity and flexibility.",
}

const stats = [
  { label: "Students planning ahead", value: "12,000+" },
  { label: "Attendance insights generated", value: "85K" },
  { label: "Campuses using attend75", value: "40+" },
]

const milestones = [
  {
    title: "Built for real semester stress",
    body:
      "Attendance anxiety usually spikes right before internals. We designed attend75 so you can simulate every scenario—medical certificates, duty leaves, bunk buffers—before crunch time hits.",
  },
  {
    title: "Leaves that behave like real policies",
    body:
      "Every institute applies medical or duty leaves differently. Our calculator mirrors those rules with configurable criteria, so the numbers you see match the way your department applies them.",
  },
  {
    title: "Actionable next steps",
    body:
      "Instead of raw percentages, attend75 tells you exactly how many classes to attend or skip next. No more mental math; just a clear path to 75%.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16">
      <header className="space-y-4 text-start">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          about attend75
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Less guessing, more control over your attendance.
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">
          attend75 was created for students who juggle academics, clubs, travel,
          and health while still needing to hit that magic 75% mark. We turn
          raw numbers into decisions you can act on.
        </p>
      </header>

      <section className="grid gap-6 rounded-2xl border bg-muted/30 p-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <p className="text-3xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Why we built this</h2>
          <p className="text-muted-foreground">
            If you have ever tried juggling leave approvals, remedial classes,
            and last-minute unit tests, you know that spreadsheets break down
            quickly. attend75 keeps things honest, flexible, and fast.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {milestones.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-background/80 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">What&apos;s next for attend75?</h2>
        <p className="text-muted-foreground">
          We&apos;re working on exporting schedules, collaborating with mentors, and
          sharing attendance plans with your classmates. If you have feedback or
          want to bring attend75 to your campus officially, reach out.
        </p>
        <Link
          href="mailto:hello@attend75.com"
          className="inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          hello@attend75.com
        </Link>
      </section>
    </div>
  )
}


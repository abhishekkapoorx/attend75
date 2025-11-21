
"use client"

import { Formik, Form, type FormikErrors } from "formik"
import * as Yup from "yup"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

type LeaveConfig = {
  leaves: number
  criterion: number
  onlyRequired: boolean
}

type LeaveKey = "medicalLeaves" | "dutyLeaves"

type AttendanceFormValues = {
  totalClasses: number
  attendedClasses: number
  targetPercentage: number
  medicalLeaves: LeaveConfig
  dutyLeaves: LeaveConfig
}

const leaveCriteriaOptions = [0, 50, 60, 65, 70, 75, 80, 85, 90, 95]

const AttendanceSchema = Yup.object({
  totalClasses: Yup.number()
    .min(1, "Enter at least 1 class")
    .required("Total classes are required"),
  attendedClasses: Yup.number()
    .min(0, "Cannot be negative")
    .test(
      "attended-not-greater",
      "Attended classes cannot exceed total classes",
      function (value) {
        const { totalClasses } = this.parent
        return value === undefined || totalClasses === undefined
          ? true
          : value <= totalClasses
      }
    )
    .required("Attended classes are required"),
  targetPercentage: Yup.number()
    .min(1, "Target must be greater than 0")
    .max(100, "Target cannot exceed 100")
    .required("Target percentage is required"),
  medicalLeaves: Yup.object({
    leaves: Yup.number().min(0, "Cannot be negative").required(),
    criterion: Yup.number()
      .oneOf(leaveCriteriaOptions, "Invalid option")
      .required(),
    onlyRequired: Yup.boolean().required(),
  }),
  dutyLeaves: Yup.object({
    leaves: Yup.number().min(0, "Cannot be negative").required(),
    criterion: Yup.number()
      .oneOf(leaveCriteriaOptions, "Invalid option")
      .required(),
    onlyRequired: Yup.boolean().required(),
  }),
})

const initialValues: AttendanceFormValues = {
  totalClasses: 0,
  attendedClasses: 0,
  targetPercentage: 75,
  medicalLeaves: { leaves: 0, criterion: 0, onlyRequired: true },
  dutyLeaves: { leaves: 0, criterion: 0, onlyRequired: true },
}

const leaveSections: Array<{
  key: LeaveKey
  title: string
  description: string
}> = [
  {
    key: "medicalLeaves",
    title: "Medical Leaves",
    description:
      "Count medical certificates as attended once the selected attendance criterion is met.",
  },
  {
    key: "dutyLeaves",
    title: "Duty Leaves",
    description:
      "Duty leaves are applied outside attended classes and boost your percentage after the criterion.",
  },
] as const

const validateAttendance = (
  values: AttendanceFormValues
): FormikErrors<AttendanceFormValues> => {
  const errors: FormikErrors<AttendanceFormValues> = {}
  const missed = Math.max(0, values.totalClasses - values.attendedClasses)
  const totalLeaves = values.medicalLeaves.leaves + values.dutyLeaves.leaves

  if (totalLeaves > missed) {
    const message = `Total leaves (${totalLeaves}) exceed missed classes (${missed}).`
    errors.medicalLeaves = {
      ...(errors.medicalLeaves ?? {}),
      leaves: message,
    }
    errors.dutyLeaves = {
      ...(errors.dutyLeaves ?? {}),
      leaves: message,
    }
  }

  return errors
}

type LeaveComputationResult = {
  applied: number
  remainingGap: number
}

function getAppliedLeaves(
  leave: LeaveConfig,
  currentPercentage: number,
  rawBelowTarget: boolean,
  remainingGap: number
): LeaveComputationResult {
  if (currentPercentage < leave.criterion) {
    return { applied: 0, remainingGap }
  }

  if (leave.criterion !== 0 && leave.onlyRequired) {
    if (!rawBelowTarget || remainingGap <= 0) {
      return { applied: 0, remainingGap }
    }
    const applied = Math.min(leave.leaves, remainingGap)
    return { applied, remainingGap: remainingGap - applied }
  }

  const applied = leave.leaves
  return { applied, remainingGap: Math.max(0, remainingGap - applied) }
}

function getRequiredAttendanceDelta(
  totalClasses: number,
  effectiveAttended: number,
  targetPercentage: number
) {
  const target = targetPercentage / 100

  if (target <= 0 || totalClasses <= 0) {
    return { classesToAttend: 0, classesToBunk: 0 }
  }

  if (target >= 1) {
    return {
      classesToAttend: Math.max(0, totalClasses - effectiveAttended),
      classesToBunk: 0,
    }
  }

  const current = effectiveAttended / totalClasses

  const classesToAttend =
    current >= target
      ? 0
      : Math.max(
          0,
          Math.ceil((target * totalClasses - effectiveAttended) / (1 - target))
        )

  const classesToBunk = Math.max(
    0,
    Math.floor(effectiveAttended / target - totalClasses)
  )

  return { classesToAttend, classesToBunk }
}

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="space-y-3 text-start flex flex-col items-start">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          attend75
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Attendance Calculator
        </h1>
        <p className="text-muted-foreground">
          Track your progress, account for medical and duty leaves, and know
          exactly how many classes to attend or skip to maintain your target
          percentage.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={AttendanceSchema}
        onSubmit={() => void 0}
        validateOnMount
        validate={validateAttendance}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          handleBlur,
          setFieldTouched,
          isValid,
        }) => {
          const currentPercentage =
            values.totalClasses > 0
              ? (values.attendedClasses / values.totalClasses) * 100
              : 0
          const rawBelowTarget =
            values.totalClasses > 0
              ? currentPercentage < values.targetPercentage
              : false
          const targetRatio = values.totalClasses
            ? values.targetPercentage / 100
            : 0
          const rawDeficit = values.totalClasses
            ? Math.max(
                0,
                Math.ceil(targetRatio * values.totalClasses) -
                  values.attendedClasses
              )
            : 0
          const medicalResult = getAppliedLeaves(
            values.medicalLeaves,
            currentPercentage,
            rawBelowTarget,
            rawDeficit
          )
          const dutyResult = getAppliedLeaves(
            values.dutyLeaves,
            currentPercentage,
            rawBelowTarget,
            medicalResult.remainingGap
          )

          const medicalApplied = medicalResult.applied
          const dutyApplied = dutyResult.applied
          const totalAppliedLeaves = medicalApplied + dutyApplied
          const effectiveAttended = values.attendedClasses + totalAppliedLeaves
          const effectivePercentage =
            values.totalClasses > 0
              ? (effectiveAttended / values.totalClasses) * 100
              : 0

          const { classesToAttend, classesToBunk } = getRequiredAttendanceDelta(
            values.totalClasses,
            effectiveAttended,
            values.targetPercentage
          )
          const effectiveAttendanceColor =
            effectivePercentage >= values.targetPercentage
              ? "text-emerald-500"
              : "text-destructive"
          const isAttendCard = classesToAttend > 0
          const cardValue = isAttendCard ? classesToAttend : classesToBunk
          const cardTitle = isAttendCard ? "Need to Attend" : "Safe to Bunk"
          const cardBorder = isAttendCard
            ? "border-red-500/40 bg-red-500/10"
            : "border-green-500/40 bg-green-500/10"
          const cardValueColor = isAttendCard ? "text-red-500" : "text-green-500"
          const cardDescription = isAttendCard
            ? `Attend ${cardValue} more class${
                cardValue === 1 ? "" : "es"
              } consecutively to hit ${values.targetPercentage}%.`
            : `You can safely skip ${cardValue} class${
                cardValue === 1 ? "" : "es"
              } without falling below ${values.targetPercentage}%.`

          return (
            <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
              <Form className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Details</CardTitle>
                    <CardDescription>
                      Provide your current totals and the target attendance
                      percentage you want to maintain.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="totalClasses">Total Classes</Label>
                      <Input
                        id="totalClasses"
                        name="totalClasses"
                        type="number"
                        min={0}
                        value={values.totalClasses}
                        onBlur={handleBlur}
                        onChange={(event) => {
                          const nextTotal = Math.max(
                            0,
                            Number(event.target.value) || 0
                          )
                          setFieldValue("totalClasses", nextTotal)
                          if (values.attendedClasses > nextTotal) {
                            setFieldValue("attendedClasses", nextTotal)
                          }
                        }}
                      />
                      {touched.totalClasses && errors.totalClasses ? (
                        <p className="text-sm text-destructive">
                          {errors.totalClasses}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attendedClasses">Attended Classes</Label>
                      <Input
                        id="attendedClasses"
                        name="attendedClasses"
                        type="number"
                        min={0}
                        value={values.attendedClasses}
                        onBlur={handleBlur}
                        onChange={(event) => {
                          const nextAttended = Math.max(
                            0,
                            Number(event.target.value) || 0
                          )
                          setFieldValue(
                            "attendedClasses",
                            Math.min(nextAttended, values.totalClasses)
                          )
                        }}
                      />
                      {touched.attendedClasses && errors.attendedClasses ? (
                        <p className="text-sm text-destructive">
                          {errors.attendedClasses}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetPercentage">
                        Target Percentage (%)
                      </Label>
                      <Input
                        id="targetPercentage"
                        name="targetPercentage"
                        type="number"
                        min={1}
                        max={100}
                        value={values.targetPercentage}
                        onBlur={handleBlur}
                        onChange={(event) =>
                          setFieldValue(
                            "targetPercentage",
                            Number(event.target.value) || 0
                          )
                        }
                      />
                      {touched.targetPercentage && errors.targetPercentage ? (
                        <p className="text-sm text-destructive">
                          {errors.targetPercentage}
                        </p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="gap-2">
                    <CardTitle>Leave Allowances</CardTitle>
                    <CardDescription>
                      Leaves are applied outside attended classes. They count as
                      attendance credits only after your raw attendance meets the
                      criterion you set.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {leaveSections.map((section, index) => {
                      const leaveValues = values[section.key]
                      const leaveErrors = errors[section.key] as
                        | Partial<Record<keyof LeaveConfig, string>>
                        | undefined
                      const leaveTouched = touched[section.key] as
                        | Partial<Record<keyof LeaveConfig, boolean>>
                        | undefined

                      return (
                        <div key={section.key} className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {section.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${section.key}-leaves`}>
                              Leaves (classes)
                            </Label>
                            <Input
                              id={`${section.key}-leaves`}
                              name={`${section.key}.leaves`}
                              type="number"
                              min={0}
                              value={leaveValues.leaves}
                              onBlur={handleBlur}
                              onChange={(event) =>
                                setFieldValue(
                                  `${section.key}.leaves`,
                                  Number(event.target.value) || 0
                                )
                              }
                            />
                            {leaveTouched?.leaves && leaveErrors?.leaves ? (
                              <p className="text-sm text-destructive">
                                {leaveErrors.leaves}
                              </p>
                            ) : null}
                          </div>

                          <div className="space-y-2">
                            <Label>Application Criterion</Label>
                            <Select
                              value={leaveValues.criterion.toString()}
                              onValueChange={(selected) => {
                                setFieldValue(
                                  `${section.key}.criterion`,
                                  Number(selected)
                                )
                                setFieldTouched(
                                  `${section.key}.criterion`,
                                  true,
                                  false
                                )
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select criterion" />
                              </SelectTrigger>
                              <SelectContent>
                                {leaveCriteriaOptions.map((option) => (
                                  <SelectItem
                                    key={option}
                                    value={option.toString()}
                                  >
                                    {option === 0
                                      ? "Apply immediately"
                                      : `Apply when ≥ ${option}%`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {leaveTouched?.criterion &&
                            leaveErrors?.criterion ? (
                              <p className="text-sm text-destructive">
                                {leaveErrors.criterion}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {leaveValues.criterion !== 0 && (
                          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Only required</p>
                              <p className="text-xs text-muted-foreground">
                                Use these leaves only when your raw attendance is below your target.
                              </p>
                            </div>
                            <Switch
                              checked={leaveValues.onlyRequired}
                              onCheckedChange={(checked) =>
                                setFieldValue(`${section.key}.onlyRequired`, checked)
                              }
                              aria-label={`${section.title} only required toggle`}
                            />
                          </div>
                        )}
                        {index === 0 && <Separator />}
                      </div>
                      )
                    })}
                  </CardContent>
                </Card>

              </Form>

              {isValid ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Snapshot</CardTitle>
                      <CardDescription>
                        Raw vs. effective attendance with leaves excluded from
                        attended classes until eligible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Raw Attendance
                        </p>
                        <p className="text-xl font-semibold">
                          {currentPercentage.toFixed(2)}%
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Effective Attendance
                        </p>
                        <p
                          className={`text-xl font-semibold ${effectiveAttendanceColor}`}
                        >
                          {effectivePercentage.toFixed(2)}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-sm font-medium">
                          Leaves Applied Right Now
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>
                            Medical: {medicalApplied} of{" "}
                            {values.medicalLeaves.leaves}
                          </li>
                          <li>
                            Duty: {dutyApplied} of {values.dutyLeaves.leaves}
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>What&apos;s Next?</CardTitle>
                      <CardDescription>
                        Actionable guidance based on your current attendance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`rounded-lg border p-4 ${cardBorder}`}
                      >
                        <p className="text-sm font-medium text-muted-foreground">
                          {cardTitle}
                        </p>
                        <p className={`text-3xl font-bold ${cardValueColor}`}>
                          {cardValue}{" "}
                          <span className="text-base font-medium text-muted-foreground">
                            classes
                          </span>
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {cardDescription}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </div>
          )
        }}
      </Formik>
    </div>
  )
}

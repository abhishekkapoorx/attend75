'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Google Analytics tracking ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Types for Google Analytics events
interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// Google Analytics functions
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export const event = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Custom events for attendance calculator
export const trackAttendanceCalculation = (data: {
  totalClasses: number
  attendedClasses: number
  targetPercentage: number
  hasLeaves: boolean
}) => {
  event({
    action: 'calculate_attendance',
    category: 'attendance_calculator',
    label: `target_${data.targetPercentage}%`,
    value: data.totalClasses,
  })

  // Track if user has leaves configured
  if (data.hasLeaves) {
    event({
      action: 'uses_leaves',
      category: 'attendance_calculator',
      label: 'medical_or_duty_leaves',
    })
  }

  // Track attendance status
  const currentPercentage = (data.attendedClasses / data.totalClasses) * 100
  const status = currentPercentage >= data.targetPercentage ? 'above_target' : 'below_target'
  
  event({
    action: 'attendance_status',
    category: 'attendance_calculator',
    label: status,
    value: Math.round(currentPercentage),
  })
}

export const trackLeaveConfiguration = (leaveType: 'medical' | 'duty', leaves: number, criterion: number) => {
  event({
    action: 'configure_leaves',
    category: 'leave_management',
    label: `${leaveType}_leaves_${criterion}%_criterion`,
    value: leaves,
  })
}

export const trackSafeBunking = (safeBunkClasses: number) => {
  event({
    action: 'safe_bunking_calculated',
    category: 'attendance_calculator',
    label: safeBunkClasses > 0 ? 'can_bunk' : 'cannot_bunk',
    value: safeBunkClasses,
  })
}

export const trackThemeChange = (theme: string) => {
  event({
    action: 'theme_change',
    category: 'user_preference',
    label: theme,
  })
}

// Analytics component for tracking page views
export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (GA_TRACKING_ID) {
      const url = pathname + searchParams.toString()
      pageview(url)
    }
  }, [pathname, searchParams])

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

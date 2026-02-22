import { CalendarDate, DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
import { computed, ref, shallowRef, watch, type Ref } from "vue"

export type Mode = "difference" | "calculate"
export type Unit = "days" | "weeks" | "months" | "years"
export type Direction = "forward" | "backward"

interface DateResult {
  days: number
  workingDays: number
  weeks: number
  months: number
  years: number
}

const unitAdders: Record<Unit, (d: Date, v: number) => void> = {
  days: (d, v) => d.setDate(d.getDate() + v),
  weeks: (d, v) => d.setDate(d.getDate() + v * 7),
  months: (d, v) => d.setMonth(d.getMonth() + v),
  years: (d, v) => d.setFullYear(d.getFullYear() + v)
}

const toJsDate = (value: CalendarDate | null): Date | null => {
  return value ? value.toDate(getLocalTimeZone()) : null
}

const countWorkingDays = (start: Date, end: Date): number => {
  let count = 0
  const current = new Date(start)
  current.setHours(0, 0, 0, 0)
  const last = new Date(end)
  last.setHours(0, 0, 0, 0)

  while (current <= last) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) count++
    current.setDate(current.getDate() + 1)
  }

  return count
}

const getDiffData = (start: Date, end: Date): DateResult => {
  const [min, max] = start < end ? [start, end] : [end, start]

  const diffTime = max.getTime() - min.getTime()
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const yearsDiff = max.getFullYear() - min.getFullYear()
  const monthsDiff = yearsDiff * 12 + (max.getMonth() - min.getMonth())

  return {
    days,
    workingDays: countWorkingDays(min, max),
    weeks: Math.floor(days / 7),
    months: Math.abs(monthsDiff),
    years: Math.abs(yearsDiff)
  }
}

export const useDateCalculator = (locale: Ref<string>) => {
  const startDate = shallowRef<CalendarDate | null>(today(getLocalTimeZone()))
  const endDate = shallowRef<CalendarDate | null>(null)
  const baseDate = shallowRef<CalendarDate | null>(today(getLocalTimeZone()))
  const mode = ref<Mode>("difference")
  const amount = ref<number>(0)
  const unit = ref<Unit>("days")
  const direction = ref<Direction>("forward")

  const df = computed(() => new DateFormatter(locale.value, { dateStyle: "medium" }))
  const intlDf = computed(() => {
    return new Intl.DateTimeFormat(locale.value, {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  })

  const calculatedDate = computed<Date | null>(() => {
    const base = baseDate.value?.toDate(getLocalTimeZone())
    if (mode.value !== "calculate" || !base || !amount.value) return null

    const target = new Date(base)
    const val = amount.value * (direction.value === "forward" ? 1 : -1)
    unitAdders[unit.value](target, val)
    return target
  })

  const result = computed<DateResult | null>(() => {
    if (mode.value === "difference") {
      const start = toJsDate(startDate.value)
      const end = toJsDate(endDate.value)
      if (!start || !end) return null
      return getDiffData(start, end)
    }

    const base = toJsDate(baseDate.value)
    if (!base || !calculatedDate.value) return null
    return getDiffData(base, calculatedDate.value)
  })

  const handleDateSelect = (key: "startDate" | "endDate", val: unknown) => {
    const selectedDate = val ? (val as CalendarDate) : null

    if (key === "startDate") {
      startDate.value = selectedDate
    } else {
      endDate.value = selectedDate
    }
  }

  const clearAll = () => {
    startDate.value = today(getLocalTimeZone())
    endDate.value = null
    baseDate.value = today(getLocalTimeZone())
    amount.value = 0
    unit.value = "days"
    direction.value = "forward"
  }

  watch(mode, (newMode) => {
    if (newMode === "difference") {
      baseDate.value = null
      amount.value = 0
    } else {
      startDate.value = null
      endDate.value = null
    }
  })

  return {
    startDate,
    endDate,
    baseDate,
    mode,
    amount,
    unit,
    direction,
    df,
    intlDf,
    calculatedDate,
    result,
    toJsDate,
    handleDateSelect,
    clearAll
  }
}

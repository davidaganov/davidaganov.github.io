import { computed, ref } from "vue"

export type TimeSegment = "hours" | "minutes" | "seconds"
export type Operation = "add" | "subtract" | "multiply" | "divide"
export type MaxMode = "off" | "12h" | "24h"

const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = 3600
const MAX_TIME_UNIT = 59
const HALF_DAY_SECONDS = 12 * SECONDS_IN_HOUR
const FULL_DAY_SECONDS = 24 * SECONDS_IN_HOUR

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const toSafeInt = (value: string): number => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeModulo = (value: number, modulo: number): number => {
  return ((value % modulo) + modulo) % modulo
}

const normalizeByMaxMode = (totalSeconds: number, maxMode: MaxMode): number => {
  if (maxMode === "off") return totalSeconds

  const modulo = maxMode === "12h" ? HALF_DAY_SECONDS : FULL_DAY_SECONDS
  return normalizeModulo(totalSeconds, modulo)
}

const resolveOperation = (left: number, right: number, operation: Operation): number => {
  switch (operation) {
    case "add":
      return left + right
    case "subtract":
      return left - right
    case "multiply":
      return Math.round(left * right)
    case "divide": {
      if (right === 0) throw new Error("division_by_zero")
      return Math.trunc(left / right)
    }
  }
}

const resolveRightOperand = (operation: Operation, inputTotalSeconds: number): number => {
  if (operation === "multiply" || operation === "divide") {
    return inputTotalSeconds / SECONDS_IN_HOUR
  }

  return inputTotalSeconds
}

const sanitizeNumberInput = (raw: string, allowNegative = false): string => {
  const isNegative = allowNegative && raw.trim().startsWith("-")
  const digits = raw.replace(/\D/g, "")

  if (!digits) return isNegative ? "-" : ""
  return `${isNegative ? "-" : ""}${digits}`
}

const padZero = (value: number): string => String(value).padStart(2, "0")

const decomposeSeconds = (totalSeconds: number) => {
  const isNegative = totalSeconds < 0
  const absolute = Math.abs(totalSeconds)

  return {
    isNegative,
    hours: Math.floor(absolute / SECONDS_IN_HOUR),
    minutes: Math.floor((absolute % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE),
    seconds: absolute % SECONDS_IN_MINUTE
  }
}

export const formatSecondsDisplay = (totalSeconds: number): string => {
  const { isNegative, hours, minutes, seconds } = decomposeSeconds(totalSeconds)
  const sign = isNegative ? "-" : ""
  return `${sign}${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
}

export const useTimeCalculator = () => {
  const hoursInput = ref("")
  const minutesInput = ref("")
  const secondsInput = ref("")

  const accumulator = ref<number | null>(null)
  const activeOperation = ref<Operation | null>(null)
  const resultSeconds = ref<number | null>(null)
  const maxMode = ref<MaxMode>("off")

  const parsedHours = computed(() => toSafeInt(hoursInput.value))
  const parsedMinutes = computed(() => clamp(toSafeInt(minutesInput.value), 0, MAX_TIME_UNIT))
  const parsedSeconds = computed(() => clamp(toSafeInt(secondsInput.value), 0, MAX_TIME_UNIT))

  const currentTotalSeconds = computed(() => {
    return (
      parsedHours.value * SECONDS_IN_HOUR +
      parsedMinutes.value * SECONDS_IN_MINUTE +
      parsedSeconds.value
    )
  })

  const resultDisplay = computed(() => {
    return resultSeconds.value !== null ? formatSecondsDisplay(resultSeconds.value) : null
  })

  const clearInputs = () => {
    hoursInput.value = ""
    minutesInput.value = ""
    secondsInput.value = ""
  }

  const syncInputsWithTotal = (totalSeconds: number) => {
    const { isNegative, hours, minutes, seconds } = decomposeSeconds(totalSeconds)

    hoursInput.value = `${isNegative ? "-" : ""}${hours}`
    minutesInput.value = padZero(minutes)
    secondsInput.value = padZero(seconds)
  }

  const setSegment = (segment: TimeSegment, rawValue: string) => {
    if (resultSeconds.value !== null) {
      resultSeconds.value = null
    }

    if (segment === "hours") {
      hoursInput.value = sanitizeNumberInput(rawValue, true)
    } else if (segment === "minutes") {
      minutesInput.value = sanitizeNumberInput(rawValue, false)
    } else {
      secondsInput.value = sanitizeNumberInput(rawValue, false)
    }
  }

  const normalizeSegmentOnBlur = (segment: TimeSegment) => {
    if (segment === "hours") {
      hoursInput.value = String(parsedHours.value)
    } else if (segment === "minutes" && minutesInput.value) {
      minutesInput.value = padZero(parsedMinutes.value)
    } else if (segment === "seconds" && secondsInput.value) {
      secondsInput.value = padZero(parsedSeconds.value)
    }
  }

  const applyOperation = (operation: Operation) => {
    const inputValue = currentTotalSeconds.value

    if (accumulator.value === null) {
      accumulator.value = normalizeByMaxMode(inputValue, maxMode.value)
    } else if (
      activeOperation.value !== null &&
      (hoursInput.value || minutesInput.value || secondsInput.value)
    ) {
      try {
        const rightOperand = resolveRightOperand(activeOperation.value, inputValue)
        const next = resolveOperation(accumulator.value, rightOperand, activeOperation.value)
        accumulator.value = normalizeByMaxMode(next, maxMode.value)
      } catch (e) {
        console.error(e)
        return
      }
    }

    activeOperation.value = operation
    clearInputs()
    resultSeconds.value = null
  }

  const calculateResult = () => {
    const inputValue = currentTotalSeconds.value

    if (accumulator.value !== null && activeOperation.value !== null) {
      try {
        const rightOperand = resolveRightOperand(activeOperation.value, inputValue)
        const total = resolveOperation(accumulator.value, rightOperand, activeOperation.value)
        const normalizedTotal = normalizeByMaxMode(total, maxMode.value)

        resultSeconds.value = normalizedTotal
        syncInputsWithTotal(normalizedTotal)

        accumulator.value = null
        activeOperation.value = null
      } catch (e) {
        console.error(e)
      }
    } else {
      const normalizedTotal = normalizeByMaxMode(inputValue, maxMode.value)
      resultSeconds.value = normalizedTotal
      syncInputsWithTotal(normalizedTotal)
    }
  }

  const setMaxMode = (mode: MaxMode) => {
    maxMode.value = mode

    if (accumulator.value !== null) {
      accumulator.value = normalizeByMaxMode(accumulator.value, maxMode.value)
    }

    if (resultSeconds.value !== null) {
      const normalizedResult = normalizeByMaxMode(resultSeconds.value, maxMode.value)
      resultSeconds.value = normalizedResult
      syncInputsWithTotal(normalizedResult)
    }
  }

  const clearAll = () => {
    clearInputs()
    accumulator.value = null
    activeOperation.value = null
    resultSeconds.value = null
  }

  return {
    hoursInput,
    minutesInput,
    secondsInput,
    maxMode,
    resultDisplay,
    activeOperation,
    setSegment,
    normalizeSegmentOnBlur,
    applyOperation,
    calculateResult,
    setMaxMode,
    clearAll
  }
}

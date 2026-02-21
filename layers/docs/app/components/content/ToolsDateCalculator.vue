<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
import { computed, ref, shallowRef, watch } from "vue"

type Mode = "difference" | "calculate"
type Unit = "days" | "weeks" | "months" | "years"
type Direction = "forward" | "backward"

interface DateResult {
  days: number
  workingDays: number
  weeks: number
  months: number
  years: number
}

const { t, locale } = useI18n()

const startDate = shallowRef<CalendarDate | null>(today(getLocalTimeZone()))
const endDate = shallowRef<CalendarDate | null>(null)
const baseDate = shallowRef<CalendarDate | null>(today(getLocalTimeZone()))
const mode = ref<Mode>("difference")
const amount = ref<number>(0)
const unit = ref<Unit>("days")
const direction = ref<Direction>("forward")

const modeTabs = computed(() => [
  { value: "difference", label: t("tools.dateCalculator.modes.difference") },
  { value: "calculate", label: t("tools.dateCalculator.modes.calculate") }
])
const unitItems = computed(() => [
  { label: t("tools.dateCalculator.units.days"), value: "days" },
  { label: t("tools.dateCalculator.units.weeks"), value: "weeks" },
  { label: t("tools.dateCalculator.units.months"), value: "months" },
  { label: t("tools.dateCalculator.units.years"), value: "years" }
])
const directionItems = computed(() => [
  { label: t("tools.dateCalculator.directions.forward"), value: "forward" },
  { label: t("tools.dateCalculator.directions.backward"), value: "backward" }
])

const df = computed(() => new DateFormatter(locale.value, { dateStyle: "medium" }))
const intlDf = computed(() => {
  return new Intl.DateTimeFormat(locale.value, {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
})

const calculatedDate = computed<Date | null>(() => {
  const base = toJsDate(baseDate.value)
  if (mode.value !== "calculate" || !base || !amount.value) return null

  const target = new Date(base)
  const multiplier = direction.value === "forward" ? 1 : -1
  const val = amount.value * multiplier

  switch (unit.value) {
    case "days":
      target.setDate(target.getDate() + val)
      break
    case "weeks":
      target.setDate(target.getDate() + val * 7)
      break
    case "months":
      target.setMonth(target.getMonth() + val)
      break
    case "years":
      target.setFullYear(target.getFullYear() + val)
      break
  }
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

const toJsDate = (value: CalendarDate | null): Date | null => {
  return value ? value.toDate(getLocalTimeZone()) : null
}

const handleDateSelect = (key: "startDate" | "endDate", val: unknown) => {
  const selectedDate = val ? (val as CalendarDate) : null

  if (key === "startDate") {
    startDate.value = selectedDate
  } else {
    endDate.value = selectedDate
  }
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
</script>

<template>
  <div class="rounded-xl border border-white/5 bg-white/2 p-4 backdrop-blur-sm sm:p-5">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <UTabs
          v-model="mode"
          color="primary"
          size="sm"
          :content="false"
          :items="modeTabs"
        />
        <UButton
          class="w-full sm:w-auto"
          color="red"
          variant="soft"
          icon="i-lucide-x"
          @click="clearAll"
        >
          {{ $t("tools.dateCalculator.actions.clearAll") }}
        </UButton>
      </div>

      <div
        v-if="mode === 'difference'"
        class="grid gap-3 sm:grid-cols-2"
      >
        <div
          v-for="(dateModel, labelKey) in { startDate, endDate }"
          class="space-y-1.5"
          :key="labelKey"
        >
          <label class="text-muted block text-xs">
            {{ $t(`tools.dateCalculator.fields.${labelKey}`) }}
          </label>
          <UPopover>
            <UButton
              class="w-full justify-start"
              color="neutral"
              variant="subtle"
              icon="i-lucide-calendar"
            >
              {{
                dateModel
                  ? df.format(toJsDate(dateModel)!)
                  : $t("tools.dateCalculator.placeholders.selectDate")
              }}
            </UButton>
            <template #content>
              <UCalendar
                :model-value="labelKey === 'startDate' ? startDate : endDate"
                class="p-2"
                @update:model-value="
                  (val) => handleDateSelect(labelKey as 'startDate' | 'endDate', val)
                "
              />
            </template>
          </UPopover>
        </div>
      </div>

      <div
        v-else
        class="grid gap-3"
      >
        <div class="space-y-1.5">
          <label class="text-muted block text-xs">
            {{ $t("tools.dateCalculator.fields.baseDate") }}
          </label>
          <UPopover>
            <UButton
              class="w-full justify-start"
              color="neutral"
              variant="subtle"
              icon="i-lucide-calendar"
            >
              {{
                baseDate
                  ? df.format(toJsDate(baseDate)!)
                  : $t("tools.dateCalculator.placeholders.selectDate")
              }}
            </UButton>
            <template #content>
              <UCalendar
                v-model="baseDate"
                class="p-2"
              />
            </template>
          </UPopover>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div class="space-y-1.5">
            <label class="text-muted block text-xs">
              {{ $t("tools.dateCalculator.fields.amount") }}
            </label>
            <UInput
              v-model.number="amount"
              type="number"
              min="0"
              class="w-full"
              :ui="{ base: 'bg-white/5 border-white/10 text-white ring-0' }"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-muted block text-xs">
              {{ $t("tools.dateCalculator.fields.unit") }}
            </label>
            <USelect
              v-model="unit"
              value-key="value"
              class="w-full"
              :items="unitItems"
              :ui="{ base: 'bg-white/5 border-white/10 text-white ring-0' }"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-muted block text-xs">
              {{ $t("tools.dateCalculator.fields.direction") }}
            </label>
            <USelect
              v-model="direction"
              value-key="value"
              class="w-full"
              :items="directionItems"
              :ui="{ base: 'bg-white/5 border-white/10 text-white ring-0' }"
            />
          </div>
        </div>
      </div>

      <div
        v-if="result"
        class="border-primary-500/20 bg-primary-500/5 rounded-xl border p-4"
      >
        <div class="text-muted text-center text-xs">
          {{ $t("tools.dateCalculator.result.title") }}
        </div>

        <div
          v-if="calculatedDate && mode === 'calculate'"
          class="mt-2"
        >
          <div
            class="border-primary-500/30 bg-primary-500/10 mx-auto w-fit rounded-lg border px-3 py-1.5"
          >
            <p class="text-primary text-center text-sm font-semibold">
              {{ intlDf.format(calculatedDate) }}
            </p>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <div
            v-for="(value, key) in result"
            class="rounded-lg bg-white/3 p-2.5 text-center"
            :key="key"
          >
            <div class="text-muted text-xs">{{ $t(`tools.dateCalculator.result.${key}`) }}</div>
            <div class="text-lg font-semibold text-white">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

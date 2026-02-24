<script setup lang="ts">
import { useTimeCalculator } from "./useTimeCalculator"

const HOURS_INPUT_ID = "time-calculator-hours-input"

const {
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
} = useTimeCalculator()

const { t } = useI18n()

const maxModeItems = computed(() => [
  { label: t("features.calculators.time.maxMode.options.off"), value: "off" },
  { label: t("features.calculators.time.maxMode.options.twelveHours"), value: "12h" },
  { label: t("features.calculators.time.maxMode.options.twentyFourHours"), value: "24h" }
])

const focusHoursInput = async () => {
  await nextTick()
  const input = document.getElementById(HOURS_INPUT_ID) as HTMLInputElement | null
  input?.focus()
}

const onInputKeyDown = (event: KeyboardEvent, segment: "hours" | "minutes" | "seconds") => {
  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault()
    calculateResult()
    return
  }

  const operationMap: Record<string, "add" | "subtract" | "multiply" | "divide"> = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide"
  }

  const operation = operationMap[event.key]

  if (operation) {
    event.preventDefault()
    applyOperation(operation)

    if (event.key === "+" && segment === "seconds") void focusHoursInput()
    return
  }

  if (event.key === "Escape") {
    event.preventDefault()
    clearAll()
  }
}

const onHoursKeyDown = (event: KeyboardEvent) => onInputKeyDown(event, "hours")
const onMinutesKeyDown = (event: KeyboardEvent) => onInputKeyDown(event, "minutes")
const onSecondsKeyDown = (event: KeyboardEvent) => onInputKeyDown(event, "seconds")

const onMaxModeUpdate = (value: string | number) => {
  if (value === "off" || value === "12h" || value === "24h") {
    setMaxMode(value)
  }
}
</script>

<template>
  <div class="rounded-xl border border-white/5 bg-white/2 p-4 backdrop-blur-sm sm:p-5">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-white/80">
            {{ $t("features.calculators.time.title") }}
          </span>
          <div class="flex items-center gap-2">
            <label class="text-muted text-xs">
              {{ $t("features.calculators.time.maxMode.label") }}:
            </label>
            <USelect
              value-key="value"
              size="sm"
              class="w-28"
              :model-value="maxMode"
              :items="maxModeItems"
              :ui="{ base: 'bg-white/5 border-white/10 text-white ring-0' }"
              @update:model-value="onMaxModeUpdate"
            />
          </div>
        </div>

        <div class="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
          <UInput
            type="text"
            inputmode="numeric"
            class="w-full"
            :model-value="hoursInput"
            :ui="{ base: 'bg-white/5 border-white/10 text-white ring-0 text-right' }"
            :placeholder="$t('features.calculators.time.placeholders.hours')"
            :id="HOURS_INPUT_ID"
            @update:model-value="(value) => setSegment('hours', String(value ?? ''))"
            @blur="normalizeSegmentOnBlur('hours')"
            @keydown="onHoursKeyDown"
          />
          <span class="text-muted text-center">:</span>
          <UInput
            type="text"
            inputmode="numeric"
            class="w-full"
            :model-value="minutesInput"
            :ui="{ base: 'bg-white/5 border-white/10 text-white ring-0 text-right' }"
            :placeholder="$t('features.calculators.time.placeholders.minutes')"
            @update:model-value="(value) => setSegment('minutes', String(value ?? ''))"
            @blur="normalizeSegmentOnBlur('minutes')"
            @keydown="onMinutesKeyDown"
          />
          <span class="text-muted text-center">:</span>
          <UInput
            type="text"
            inputmode="numeric"
            class="w-full"
            :model-value="secondsInput"
            :ui="{ base: 'bg-white/5 border-white/10 text-white ring-0 text-right' }"
            :placeholder="$t('features.calculators.time.placeholders.seconds')"
            @update:model-value="(value) => setSegment('seconds', String(value ?? ''))"
            @blur="normalizeSegmentOnBlur('seconds')"
            @keydown="onSecondsKeyDown"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <UButton
            block
            :color="activeOperation === 'add' ? 'primary' : 'neutral'"
            :variant="activeOperation === 'add' ? 'soft' : 'subtle'"
            icon="i-lucide-plus"
            @click="applyOperation('add')"
          >
            {{ $t("features.calculators.time.actions.add") }}
          </UButton>
          <UButton
            block
            :color="activeOperation === 'subtract' ? 'primary' : 'neutral'"
            :variant="activeOperation === 'subtract' ? 'soft' : 'subtle'"
            icon="i-lucide-minus"
            @click="applyOperation('subtract')"
          >
            {{ $t("features.calculators.time.actions.subtract") }}
          </UButton>
          <UButton
            block
            :color="activeOperation === 'multiply' ? 'primary' : 'neutral'"
            :variant="activeOperation === 'multiply' ? 'soft' : 'subtle'"
            icon="i-lucide-asterisk"
            @click="applyOperation('multiply')"
          >
            {{ $t("features.calculators.time.actions.multiply") }}
          </UButton>
          <UButton
            block
            :color="activeOperation === 'divide' ? 'primary' : 'neutral'"
            :variant="activeOperation === 'divide' ? 'soft' : 'subtle'"
            icon="i-lucide-slash"
            @click="applyOperation('divide')"
          >
            {{ $t("features.calculators.time.actions.divide") }}
          </UButton>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <UButton
            block
            color="neutral"
            variant="outline"
            icon="i-lucide-x"
            @click="clearAll"
          >
            {{ $t("global.actions.clearAll") }}
          </UButton>
          <UButton
            block
            color="primary"
            variant="solid"
            icon="i-lucide-equal"
            @click="calculateResult"
          >
            {{ $t("features.calculators.time.actions.equals") }}
          </UButton>
        </div>
      </div>

      <div
        v-if="resultDisplay"
        class="border-primary-500/20 bg-primary-500/5 rounded-xl border p-4 transition-all"
      >
        <div class="text-muted text-center text-xs">
          {{ $t("features.calculators.result.title") }}
        </div>
        <p class="text-primary mt-1 text-center text-3xl font-bold tracking-wide">
          {{ resultDisplay }}
        </p>
      </div>
    </div>
  </div>
</template>

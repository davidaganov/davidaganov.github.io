<script setup lang="ts">
import { useDateCalculator } from "./useDateCalculator"

const { t, locale } = useI18n()

const {
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
} = useDateCalculator(locale)

const modeTabs = computed(() => [
  { value: "difference", label: t("tools.calculators.modes.difference") },
  { value: "calculate", label: t("tools.calculators.modes.calculate") }
])

const unitItems = computed(() => [
  { label: t("tools.calculators.units.days"), value: "days" },
  { label: t("tools.calculators.units.weeks"), value: "weeks" },
  { label: t("tools.calculators.units.months"), value: "months" },
  { label: t("tools.calculators.units.years"), value: "years" }
])

const directionItems = computed(() => [
  { label: t("tools.calculators.directions.forward"), value: "forward" },
  { label: t("tools.calculators.directions.backward"), value: "backward" }
])
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
          variant="soft"
          icon="i-lucide-x"
          @click="clearAll"
        >
          {{ $t("tools.calculators.actions.clearAll") }}
        </UButton>
      </div>

      <div
        v-if="mode === 'difference'"
        class="grid gap-3 sm:grid-cols-2"
      >
        <div class="space-y-1.5">
          <label class="text-muted block text-xs">
            {{ $t("tools.calculators.fields.startDate") }}
          </label>
          <UPopover>
            <UButton
              class="w-full justify-start"
              color="neutral"
              variant="subtle"
              icon="i-lucide-calendar"
            >
              {{
                startDate
                  ? df.format(toJsDate(startDate)!)
                  : $t("tools.calculators.placeholders.selectDate")
              }}
            </UButton>
            <template #content>
              <UCalendar
                class="p-2"
                :model-value="startDate"
                @update:model-value="(val) => handleDateSelect('startDate', val)"
              />
            </template>
          </UPopover>
        </div>

        <div class="space-y-1.5">
          <label class="text-muted block text-xs">
            {{ $t("tools.calculators.fields.endDate") }}
          </label>
          <UPopover>
            <UButton
              class="w-full justify-start"
              color="neutral"
              variant="subtle"
              icon="i-lucide-calendar"
            >
              {{
                endDate
                  ? df.format(toJsDate(endDate)!)
                  : $t("tools.calculators.placeholders.selectDate")
              }}
            </UButton>
            <template #content>
              <UCalendar
                class="p-2"
                :model-value="endDate"
                @update:model-value="(val) => handleDateSelect('endDate', val)"
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
            {{ $t("tools.calculators.fields.baseDate") }}
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
                  : $t("tools.calculators.placeholders.selectDate")
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
              {{ $t("tools.calculators.fields.amount") }}
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
              {{ $t("tools.calculators.fields.unit") }}
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
              {{ $t("tools.calculators.fields.direction") }}
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
          {{ $t("tools.calculators.result.title") }}
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
            <div class="text-muted text-xs">{{ $t(`tools.calculators.result.${key}`) }}</div>
            <div class="text-lg font-semibold text-white">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

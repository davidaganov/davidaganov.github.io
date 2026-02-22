---
title: Калькулятор дат
description: Быстро посчитать разницу между датами или получить дату через N дней/недель/месяцев/лет.
icon: i-lucide-calendar-days
dependencies: ["@nuxt/ui", "@internationalized/date"]
---

# Калькулятор дат

## Возможности

- **Разница между датами**: дни, рабочие дни, недели, месяцы, годы
- **Расчет от даты**: получить дату через N дней/недель/месяцев/лет вперед или назад

::tool-playground
#preview
<ToolsDateCalculator />

#code

<ToolCodeGroup
  :items="[
    { title: 'useDateCalculator.ts', file: 'calculators/date-calculator/useDateCalculator.ts', lang: 'ts' },
    { title: 'ToolsDateCalculator.vue', file: 'calculators/date-calculator/ToolsDateCalculator.vue', lang: 'vue' }
  ]"
/>
::

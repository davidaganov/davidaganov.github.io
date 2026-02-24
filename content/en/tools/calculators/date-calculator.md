---
title: Date Calculator
description: Quickly calculate the difference between dates or get a date after N days/weeks/months/years.
icon: i-lucide-calendar-days
dependencies: ["@nuxt/ui", "@internationalized/date"]
tags:
  - Calculators
  - Date
  - Nuxt UI
---

# Date Calculator

## Features

- **Difference between dates**: days, business days, weeks, months, years
- **Date calculation**: get a date after N days/weeks/months/years forward or backward

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

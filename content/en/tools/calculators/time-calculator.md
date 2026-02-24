---
title: Time Calculator
description: Perform arithmetic operations with time intervals in hours:minutes:seconds format.
icon: i-lucide-clock-3
dependencies: ["@nuxt/ui"]
tags:
  - Calculators
  - Time
  - Nuxt UI
---

# Time Calculator

## Features

- **Arithmetic**: addition, subtraction, multiplication, and division of intervals
- **Modes**: unlimited / 12-hour / 24-hour
- **Hotkeys**: `+`, `-`, `*`, `/`, `Enter`, `=`, `Escape`
- **Output Format**: `HH:MM:SS`

::tool-playground
#preview
<ToolsTimeCalculator />

#code

<ToolCodeGroup
  :items="[
    { title: 'useTimeCalculator.ts', file: 'calculators/time-calculator/useTimeCalculator.ts', lang: 'ts' },
    { title: 'ToolsTimeCalculator.vue', file: 'calculators/time-calculator/ToolsTimeCalculator.vue', lang: 'vue' }
  ]"
/>
::

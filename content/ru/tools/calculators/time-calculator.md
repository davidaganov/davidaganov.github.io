---
title: Калькулятор времени
description: Выполняйте арифметические операции с интервалами времени в формате часы:минуты:секунды.
icon: i-lucide-clock-3
dependencies: ["@nuxt/ui"]
tags:
  - Калькуляторы
  - Время
  - Nuxt UI
---

# Калькулятор времени

## Возможности

- **Арифметика**: сложение, вычитание, умножение и деление интервалов
- **Режимы**: без ограничений / 12 часов / 24 часа
- **Горячие клавиши**: `+`, `-`, `*`, `/`, `Enter`, `=`, `Escape`
- **Формат вывода**: `HH:MM:SS`

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

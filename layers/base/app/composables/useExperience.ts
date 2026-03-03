/**
 * Composable for dynamically calculating years of professional experience.
 *
 * Frontend: started May 2021, step = 1 year, rounded up
 * Backend: started January 2025, step = 0.5 years, rounded up
 */

const calcYears = (start: Date, step: number): number => {
  const now = new Date()
  const diff = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.ceil(diff / step) * step
}

export const useExperience = () => {
  const frontendYears = computed(() => calcYears(new Date(2021, 4, 1), 1)) // May 2021, step 1yr
  const backendYears = computed(() => calcYears(new Date(2025, 0, 1), 0.5)) // Jan 2025, step 0.5yr

  return { frontendYears, backendYears }
}

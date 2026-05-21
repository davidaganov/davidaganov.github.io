const FRONTEND_START = new Date(2021, 4, 1)
const BACKEND_START = new Date(2025, 0, 1)

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25
const EXPERIENCE_YEAR_STEP = 0.5

const elapsedYearsSince = (start: Date, now = new Date()): number => {
  return (now.getTime() - start.getTime()) / MS_PER_YEAR
}

/** Rounds to nearest 0.5 (5, 5.5, 6, …) instead of always rounding up. */
const roundExperienceYears = (
  start: Date,
  step = EXPERIENCE_YEAR_STEP,
  now = new Date()
): number => {
  const years = elapsedYearsSince(start, now)
  const rounded = Math.round(years / step) * step
  return Number.isInteger(rounded) ? rounded : Math.round(rounded * 10) / 10
}

export const useExperience = () => {
  const frontendYears = useState("experience-frontend-years", () =>
    roundExperienceYears(FRONTEND_START)
  )

  const backendYears = useState("experience-backend-years", () =>
    roundExperienceYears(BACKEND_START)
  )

  return { frontendYears, backendYears }
}

const cubicBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): [number, number, number, number] => {
  return [x1, y1, x2, y2]
}

export const EASE = {
  PREMIUM: cubicBezier(0.16, 1, 0.3, 1),
  SOFT: cubicBezier(0.4, 0, 0.2, 1)
}

export const DURATION = {
  FAST: 0.3,
  BASE: 0.6,
  SLOW: 1.0
}

export const MOTION_FADE_IN_LEFT = {
  initial: { opacity: 0, x: -20 },
  enter: { opacity: 1, x: 0 },
  transition: { duration: DURATION.BASE, ease: EASE.PREMIUM }
}

export const MOTION_FADE_IN_RIGHT = {
  initial: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0 },
  transition: { duration: DURATION.BASE, ease: EASE.PREMIUM }
}

export const MOTION_COLLAPSE = {
  initial: { height: 0, opacity: 0 },
  enter: { height: "auto", opacity: 1 },
  leave: { height: 0, opacity: 0 },
  transition: { duration: DURATION.FAST, ease: EASE.PREMIUM }
}

export const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "").trim()
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("")
  const num = parseInt(h, 16)
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255]
}

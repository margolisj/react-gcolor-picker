export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Round to a fixed number of decimals without floating point noise. */
export const round = (value: number, decimals = 0) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

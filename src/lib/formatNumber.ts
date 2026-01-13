/**
 * Format a number with Swedish locale (comma as decimal separator)
 * and maximum 1 decimal place
 */
export const formatValue = (value: number, decimals: number = 1): string => {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

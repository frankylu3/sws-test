/**
 * Function to calculate historical volatility
 *
 * @param prices The list of prices to calculate (assumed sorted from furthest date to closest)
 * @returns the coefficient of variation for volatility (ratio of the standard deviation to the mean)
 */

export function calculateVolatility(prices: number[]): number {
  if (prices.length === 0) {
    return 0;
  }

  const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  const variance =
    prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) /
    prices.length;
  const standardDeviation = Math.sqrt(variance);

  return standardDeviation / mean;
}

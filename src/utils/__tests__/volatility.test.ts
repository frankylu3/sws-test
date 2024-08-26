import { calculateVolatility } from "../volatility";

describe("calculateVolatility", () => {
  it("should return 0 for an empty array", () => {
    let prices: number[] = [];
    const volatility = calculateVolatility(prices);
    expect(volatility).toEqual(0);
  });
  it("should correctly calculate volatility for a single price", () => {
    const prices = [10];
    const volatility = calculateVolatility(prices);
    expect(volatility).toEqual(0);
  });
  it("should correctly calculate volatiltiy for multiple prices", () => {
    const prices = [10, 11, 13, 12, 11];
    const volatility = calculateVolatility(prices);

    // manual calculation
    const mean = (10 + 11 + 13 + 12 + 11) / 5;
    const variance =
      (Math.pow(10 - mean, 2) +
        Math.pow(11 - mean, 2) +
        Math.pow(13 - mean, 2) +
        Math.pow(12 - mean, 2) +
        +Math.pow(11 - mean, 2)) /
      5;
    const std_deviation = Math.sqrt(variance);
    const expected_volatility = std_deviation / mean;

    expect(volatility).toEqual(expected_volatility);
  });
});

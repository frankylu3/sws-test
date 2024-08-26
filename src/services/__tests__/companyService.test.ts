import { CompanyRepository } from "../../repositories/companyRepository";
import { CompanyService } from "../companyService";
import { calculateVolatility } from "../../utils/volatility";

// mock volatility calculation
jest.mock("../../utils/volatility", () => ({
  calculateVolatility: jest.fn(),
}));
const mockCalculateVolatility = calculateVolatility as jest.MockedFunction<
  typeof calculateVolatility
>;

// mock the CompanyRepository
const companies = [
  {
    id: "uuid-1",
    name: "Company 1",
    ticker_symbol: "CPY",
    exchange_symbol: "NYSE",
    score: {
      id: 1629,
      dividend: 0,
      future: 4,
      health: 1,
      management: 0,
      past: 2,
      value: 1,
      misc: 0,
      total: 8,
    },
    closing_prices: [
      {
        date: new Date(2020, 2, 2),
        price: 101.23,
      },
      {
        date: new Date(2020, 2, 3),
        price: 102.5,
      },
    ],
  },
  {
    id: "uuid-2",
    name: "Company 2",
    ticker_symbol: "AUS",
    exchange_symbol: "ASX",
    score: {
      id: 1629,
      dividend: 6,
      future: 4,
      health: 5,
      management: 0,
      past: 2,
      value: 1,
      misc: 0,
      total: 18,
    },
    closing_prices: [
      {
        date: new Date(2020, 2, 2),
        price: 109,
      },
      {
        date: new Date(2020, 2, 3),
        price: 110,
      },
    ],
  },
];
const mockFindCompanies = jest.fn();
const mockCompanyRepository = {
  findCompanies: mockFindCompanies,
} as unknown as CompanyRepository;

describe("findCompanies", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const companyService = new CompanyService(mockCompanyRepository);
  it("should not calculate volatility when not sorting by volatility and return companies", async () => {
    mockFindCompanies.mockResolvedValue(companies);
    const result = await companyService.findCompanies();

    expect(mockCalculateVolatility).toHaveBeenCalledTimes(0);
  });
  it("should calculate volatility and return in ascending order", async () => {
    mockCalculateVolatility.mockReturnValueOnce(0.5).mockReturnValueOnce(0.3);
    mockFindCompanies.mockResolvedValue(companies);
    const result = await companyService.findCompanies(null, {
      sortBy: "volatility",
      sortOrder: "ASC",
    });

    expect(mockCalculateVolatility).toHaveBeenCalledTimes(2);
    expect(result[0].id).toEqual("uuid-2");
    expect(result[1].id).toEqual("uuid-1");
  });
  it("should calculate volatility and return in descending order", async () => {
    mockCalculateVolatility.mockReturnValueOnce(0.5).mockReturnValueOnce(0.3);
    mockFindCompanies.mockResolvedValue(companies);
    const result = await companyService.findCompanies(null, {
      sortBy: "volatility",
      sortOrder: "DESC",
    });

    expect(mockCalculateVolatility).toHaveBeenCalledTimes(2);
    expect(result[0].id).toEqual("uuid-1");
    expect(result[1].id).toEqual("uuid-2");
  });
  it("should handle no results", async () => {
    mockFindCompanies.mockResolvedValue([]);
    const result = await companyService.findCompanies(null, {
      sortBy: "volatility",
      sortOrder: "DESC",
    });

    expect(mockCalculateVolatility).toHaveBeenCalledTimes(0);
    expect(result).toHaveLength(0);
  });
});

import { Request, Response } from "express";
import { CompanyController } from "../companyContoller";
import { CompanyService } from "../../services/companyService";

// Mock the CompanyService
const mockFindCompanies = jest.fn();
const mockCompanyService = {
  findCompanies: mockFindCompanies,
} as unknown as CompanyService;

describe("getCompanies", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const companyContoller = new CompanyController(mockCompanyService);

  it("should return 400 if minScore is less than 0", async () => {
    const req = {
      query: {
        minScore: "-1",
      },
    } as unknown as Request;
    await companyContoller.getCompanies(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "scores must be between 0 and 30 inclusive",
    });
  });
  it("should return 400 if maxScore is greater than 30", async () => {
    const req = {
      query: {
        maxScore: "32",
      },
    } as unknown as Request;
    await companyContoller.getCompanies(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "scores must be between 0 and 30 inclusive",
    });
  });
  it("should return 400 if minScore is greater than maxScore", async () => {
    const req = {
      query: {
        minScore: "10",
        maxScore: "3",
      },
    } as unknown as Request;
    await companyContoller.getCompanies(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "minScore cannot be greater than maxScore",
    });
  });
  it("should return 400 if sortBy is provided and sortOrder is not", async () => {
    const req = {
      query: {
        sortBy: "score",
      },
    } as unknown as Request;
    await companyContoller.getCompanies(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "both sortBy and sortOrder must be provided if one is provided",
    });
  });
  it("should return 400 if sortOrder is provided and sortBy is not", async () => {
    const req = {
      query: {
        sortOrder: "asc",
      },
    } as unknown as Request;
    await companyContoller.getCompanies(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "both sortBy and sortOrder must be provided if one is provided",
    });
  });
  it("should return 400 if sortBy is invalid", async () => {
    const req = {
      query: {
        sortBy: "exchange",
        sortOrder: "asc",
      },
    } as unknown as Request;
    await companyContoller.getCompanies(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid sortBy parameter",
    });
  });
  it("should return 400 if sortOrder is invalid", async () => {
    const req = {
      query: {
        sortBy: "score",
        sortOrder: "as",
      },
    } as unknown as Request;
    await companyContoller.getCompanies(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid sortOrder parameter",
    });
  });
  it("should return companies successfully with valid parameters", async () => {
    const mockCompanies = [
      {
        id: "C8250615-877A-4AE1-BEF3-636B69CD83E8",
        name: "Alibaba Group Holding",
        ticker_symbol: "BABA",
        exchange_symbol: "NYSE",
        snowflake: {
          value: 0,
          future: 2,
          past: 5,
          health: 6,
          dividend: 0,
          total: 13,
        },
        last_known_price: 199.7,
      },
    ];
    mockFindCompanies.mockResolvedValue(mockCompanies);

    const req = {
      query: {
        sortBy: "score",
        sortOrder: "asc",
        minScore: "10",
        maxScore: "14",
        exchangeSymbol: "ASX,NYSE",
      },
    } as unknown as Request;
    await companyContoller.getCompanies(req, res);

    expect(mockCompanyService.findCompanies).toHaveBeenCalledWith(
      {
        exchangeSymbols: ["ASX", "NYSE"],
        scoreRange: {
          max: 14,
          min: 10,
        },
      },
      {
        sortBy: "score",
        sortOrder: "ASC",
      }
    );
    expect(res.json).toHaveBeenCalledWith(mockCompanies);
  });
});

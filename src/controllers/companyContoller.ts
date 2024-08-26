import { Request, Response } from "express";
import { CompanyListFilter } from "../types/filters";
import { CompanyListSortOptions } from "../types/sort";
import { CompanyService } from "../services/companyService";

export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * GET /company/list
   * An endpoint to get a list of companies
   * Request parameters:
   *  filters:
   *    name: exchangeSymbol
   *    description: Exchanges to list from, separated by commas
   *    example: NYSE,ASX
   *
   *    name: minScore
   *    description: The minimum score for filtering companies
   *    example: 10
   *
   *    name: maxScore
   *    description: The maximum score for filtering companies
   *    example: 20
   *
   *  sort:
   *    name: sortBy
   *    description: What to sort by
   *    options: score, volatility
   *
   *    name: sortOrder
   *    description: The order to sort by - ascending or descending
   *    options: asc or desc
   */

  async getCompanies(req: Request, res: Response) {
    // validate request parameters
    const minScore = parseInt(req.query.minScore as string);
    const maxScore = parseInt(req.query.maxScore as string);

    if (minScore < 0 || minScore > 30 || maxScore < 0 || maxScore > 30) {
      return res
        .status(400)
        .json({ error: "scores must be between 0 and 30 inclusive" });
    }

    if (!isNaN(minScore) && !isNaN(maxScore) && minScore > maxScore) {
      return res
        .status(400)
        .json({ error: "minScore cannot be greater than maxScore" });
    }

    const exchangeSymbols =
      (req.query.exchangeSymbol as string)
        ?.split(",")
        .map((symbol) => symbol.trim()) || [];

    const filters: CompanyListFilter = {
      exchangeSymbols,
      scoreRange:
        isNaN(minScore) && isNaN(maxScore)
          ? null
          : {
              min: isNaN(minScore) ? null : minScore,
              max: isNaN(maxScore) ? null : maxScore,
            },
    };

    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder as string;

    if ((sortBy && !sortOrder) || (!sortBy && sortOrder)) {
      return res.status(400).json({
        error: "both sortBy and sortOrder must be provided if one is provided",
      });
    }

    const validSortByFields = ["score", "volatility"];
    if (sortBy && !validSortByFields.includes(sortBy)) {
      return res.status(400).json({ error: "invalid sortBy parameter" });
    }

    if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
      return res.status(400).json({ error: "invalid sortOrder parameter" });
    }

    let sortOptions: CompanyListSortOptions = {
      sortBy: sortBy as string,
      sortOrder: sortOrder === "asc" ? "ASC" : "DESC",
    };

    try {
      const companies = await this.companyService.findCompanies(
        filters,
        sortOptions
      );

      return res.json(companies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

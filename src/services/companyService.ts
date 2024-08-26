import { CompanyListFilter } from "../types/filters";
import { CompanyListSortOptions } from "../types/sort";
import { CompanyRepository } from "../repositories/companyRepository";
import { Company } from "../entities/Company";
import { CompanyPriceClose } from "../entities/CompanyPriceClose";
import { calculateVolatility } from "../utils/volatility";

export interface FlattenCompanyData {
  id: string;
  name: string;
  ticker_symbol: string;
  exchange_symbol: string;
  snowflake: {
    value: number;
    future: number;
    past: number;
    health: number;
    dividend: number;
    total: number;
  };
  last_known_price?: number;
  prices: {
    date: Date;
    price: number;
  }[];
}

export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  transformToFlattenCompanyData(rawData: Company[]): FlattenCompanyData[] {
    return rawData.map((company) => ({
      id: company.id,
      name: company.name,
      ticker_symbol: company.ticker_symbol,
      exchange_symbol: company.exchange_symbol,
      snowflake: {
        value: company.score.value,
        future: company.score.future,
        past: company.score.past,
        health: company.score.health,
        dividend: company.score.dividend,
        total: company.score.total,
      },
      last_known_price:
        company.closing_prices.length > 0
          ? company.closing_prices[company.closing_prices.length - 1].price
          : null,
      prices:
        company.closing_prices.length > 0
          ? company.closing_prices.map((price) => ({
              date: price.date,
              price: price.price,
            }))
          : [],
    }));
  }

  getPrices(priceData: CompanyPriceClose[]) {
    if (priceData.length === 0) {
      return [];
    }
    return priceData.map((price) => price.price);
  }

  async findCompanies(
    filters?: CompanyListFilter,
    sort?: CompanyListSortOptions
  ) {
    const companies = await this.companyRepository.findCompanies(filters, sort);

    if (sort && sort.sortBy === "volatility") {
      const companiesWithVolatility = companies.map((company) => {
        const closing_prices = this.getPrices(company.closing_prices);
        const volatility = calculateVolatility(closing_prices);
        return { ...company, volatility };
      });

      if (sort.sortOrder === "ASC") {
        companiesWithVolatility.sort((a, b) => a.volatility - b.volatility);
      } else {
        companiesWithVolatility.sort((a, b) => b.volatility - a.volatility);
      }

      return this.transformToFlattenCompanyData(companiesWithVolatility);
    }

    return this.transformToFlattenCompanyData(companies);
  }
}

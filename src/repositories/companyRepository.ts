import { DataSource, Repository } from "typeorm";
import { Company } from "../entities/Company";
import { CompanyListFilter } from "../types/filters";
import { CompanyListSortOptions } from "../types/sort";

export class CompanyRepository extends Repository<Company> {
  constructor(dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }

  async findCompanies(
    filters: CompanyListFilter,
    sort: CompanyListSortOptions
  ) {
    const queryBuilder = this.createQueryBuilder("company");

    if (filters.exchangeSymbols && filters.exchangeSymbols.length > 0) {
      queryBuilder.andWhere(
        "company.exchange_symbol IN (:...exchangeSymbols)",
        {
          exchangeSymbols: filters.exchangeSymbols,
        }
      );
    }

    if (filters.scoreRange) {
      // inner join to ignore companies without a score
      queryBuilder.innerJoinAndSelect("company.score", "score");

      if (filters.scoreRange.min) {
        queryBuilder.andWhere("score.total >= :min", {
          min: filters.scoreRange.min,
        });
      }

      if (filters.scoreRange.max) {
        queryBuilder.andWhere("score.total <= :max", {
          max: filters.scoreRange.max,
        });
      }
    } else {
      // still want to return the scores even if not filtering by score
      queryBuilder.leftJoinAndSelect("company.score", "score");
    }

    if (sort) {
      if (sort.sortBy === "score") {
        queryBuilder.orderBy("score.total", sort.sortOrder);
      }
    }

    // get the past 90 days worth of closing price data
    queryBuilder
      .leftJoinAndSelect(
        "company.closing_prices",
        "closing_price",
        'closing_price.date >= DATE("NOW", "-90 days")'
      )
      .addOrderBy("closing_price.date", "ASC");

    // this was used to test prices being returned and calculating volatility. (replacing the above lines 53-59)
    // queryBuilder
    //   .leftJoinAndSelect(
    //     "company.closing_prices",
    //     "closing_price",
    //     'closing_price.date >= DATE("2020-04-16", "-90 days")'
    //   )
    //   .addOrderBy("closing_price.date", "ASC");

    const companies = await queryBuilder.getMany();
    return companies;
  }
}

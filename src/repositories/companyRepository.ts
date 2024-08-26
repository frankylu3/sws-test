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
      queryBuilder.leftJoinAndSelect("company.score", "score");
    }

    if (sort) {
      if (sort.sortBy === "score") {
        queryBuilder.orderBy("score.total", sort.sortOrder);
      }
    }

    queryBuilder
      .leftJoinAndSelect(
        "company.closing_prices",
        "closing_price",
        'closing_price.date >= DATE("2020-04-16", "-90 days")'
      )
      .addOrderBy("closing_price.date", "ASC");

    const companies = await queryBuilder.getMany();
    return companies;
  }
}

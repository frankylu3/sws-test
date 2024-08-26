import { Router } from "express";
import { DataSource } from "typeorm";
import { Company } from "./entities/Company";
import { CompanyPriceClose } from "./entities/CompanyPriceClose";
import { CompanyScore } from "./entities/CompanyScore";
import { CompanyService } from "./services/companyService";
import { CompanyRepository } from "./repositories/companyRepository";
import { CompanyController } from "./controllers/companyContoller";

const router = Router();

// Initalise data source
export const dataSource = new DataSource({
  type: "sqlite",
  database: "sws.sqlite3",
  entities: [Company, CompanyPriceClose, CompanyScore],
  synchronize: true,
});

dataSource.initialize().then(() => {
  const companyRepository = new CompanyRepository(dataSource);
  const companyService = new CompanyService(companyRepository);
  const companyController = new CompanyController(companyService);

  router.get("/list", (req, res) => companyController.getCompanies(req, res));
});

export default router;

import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Company } from "./Company";

@Entity("swsCompanyPriceClose")
export class CompanyPriceClose {
  @PrimaryColumn()
  date: Date;

  @PrimaryColumn()
  company_id: string;

  @Column("decimal")
  price: number;

  @Column()
  date_created: Date;

  @ManyToOne(() => Company, (company) => company.closing_prices)
  @JoinColumn({ name: "company_id" })
  company: Company;
}

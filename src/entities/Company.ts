import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { CompanyPriceClose } from "./CompanyPriceClose";
import { CompanyScore } from "./CompanyScore";

@Entity("swsCompany")
export class Company {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  ticker_symbol?: string;

  @Column({ nullable: true })
  exchange_symbol?: string;

  @Column({ nullable: true })
  unique_symbol?: string;

  @Column({ type: "datetime", nullable: true })
  date_generated?: Date;

  @Column({ nullable: true })
  security_name?: string;

  @Column({ nullable: true })
  exchange_country_iso?: string;

  @Column({ nullable: true })
  listing_currency_iso?: string;

  @Column({ nullable: true })
  canonical_url?: string;

  @Column({ nullable: true })
  unique_symbol_slug?: string;

  @OneToOne(() => CompanyScore)
  @JoinColumn({ name: "score_id" })
  score: CompanyScore;

  @OneToMany(() => CompanyPriceClose, (price) => price.company)
  closing_prices: CompanyPriceClose[];
}

import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { Company } from "./Company";

@Entity("swsCompanyScore")
export class CompanyScore {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToOne(() => Company)
  @JoinColumn({ name: "company_id" })
  company: Company;

  @Column()
  date_generated: Date;

  @Column()
  dividend: number;

  @Column()
  future: number;

  @Column()
  health: number;

  @Column()
  management: number;

  @Column()
  past: number;

  @Column()
  value: number;

  @Column()
  misc: number;

  @Column()
  total: number;

  @Column({ nullable: true })
  sentence: string;
}

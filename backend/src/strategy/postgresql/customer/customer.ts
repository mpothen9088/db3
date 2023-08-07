import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phoneNumber1: string;

  @Column()
  phoneNumber2: string;
}

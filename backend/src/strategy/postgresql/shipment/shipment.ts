import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weight: number;

  @Column()
  value: number;

  @Column()
  origin: string;

  @Column()
  destination: string;
}

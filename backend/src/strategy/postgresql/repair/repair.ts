import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { truck as Truck } from "../truck/truck";

@Entity()
export class repair {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Truck, truck => truck.id)
  truck: Truck;

  @Column()
  estimatedRepairTimeInDays: number;

  @Column()
  mechanicSpecialization: string; // Brand of vehicle the mechanic specializes in
}

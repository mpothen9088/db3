import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { truck as Truck } from "../truck/truck";
import { employee as Employee } from "../employee/employee";
import { shipment as Shipment } from "../shipment/shipment";

@Entity()
export class trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeFrom: string;

  @Column()
  routeTo: string;

  @ManyToMany(() => Employee) // Using the Employee entity for drivers
  @JoinTable()
  drivers: Employee[]; // Adjusted the type to Employee

  @ManyToMany(() => Shipment)
  @JoinTable()
  shipments: Shipment[];

  @Column({ type: "int", nullable: true })
  truckId: number;

  @ManyToOne(() => Truck, truck => truck.trips)
  truck: Truck;
}

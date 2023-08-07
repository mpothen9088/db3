import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { trip as Trip } from "../trip/trip";

@Entity()
export class truck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  load: number;

  @Column()
  capacity: number;

  @Column()
  year: number;

  @Column()
  numberOfRepairs: number;

  // Add the following lines to represent the inverse side of the relationship with trips
  @OneToMany(() => Trip, trip => trip.truck)
  trips: Trip[];
}

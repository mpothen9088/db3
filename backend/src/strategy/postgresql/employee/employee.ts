import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  seniority: number;

  @Column({ nullable: true })
  driverCategory?: string; // Only for drivers

  @Column({ nullable: true })
  mechanicSpecialization?: string; // Only for mechanics
}

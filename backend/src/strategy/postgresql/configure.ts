import { DataSource } from "typeorm";
import { truck } from "./truck/truck";
import { employee } from "./employee/employee";
import { customer } from "./customer/customer";
import { shipment } from "./shipment/shipment";
import { trip } from "./trip/trip";
import { repair } from "./repair/repair";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [truck,employee,customer,shipment,trip,repair],
  synchronize: true,
  logging: false,
});

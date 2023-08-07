import cors from "cors";
import express, { json } from "express";
import postgresDataSource from "./strategy/postgresql";
import truckApi from "./strategy/postgresql/truck";
import customerApi from "./strategy/postgresql/customer";
import employeeApi from "./strategy/postgresql/employee";
import shipmentApi from "./strategy/postgresql/shipment";
import tripApi from "./strategy/postgresql/trip";
import repairApi from "./strategy/postgresql/repair";

(async () => {
  const app = express();
  app.use(cors());
  app.use(json());

  const datasource = await postgresDataSource.initialize();

  new truckApi(datasource, app);
  new employeeApi(datasource, app);
  new customerApi(datasource, app);
  new shipmentApi(datasource, app);
  new tripApi(datasource, app);
  new repairApi(datasource, app);
  app.get("/", (_, res) => {
    return res.send("hello world");
  });

  app.listen(8000, () => {
    console.log(`express server started on 8000`);
  });
})().catch((err) => console.log(err));

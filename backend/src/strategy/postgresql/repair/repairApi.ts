import { Express } from "express";
import { DataSource } from "typeorm";
import { repair as Repair } from "./repair";

export default class repairApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/repair/:id", async (req, res) => {
      return res.json(
        await this.#dataSource.manager.findBy(Repair, {
          id: parseInt(req.params.id),
        })
      );
    });

    this.#express.post("/repair", async (req, res) => {
      const { body } = req;
      console.log(body);

      const repairRecord = new Repair();

      repairRecord.truck = body.truck;
      repairRecord.estimatedRepairTimeInDays = body.estimatedRepairTimeInDays;
      repairRecord.mechanicSpecialization = body.mechanicSpecialization;

      try {
        await this.#dataSource.manager.save(repairRecord);
        console.log(`Repair has been created with id: ${repairRecord.id}`);
      } catch (err) {
        res.status(503);
        return res.json({
          error: "Repair creation failed in db.",
        });
      }

      res.status(200);
      return res.json({
        id: repairRecord.id,
      });
    });

    this.#express.put("/repair/:id", async (req, res) => {
      const { body } = req;

      try {
        const records = await this.#dataSource.manager.findBy(Repair, { id: parseInt(req.params.id) });
        if (!records || records.length === 0) {
          res.status(404);
          return res.json({ error: "Repair not found" });
        }

        const repairRecord = records[0];

        repairRecord.truck = body.truck;
        repairRecord.estimatedRepairTimeInDays = body.estimatedRepairTimeInDays;
        repairRecord.mechanicSpecialization = body.mechanicSpecialization;

        await this.#dataSource.manager.save(repairRecord);
        console.log(`Repair with id: ${repairRecord.id} has been updated`);

        res.status(200);
        return res.json({ id: repairRecord.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Repair update failed in db." });
      }
    });

    this.#express.delete("/repair/:id", async (req, res) => {
      try {
        const records = await this.#dataSource.manager.findBy(Repair, { id: parseInt(req.params.id) });
        if (!records || records.length === 0) {
          res.status(404);
          return res.json({ error: "Repair not found" });
        }

        const repairRecord = records[0];

        await this.#dataSource.manager.delete(Repair, repairRecord.id);
        console.log(`Repair with id: ${repairRecord.id} has been deleted`);
        res.status(200);
        return res.json({ id: repairRecord.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Repair deletion failed in db." });
      }
    });
  }
}

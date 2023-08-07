import { Express } from "express";
import { DataSource } from "typeorm";
import { truck as Truck } from "./truck";

export default class TruckApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/truck/:id", async (req, res) => {
      return res.json(
        await this.#dataSource.manager.findBy(Truck, {
          id: parseInt(req.params.id),
        })
      );
    });

    this.#express.post("/truck", async (req, res) => {
      const { body } = req;
      console.log(body);

      const truck = new Truck();

      truck.brand = body.brand;
      truck.load = body.load;
      truck.capacity = body.capacity;
      truck.year = body.year;
      truck.numberOfRepairs = body.numberOfRepairs;

      try {
        await this.#dataSource.manager.save(truck);
        console.log(`Truck has been created with id: ${truck.id}`);
      } catch (err) {
        res.status(503);
        return res.json({
          error: "Truck creation failed in db.",
        });
      }

      res.status(200);
      return res.json({
        id: truck.id,
      });
    });

    this.#express.put("/truck/:id", async (req, res) => {
  const { body } = req;

  try {
    const trucks = await this.#dataSource.manager.findBy(Truck, { id: parseInt(req.params.id) });
    if (!trucks || trucks.length === 0) {
      res.status(404);
      return res.json({ error: "Truck not found" });
    }

    const truck = trucks[0];

    truck.brand = body.brand;
    truck.load = body.load;
    truck.capacity = body.capacity;
    truck.year = body.year;
    truck.numberOfRepairs = body.numberOfRepairs;

    await this.#dataSource.manager.save(truck);
    console.log(`Truck with id: ${truck.id} has been updated`);

    res.status(200);
    return res.json({ id: truck.id });
  } catch (err) {
    res.status(503);
    return res.json({ error: "Truck update failed in db." });
  }
});

this.#express.delete("/truck/:id", async (req, res) => {
  try {
    const trucks = await this.#dataSource.manager.findBy(Truck, { id: parseInt(req.params.id) });
    if (!trucks || trucks.length === 0) {
      res.status(404);
      return res.json({ error: "Truck not found" });
    }

    const truck = trucks[0];

    await this.#dataSource.manager.delete(Truck, truck.id);
    console.log(`Truck with id: ${truck.id} has been deleted`);
    res.status(200);
    return res.json({ id: truck.id });
  } catch (err) {
    res.status(503);
    return res.json({ error: "Truck deletion failed in db." });
  }
});

  }
}

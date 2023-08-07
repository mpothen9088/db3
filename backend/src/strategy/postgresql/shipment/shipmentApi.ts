import { Express } from "express";
import { DataSource } from "typeorm";
import { shipment as Shipment } from "./shipment";

export default class shipmentApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/shipment/:id", async (req, res) => {
      return res.json(
        await this.#dataSource.manager.findBy(Shipment, {
          id: parseInt(req.params.id),
        })
      );
    });

    this.#express.post("/shipment", async (req, res) => {
      const { body } = req;
      console.log(body);

      const shipment = new Shipment();

      shipment.weight = body.weight;
      shipment.value = body.value;
      shipment.origin = body.origin;
      shipment.destination = body.destination;

      try {
        await this.#dataSource.manager.save(shipment);
        console.log(`Shipment has been created with id: ${shipment.id}`);
      } catch (err) {
        res.status(503);
        return res.json({
          error: "Shipment creation failed in db.",
        });
      }

      res.status(200);
      return res.json({
        id: shipment.id,
      });
    });

    this.#express.put("/shipment/:id", async (req, res) => {
      const { body } = req;

      try {
        const shipments = await this.#dataSource.manager.findBy(Shipment, { id: parseInt(req.params.id) });
        if (!shipments || shipments.length === 0) {
          res.status(404);
          return res.json({ error: "Shipment not found" });
        }

        const shipment = shipments[0];

        shipment.weight = body.weight;
        shipment.value = body.value;
        shipment.origin = body.origin;
        shipment.destination = body.destination;

        await this.#dataSource.manager.save(shipment);
        console.log(`Shipment with id: ${shipment.id} has been updated`);

        res.status(200);
        return res.json({ id: shipment.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Shipment update failed in db." });
      }
    });

    this.#express.delete("/shipment/:id", async (req, res) => {
      try {
        const shipments = await this.#dataSource.manager.findBy(Shipment, { id: parseInt(req.params.id) });
        if (!shipments || shipments.length === 0) {
          res.status(404);
          return res.json({ error: "Shipment not found" });
        }

        const shipment = shipments[0];

        await this.#dataSource.manager.delete(Shipment, shipment.id);
        console.log(`Shipment with id: ${shipment.id} has been deleted`);
        res.status(200);
        return res.json({ id: shipment.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Shipment deletion failed in db." });
      }
    });
  }
}

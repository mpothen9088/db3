import { Express } from "express";
import { DataSource } from "typeorm";
import { trip as Trip } from "./trip";

export default class tripApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/trip/:id", async (req, res) => {
      return res.json(
        await this.#dataSource.manager.findBy(Trip, {
          id: parseInt(req.params.id),
        })
      );
    });

    this.#express.post("/trip", async (req, res) => {
      const { body } = req;

      const trip = new Trip();

      trip.routeFrom = body.routeFrom;
      trip.routeTo = body.routeTo;
      // Additional attributes can be added as needed

      try {
        await this.#dataSource.manager.save(trip);
        console.log(`Trip has been created with id: ${trip.id}`);
      } catch (err) {
        res.status(503);
        return res.json({
          error: "Trip creation failed in db.",
        });
      }

      res.status(200);
      return res.json({
        id: trip.id,
      });
    });

    this.#express.put("/trip/:id", async (req, res) => {
      const { body } = req;

      try {
        const trips = await this.#dataSource.manager.findBy(Trip, { id: parseInt(req.params.id) });
        if (!trips || trips.length === 0) {
          res.status(404);
          return res.json({ error: "Trip not found" });
        }

        const trip = trips[0];

        trip.routeFrom = body.routeFrom;
        trip.routeTo = body.routeTo;
        // Additional attributes can be updated as needed

        await this.#dataSource.manager.save(trip);
        console.log(`Trip with id: ${trip.id} has been updated`);

        res.status(200);
        return res.json({ id: trip.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Trip update failed in db." });
      }
    });

    this.#express.delete("/trip/:id", async (req, res) => {
      try {
        const trips = await this.#dataSource.manager.findBy(Trip, { id: parseInt(req.params.id) });
        if (!trips || trips.length === 0) {
          res.status(404);
          return res.json({ error: "Trip not found" });
        }

        const trip = trips[0];

        await this.#dataSource.manager.delete(Trip, trip.id);
        console.log(`Trip with id: ${trip.id} has been deleted`);
        res.status(200);
        return res.json({ id: trip.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Trip deletion failed in db." });
      }
    });
  }
}

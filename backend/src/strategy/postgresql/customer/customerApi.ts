import { Express } from "express";
import { DataSource } from "typeorm";
import { customer as Customer } from "./customer";

export default class customerApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/customer/:id", async (req, res) => {
      return res.json(
        await this.#dataSource.manager.findBy(Customer, {
          id: parseInt(req.params.id),
        })
      );
    });

    this.#express.post("/customer", async (req, res) => {
      const { body } = req;

      const customer = new Customer();

      customer.name = body.name;
      customer.address = body.address;
      customer.phoneNumber1 = body.phoneNumber1;
      customer.phoneNumber2 = body.phoneNumber2;

      try {
        await this.#dataSource.manager.save(customer);
        console.log(`Customer has been created with id: ${customer.id}`);
      } catch (err) {
        res.status(503);
        return res.json({
          error: "Customer creation failed in db.",
        });
      }

      res.status(200);
      return res.json({
        id: customer.id,
      });
    });

    this.#express.put("/customer/:id", async (req, res) => {
      const { body } = req;

      try {
        const customers = await this.#dataSource.manager.findBy(Customer, { id: parseInt(req.params.id) });
        if (!customers || customers.length === 0) {
          res.status(404);
          return res.json({ error: "Customer not found" });
        }

        const customer = customers[0];

        customer.name = body.name;
        customer.address = body.address;
        customer.phoneNumber1 = body.phoneNumber1;
        customer.phoneNumber2 = body.phoneNumber2;

        await this.#dataSource.manager.save(customer);
        console.log(`Customer with id: ${customer.id} has been updated`);

        res.status(200);
        return res.json({ id: customer.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Customer update failed in db." });
      }
    });

    this.#express.delete("/customer/:id", async (req, res) => {
      try {
        const customers = await this.#dataSource.manager.findBy(Customer, { id: parseInt(req.params.id) });
        if (!customers || customers.length === 0) {
          res.status(404);
          return res.json({ error: "Customer not found" });
        }

        const customer = customers[0];

        await this.#dataSource.manager.delete(Customer, customer.id);
        console.log(`Customer with id: ${customer.id} has been deleted`);
        res.status(200);
        return res.json({ id: customer.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Customer deletion failed in db." });
      }
    });
  }
}

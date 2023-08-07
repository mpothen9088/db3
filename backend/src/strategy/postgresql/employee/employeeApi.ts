import { Express } from "express";
import { DataSource } from "typeorm";
import { employee as Employee } from "./employee";

export default class EmployeeApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/employee/:id", async (req, res) => {
      return res.json(
        await this.#dataSource.manager.findBy(Employee, {
          id: parseInt(req.params.id),
        })
      );
    });

    this.#express.post("/employee", async (req, res) => {
      const { body } = req;

      const employee = new Employee();

      employee.name = body.name;
      employee.surname = body.surname;
      employee.seniority = body.seniority;
      employee.driverCategory = body.driverCategory;
      employee.mechanicSpecialization = body.mechanicSpecialization;

      try {
        await this.#dataSource.manager.save(employee);
        console.log(`Employee has been created with id: ${employee.id}`);
      } catch (err) {
        res.status(503);
        return res.json({
          error: "Employee creation failed in db.",
        });
      }

      res.status(200);
      return res.json({
        id: employee.id,
      });
    });

    this.#express.put("/employee/:id", async (req, res) => {
      const { body } = req;

      try {
        const employees = await this.#dataSource.manager.findBy(Employee, { id: parseInt(req.params.id) });
        if (!employees || employees.length === 0) {
          res.status(404);
          return res.json({ error: "Employee not found" });
        }

        const employee = employees[0];

        employee.name = body.name;
        employee.surname = body.surname;
        employee.seniority = body.seniority;
        employee.driverCategory = body.driverCategory;
        employee.mechanicSpecialization = body.mechanicSpecialization;

        await this.#dataSource.manager.save(employee);
        console.log(`Employee with id: ${employee.id} has been updated`);

        res.status(200);
        return res.json({ id: employee.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Employee update failed in db." });
      }
    });

    this.#express.delete("/employee/:id", async (req, res) => {
      try {
        const employees = await this.#dataSource.manager.findBy(Employee, { id: parseInt(req.params.id) });
        if (!employees || employees.length === 0) {
          res.status(404);
          return res.json({ error: "Employee not found" });
        }

        const employee = employees[0];

        await this.#dataSource.manager.delete(Employee, employee.id);
        console.log(`Employee with id: ${employee.id} has been deleted`);
        res.status(200);
        return res.json({ id: employee.id });
      } catch (err) {
        res.status(503);
        return res.json({ error: "Employee deletion failed in db." });
      }
    });
  }
}

import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTicketTypes, getTickets, createTicket } from "@/controllers";
import { ticketSchema } from "@/schemas";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("", getTickets)
  .post("", validateBody(ticketSchema), createTicket);

export { ticketsRouter };

import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, listBooking, changeBooking, listAllBookings } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", listBooking)
  .get("/allBookings", listAllBookings)
  .post("/", bookingRoom)
  .put("/:bookingId", changeBooking);

export { bookingRouter };

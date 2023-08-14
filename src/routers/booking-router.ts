import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, listBooking, changeBooking, listAllBookings, bookingByRoom, deleteBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", listBooking)
  .get("/allBookings", listAllBookings)
  .get("/:roomId", bookingByRoom)
  .post("/", bookingRoom)
  .put("/:bookingId", changeBooking)
  .delete("/:bookingId", deleteBooking);

export { bookingRouter };

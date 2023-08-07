import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllHotelsWithRooms, getHotels, getHotelsWithRooms } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/allHotelsWithRooms", getAllHotelsWithRooms)
  .get("/:hotelId", getHotelsWithRooms);

export { hotelsRouter };

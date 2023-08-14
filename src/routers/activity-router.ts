import { Router } from "express";
import { activitySchema } from "@/schemas";
import { allActivities, findByDate, subscribePerActivity } from "@/controllers";
import { validateBody, authenticateToken } from "@/middlewares";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", allActivities)
  .get("/activitydate", findByDate)
  .post("/", validateBody(activitySchema), subscribePerActivity);

export { activitiesRouter };  

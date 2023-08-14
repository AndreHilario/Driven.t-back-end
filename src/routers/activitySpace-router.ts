import { Router } from "express";
import { activitiesSpace } from "@/controllers/activity-controller";

const activitiesSpaceRouter =  Router ();

activitiesSpaceRouter.get("/", activitiesSpace);

export { activitiesSpaceRouter };

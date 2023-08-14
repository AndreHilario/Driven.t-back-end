import { Response, Request, NextFunction } from "express";
import httpStatus from "http-status";
import activitiesServBox from "@/services/activity-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function allActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const num = req.query.date as string;
  const mainDate = new Date(num);
  const analysis = mainDate instanceof Date && !isNaN(mainDate.valueOf());
  const { userId } = req;
 
  try {
    let activitiesList = [];
 
    if (!analysis) activitiesList = await activitiesServBox.allActivities();
    else activitiesList = await activitiesServBox.findByDay(mainDate, userId);
    return res.status(httpStatus.OK).send(activitiesList);
  } catch (error) {
    next(error);
    console.log(error);
  }
}

export async function findByDate(_req: Request, res: Response, next: NextFunction) {
  try {
    const daysList = await activitiesServBox.findByDate();
    return res.status(httpStatus.OK).send(daysList);
  } catch (error) {
    next(error);
    console.log(error);
  }
}

export async function activitiesSpace(_req: Request, res: Response, next: NextFunction) {
  try {
    const rooms = await activitiesServBox.activitiesSpace();
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    next(error);
    console.log(error);
  }
}

export async function subscribePerActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { activityId } = req.body;
 
    await activitiesServBox.subscribePerActivity(userId, parseInt(activityId));
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    next(error);
    console.log(error);
  }
}
 

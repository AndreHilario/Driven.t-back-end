import { prisma } from "@/config";
import { Prisma , Activity , ActivitySpace } from "@prisma/client";
import dayjs from "dayjs";


async function allActivities() {

 const activitiesList = await prisma.activity.findMany({ include: {ActivitySpace: true,},});

 const activityAnalysis = await Promise.all(
 
    activitiesList.map(async (activity) => ({
    ...activity,
    vacancies: activity.vacancies - (await prisma.subscription.count({ where: { activityId: activity.id } })),

  })),

 );

  return activityAnalysis;
 
}


async function singleActivityId (activityId: number) {


 const singleActivity = await prisma.activity.findUnique({ where: { id: activityId } });
 
  if (singleActivity) singleActivity.vacancies -= await prisma.subscription.count({ where: { activityId } });
 
  return singleActivity;
 
}

async function findByDate(): Promise<[{ date: string }]> {

 const activityDate = (await prisma.$queryRaw(Prisma.sql`SELECT DISTINCT DATE("Activity"."startsAt" AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo' ) as dateFROM "Activity"`)) as [{ date: string }];
 return activityDate;
 
}


async function findByDay (date: Date, userId: number): Promise<Activity[]> {

    const dayAnalysis = dayjs(date).add(1, 'days').toDate();
    const activitiesList = await prisma.activity.findMany({
 
      include: {ActivitySpace: true,  },

      where: {startsAt: { gte: date, lt: dayAnalysis,},},

    });

     const activitiesInfo = await Promise.all(activitiesList.map(async (activity) => ({
 
       ...activity,
       vacancies: activity.vacancies - (await prisma.subscription.count({ where: { activityId: activity.id } })),
       subscribed: (await prisma.subscription.count({ where: { activityId: activity.id, userId } })) >= 1,
 
      })),
 
    );

     return activitiesInfo;
 
}


async function activitiesSpace() {

  return await prisma.activitySpace.findMany({});
 
}

async function subscribeOnActivity(userId: number, activityId: number) {

    await prisma.subscription.create({
 
      data: { userId, activityId,},
 
    });
 
}


async function findSubscriptionsPerActivity (userId: number) {

    const subscripitionList = await prisma.subscription.findMany({
 
      where: {userId,},
 
      include: {Activity: true,},
 
    });

   return subscripitionList;
 
}


const activityRepBox = { findByDate , findByDay , findSubscriptionsPerActivity ,
    allActivities , singleActivityId , subscribeOnActivity , activitiesSpace }


export default activityRepBox;

 
 
 
 
 
 
 
 
 
 
 
 
 
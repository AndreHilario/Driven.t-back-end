import activityRepBox from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError , conflictError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";



async function allActivities() {

  return activityRepBox.allActivities();
 
}


async function findByDate() {

  return activityRepBox.findByDate();
 
}



async function findByDay(date: Date, userId = -1) {

   return activityRepBox.findByDay(date, userId);
 
}



async function activitiesSpace() {

  return activityRepBox.activitiesSpace();
 
}
 

async function subscribePerActivity (userId: number, activityId: number) {


    const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!userEnrollment) throw notFoundError();
 
 
    const userTicket = await ticketRepository.findTicketByEnrollmentId(userEnrollment.id);
     if (!userTicket || userTicket.status !== 'PAID' || userTicket.TicketType.isRemote) {
     throw notFoundError();}
 
 
     const notEnoghNum = await activityRepBox.singleActivityId(activityId);
     if (!notEnoghNum) throw notFoundError();
     if (notEnoghNum.vacancies <= 0) throw conflictError('Sorry, no vacancies anymore');
 
 
     const userSub = await activityRepBox.findSubscriptionsPerActivity(userId);
     if (userSub.find((param) => param.activityId === activityId)) {
       throw conflictError('Sorry, youre already in this activity');
     }
       if (
          userSub.find( (param) =>
              !(
                 param.Activity.endsAt.getTime() <= notEnoghNum.startsAt.getTime() ||
                 param.Activity.startsAt.getTime() >= notEnoghNum.endsAt.getTime()
              ),
          )
        ) {
          throw conflictError('Sorry, we found a schedule conflict, please check.');
        }
 
        await activityRepBox.subscribeOnActivity(userId, activityId);
 
}


const activitiesServBox = { activitiesSpace ,  allActivities , findByDate , findByDay , subscribePerActivity}
export default activitiesServBox;


 
 
 
 
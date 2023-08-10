import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();


async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  await prisma.activitySpace.deleteMany({});
  const mainActivities = await prisma.activitySpace.count();

  if (!mainActivities) {
    let day = 1;

    while(day <= 3){
    const timeStop = dayjs().startOf("day").add(day, "day");

      await prisma.activitySpace.create({

      data: {
        name: "Auditório II",
        Activity: {
          createMany: {
            data: [
              {
                title: "Palestra: Black Desert",
                startsAt: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
                endsAt: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
                vacancies: 150,
              },
              {
                title: "Palestra: Minecraft",
                startsAt: dayjs().add(day, "day").startOf("day").add(10, "hour").toDate(),
                endsAt: dayjs().add(day, "day").startOf("day").add(10, "hour").clone().add(1, "hour").toDate(),
                vacancies: 180,
              },
            ],
          },
        },
      },
    });
    
    await prisma.activitySpace.create({

      data: {
        name: "Cozinha Profissional",
        Activity: {
          createMany: {
            data: [
              {
                title: "Workshop Doces LowCarb",
                startsAt: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
                endsAt: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(4, "hour").toDate(),
                vacancies: 50,
              },
            ],
          },
        },
      },
    });

    await prisma.activitySpace.create({

      data: {
        name: "Passeio ao ar Livre",
        Activity: {
          createMany: {
            data: [
              {
                title: "Megulho na Cachoeira",
                startsAt: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
                endsAt: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
                vacancies: 10,
              },
              {
                title: "Megulho na Cachoeira -  segundo dia",
                startsAt: dayjs().add(day, "day").startOf("day").add(10, "hour").toDate(),
                endsAt: dayjs().add(day, "day").startOf("day").add(10, "hour").clone().add(1, "hour").toDate(),
                vacancies: 24,
              },
            ],
          },
        },
      },
    });
    day++
    }

    
  }
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

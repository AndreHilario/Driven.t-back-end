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

  const mainActivities = await prisma.activitySpace.count();

  if (!mainActivities) {
    const timeStop = dayjs().startOf("day").add(1, "day");

    await prisma.activitySpace.create({

      data: {
        name: "Auditório II",
        Activity: {
          createMany: {
            data: [
              {
                title: "Palestra: Back Desert",
                startsAt: timeStop.set("hours", 15).toDate(),
                endsAt: timeStop.set("hours", 17).toDate(),
                vacancies: 150,
              },
              {
                title: "Palestra: Minecraft",
                startsAt: timeStop.set("hours", 18).toDate(),
                endsAt: timeStop.set("hours", 20).toDate(),
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
                startsAt: timeStop.set("hours", 9).toDate(),
                endsAt: timeStop.set("hours", 10).toDate(),
                vacancies: 50,
              },
              {
                title: "Gastronomia Funcional",
                startsAt: timeStop.set("hours", 11).toDate(),
                endsAt: timeStop.set("hours", 12).toDate(),
                vacancies: 24,
              },
              {
                title: "Workshop Doces LowCarb - segundo dia",
                startsAt: timeStop.add(1, "day").set("hours", 10).toDate(),
                endsAt: timeStop.add(1, "day").set("hours", 11).toDate(),
                vacancies: 30,
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
                startsAt: timeStop.set("hours", 9).toDate(),
                endsAt: timeStop.set("hours", 13).toDate(),
                vacancies: 10,
              },
              {
                title: "Megulho na Cachoeira -  segundo dia",
                startsAt: timeStop.add(1, "day").set("hours", 9).toDate(),
                endsAt: timeStop.add(1, "day").set("hours", 13).toDate(),
                vacancies: 24,
              },
            ],
          },
        },
      },
    });

    await prisma.activitySpace.create({

      data: {
        name: "Auditório IV",
        Activity: {
          createMany: {
            data: [
              {
                title: "Maratona Vingadores",
                startsAt: timeStop.set("hours", 13).toDate(),
                endsAt: timeStop.set("hours", 24).toDate(),
                vacancies: 208,
              },
              {
                title: "Maratona Barbie",
                startsAt: timeStop.add(1, "day").set("hours", 13).toDate(),
                endsAt: timeStop.add(1, "day").set("hours", 22).toDate(),
                vacancies: 208,
              },
            ],
          },
        },
      },
    });
  }
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

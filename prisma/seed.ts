import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { redisClient } from "../redisConfig";
const prisma = new PrismaClient();

interface Event {
  title: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  startsAt: Date;
  endsAt: Date;
}

interface Hotel {
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

async function main() {
  let event: Event | null = null;
  let hotel: Hotel | null = null;

  const cachedEvent = await redisClient.get("event");

  const cachedHotel = await redisClient.get("hotel");

  if (cachedEvent) {
    event = JSON.parse(cachedEvent);
  } else {
    const dbEvent = await prisma.event.findFirst();

    if (!dbEvent) {
      event = {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      };

      await redisClient.set("event", JSON.stringify(event));
    } else {
      event = dbEvent;
      await redisClient.set("event", JSON.stringify(event));
    }
  }

  if(cachedHotel) {
    hotel = JSON.parse(cachedHotel);
  } else {
    const dbHotel = await prisma.hotel.findFirst();

    if (!dbHotel) {
      hotel = {
        name: "Driven Plaza",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await redisClient.set("hotel", JSON.stringify(hotel));
    } else {
      hotel = dbHotel;
      await redisClient.set("hotel", JSON.stringify(hotel));
    }
  }
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
  });

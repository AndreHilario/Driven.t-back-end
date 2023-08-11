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

async function main() {
  let event: Event | null = null;
  const cachedEvent = await redisClient.get("event");
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
      await prisma.event.create({
        data: event 
      });
    } else {
      event = dbEvent;
      await redisClient.set("event", JSON.stringify(event));
    }
  }

  interface Hotel {
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
  let hotel: Hotel | null = null;
  const cachedHotel = await redisClient.get("hotel");

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
      await prisma.hotel.create({
        data: hotel 
      });
    } else {
      hotel = dbHotel;
      await redisClient.set("hotel", JSON.stringify(hotel));
    }
  }

  interface TicketType {
    name: string,
    price: number,
    isRemote: boolean,
    includesHotel: boolean,
    createdAt: Date,
    updatedAt: Date,
  }

  let ticketType: TicketType | null = null;
  const cachedTicket = await redisClient.get("ticket");

  if(cachedTicket) {
    ticketType = JSON.parse(cachedTicket);
  }else{
    ticketType = {
      name: "VIP",
      price: 200,
      isRemote: false,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    redisClient.set("ticketType", JSON.stringify(ticketType));
    await prisma.ticketType.create({
      data: ticketType,
    });
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

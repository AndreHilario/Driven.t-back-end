import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findManyWithRooms() {
  return prisma.hotel.findMany({
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findManyWithRooms,
  findHotels,
  findRoomsByHotelId,
};

export default hotelRepository;

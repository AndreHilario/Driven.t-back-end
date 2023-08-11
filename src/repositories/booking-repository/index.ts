import { prisma } from "@/config";
import { Booking, Hotel, Room } from "@prisma/client";

type CreateParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;
type UpdateParams = Omit<Booking, "createdAt" | "updatedAt">;

async function create({ roomId, userId }: CreateParams): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findByUserId(userId: number) {
  const clientBooking: Booking & { Room: Room & { Hotel: Hotel; occupants?: number } } = await prisma.booking.findFirst(
    {
      where: { userId },
      include: {
        Room: {
          include: { Hotel: true },
        },
      },
    },
  );

  const roomNum = clientBooking ? await prisma.booking.count({ where: { roomId: clientBooking.roomId } }) : 0;
  clientBooking.Room.occupants = roomNum;

  return clientBooking;
}

async function upsertBooking({ id, roomId, userId }: UpdateParams) {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
    },
  });
}

async function findOneByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function findAllBookings() {
  return prisma.booking.findMany({
    include: { Room: true },
  });
}

const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
  findAllBookings,
  findOneByRoomId,
};

export default bookingRepository;

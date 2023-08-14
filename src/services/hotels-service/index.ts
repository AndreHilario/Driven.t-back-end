import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { redisClient } from "../../../redisConfig";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getHotels(userId: number) {
  await listHotels(userId);

  const hotels = await hotelRepository.findHotels();
  return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);
  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

async function allHotelsWithRooms(userId: number) {
  await listHotels(userId);
  const hotel = await hotelRepository.findManyWithRooms();
  return hotel;
  //verifica se existe hotels no cache redis
  // const cachedHotels = await redisClient.get("hotel");
  // let redisHotel;

  // if (!cachedHotels) {
  //   //se não tiver busca no banco e insere no cache
  //   const hotel = await hotelRepository.findManyWithRooms();
  //   if (!hotel) {
  //     throw notFoundError();
  //   }
  //   await redisClient.set("hotel", JSON.stringify(hotel));
  //   return hotel;
  // } else {
  //   redisHotel = JSON.parse(cachedHotels);
  // }
  // return redisHotel; //se tiver retorna do cache
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
  allHotelsWithRooms,
};

export default hotelService;

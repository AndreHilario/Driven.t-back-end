import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
  });
}

async function getUserOrCreate(githubUserData: Prisma.UserUncheckedCreateInput, fakePassword: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: githubUserData.email,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  const newUser = await prisma.user.create({
    data: {
      email: githubUserData.email,
      password: fakePassword,
    },
  });

  return newUser;
}

const userRepository = {
  findByEmail,
  create,
  getUserOrCreate
};

export default userRepository;

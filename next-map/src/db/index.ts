import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
  //prismaClientSingleton함수를 통해 새로운 PrismaClient 인스턴스를 생성하고 반환
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  // globalForPrisma는 객체를 생성. 이 객체는 전역 범위에서 PrismaClient를 저장하기 위한 용도로 사용
  //개발환경에서만 globalForPrisma를 사용하기 때문에 globalThis를 사용해서 전역객체에 접근
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
//전역으로 사용하는 globalForPrisma가 있으면 사용하고 아니면 하나 생성해서 만들어서 사용함

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
//개발 환경에서만 PrismaClient 인스턴스를 전역객체에 할당해서 재사용

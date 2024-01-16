import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
import { PrismaClient } from "@prisma/client";

interface Responsetype {
  page?: string;
  limit?: string;
  q?: string;
  district?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType> //페이지네이션, 전체데이터, 한개의 데이터
) {
  const { page = "", limit = "", q, district }: Responsetype = req.query;
  const prisma = new PrismaClient();

  if (page) {
    //page query가 있는 경우 페이지네이션
    const count = await prisma.store.count();
    const skipPage = parseInt(page) - 1;
    const stores = await prisma.store.findMany({
      orderBy: { id: "asc" },
      where: {
        name: q ? { contains: q } : {},
        //q값이 있으면 name에 q를 포함하는 게시물을 가져오고 아니면 빈쿼리(아무거나 괜춘)
        address: district ? { contains: district } : {},
      },
      take: parseInt(limit), //한페이지당 10개씩의 게시물을 보여줌
      skip: skipPage * 10,
      //skip은 게시물 얼마나 띄어넘어서 보여줄것인지 나타냄
    });

    res.status(200).json({
      page: parseInt(page), //현재 페이지
      data: stores, //그에 따른 데이터
      totalCount: count, //전체 페이지 개수
      totalPage: Math.ceil(count / 10), //정수로 딱 떨어지지 않기 때문에 올림
    });
  } else {
    const { id }: { id?: string } = req.query;

    //없는 경우 총 데이터 가져오기
    const stores = await prisma.store.findMany({
      orderBy: { id: "asc" }, //오름차순 정리
      where: {
        id: id ? parseInt(id) : {}, //id가 있으면 해당 id에 게시물을 가져오고 아니면 where문 무시
      },
    });

    return res.status(200).json(id ? stores[0] : stores);
  }
}

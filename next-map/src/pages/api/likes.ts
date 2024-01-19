import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import { LikeInterface, LikeApiResponse } from "@/interface";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
interface ResponseType {
  page?: string;
  limit?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LikeInterface | LikeApiResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  //getServerSession을 사용해서 현재 로그인한 사용자 있는지 확인

  if (!session?.user) {
    //로그인하지 않은 경우
    return res.status(401);
  }

  if (req.method === "POST") {
    // 찜하기 로직 처리
    const { storeId }: { storeId: number } = req.body;
    //like 데이터를 찾기 위해서 받아옴

    // Like 데이터가 있는지 확인
    let like = await prisma.like.findFirst({
      //가게가 좋음 아님으로 2개이므로 최대 1개(가게 하나당 1개)
      where: {
        storeId,
        userId: session?.user?.id,
      },
    });

    // 만약 이미 찜을 했다면, 해당 like 데이터 삭제. 아니라면, 데이터 생성
    if (like) {
      // 이미 찜을 한 상황
      like = await prisma.like.delete({
        where: {
          id: like.id,
        },
      });
      return res.status(204).json(like);
    } else {
      // 찜을 하지 않은 상황
      like = await prisma.like.create({
        //데이터 생성
        data: {
          storeId,
          userId: session?.user?.id,
        },
      });

      return res.status(201).json(like);
    }
  } else {
    // GET 요청 처리
    const count = await prisma.like.count({
      where: {
        userId: session.user.id,
      },
    });

    const { page = "1", limit = "10" }: ResponseType = req.query;
    const skipPage = parseInt(page) - 1;  //인덱스는 0부터 시작

    const likes = await prisma.like.findMany({
      orderBy: { createdAt: "desc" }, //최신순, 내림차순
      where: {
        userId: session.user.id, //로그인된 사용자가 좋아요를 누른 데이터만
      },
      include: {  //like에 연결된 store도 가져옴
        store: true,
      },
      skip: skipPage * parseInt(limit), //page와 limit에 맞춰 데이터 스킵
      take: parseInt(limit),  //10개 가져옴
    });

    return res.status(200).json({
      data: likes,
      page: parseInt(page),
      totalPage: Math.ceil(count / parseInt(limit)),
    });
  }
}

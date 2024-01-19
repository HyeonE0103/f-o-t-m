import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/db";
import { CommentInterface, CommentApiResponse } from "@/interface";

interface ResponseType {
  id?: string;
  page?: string;
  limit?: string;
  storeId?: string;
  user?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentInterface | CommentApiResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  const {
    id = "",
    page = "1",
    limit = "10",
    storeId = "",
    //해당가게의 댓글 가져와. 하지만 마이페이지 유저 댓글을 볼때는 가게는 상관없기 때문에 기본이 ""
    user = false,
  }: //기본을 false로 두어 유저의 상관없이 모든 댓글을 가져와
  ResponseType = req.query;

  if (req.method === "POST") {
    // 댓글 생성 로직
    if (!session?.user) {
      return res.status(401);
    }

    const { storeId, body }: { storeId: number; body: string } = req.body;
    const comment = await prisma.comment.create({
      data: {
        storeId,
        body,
        userId: session?.user.id,
        //createAt은 자동생성이기 때문에 넣어주지 않아도 됨
      },
    });

    return res.status(200).json(comment);
  } else if (req.method === "DELETE") {
    // 댓글 삭제 로직
    if (!session?.user || !id) {
      return res.status(401);
    }

    const result = await prisma.comment.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json(result);
  } else {
    // 댓글 가져오기
    const skipPage = parseInt(page) - 1; //페이지는 1부터이고 인덱스는 0부터
    const count = await prisma.comment.count({
      where: {
        //조건의 여부를 주어 값이 들어오면 그에 맞는 가게를 찾고 아니면 다, 유저가 있다면 해당 유저의 댓글만 아니면 다
        storeId: storeId ? parseInt(storeId) : {},
        userId: user ? session?.user.id : {},
      },
    });

    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        storeId: storeId ? parseInt(storeId) : {},
        userId: user ? session?.user.id : {},
      },
      skip: skipPage * parseInt(limit),
      take: parseInt(limit),
      include: {
        user: true, //해당 댓글이 유저 정보 가져오기
        store: true, //해당 댓글이 어떤 가게의 댓글인지 알수 있기 위해서 store 정보 가져오기
      },
    });

    return res.status(200).json({
      data: comments,
      page: parseInt(page),
      totalPage: Math.ceil(count / parseInt(limit)),
    });
  }
}

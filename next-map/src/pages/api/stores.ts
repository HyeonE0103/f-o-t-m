import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
import prisma from "@/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

interface Responsetype {
  page?: string;
  limit?: string;
  q?: string;
  district?: string;
  id?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType | null> //페이지네이션, 전체데이터, 한개의 데이터
) {
  const { page = "", limit = "", q, district, id }: Responsetype = req.query;
  const session = await getServerSession(req, res, authOptions);
  //getServerSession을 req, res, authOptions통해서 session을 생성할 수 있음

  if (req.method === "POST") {
    //데이터 생성 처리
    const formData = req.body;
    const headers = {
      Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
    };

    //https://dapi.kakao.com/v2/local/search/address.원하는타입?query=인코더된주소
    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        formData.address
      )}`,
      { headers } //헤더값 추가
    );

    const result = await prisma.store.create({
      data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
    });

    return res.status(200).json(result);
  } else if (req.method === "PUT") {
    // 데이터 수정. POST와 구현이 거의 같지만 prisma를 수정하는 것이 아닌 해당 id값인 데이터를 update함
    const formData = req.body;
    const headers = {
      Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
    };

    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        formData.address
      )}`,
      { headers }
    );

    const result = await prisma.store.update({
      where: { id: formData.id }, //where문으로 어떤 데이터를 업데이트할 것인지
      data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
    });

    return res.status(200).json(result);
  } else if (req.method === "DELETE") {
    // 데이터 삭제
    if (id) {
      //id가 있을 경우에는
      const result = await prisma.store.delete({
        //delete를 이용하여 DB에서 해당 게시물 삭제
        where: {
          //where문으로 어떤 데이터를 삭제할 것인지
          id: parseInt(id), //id는 string으로 되어있긴 때문에 int로 변경
        },
      });

      return res.status(200).json(result);
    }
    return res.status(500).json(null); //서버에러가 났을 경우 null값을 보냄
  } else {
    //GET 요청 처리
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
        include: {
          //가게 상세페이지 데이터에서 현재 로그인된 사용자가 있으면 로그인된 사용자와 매칭이 되는 가게 찜 데이터를 가져옴
          //include를 해서 store를 가져올때 store에 포함이 되어있는 like데이터도 같이 포함해서 가져오라는 의미

          likes: {
            where: session ? { userId: session.user.id } : { userId: 0 },
            //로그인했다면 로그인한 userId
          },
        },
      });

      return res.status(200).json(id ? stores[0] : stores);
    }
  }
}

// nextauth에 추가한 id값을 타입으로 설정해서 사용할 수 있음

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /*원래는 name, email, image로 next-auth 기본타입을 지정되어있었지만
      id값을 추가했기 때문에 따로 타입을 지정해줌 그래야 타입에러 없이
      next-auth를 getSeverSideSession에서 id값 사용 가능*/
      id: number;
      name?: string;
      email: string;
      image?: string;
    };
  }
}

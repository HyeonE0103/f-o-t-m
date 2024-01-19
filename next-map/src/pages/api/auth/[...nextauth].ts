import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/db";

import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions: NextAuthOptions = {
  session: {
    //해당 옵션이 세션관리 방법중 하나로 jwt기반의 세션을 사용한다고 명시
    strategy: "jwt" as const, //기본값인 jwt를 명시, type에러를 해결하기이해 const명시
    maxAge: 60 * 60 * 24, //세션의 최대수명 설정. 초단위로 설정. 24시간
    updateAge: 60 * 60 * 2, //세션을 업데이트 하는 주기. 초단위로 설정. 2시간
  },
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/users/login",
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session, //기존의 session정보
      user: {
        ...session.user,
        id: token.sub, //기존 정보에 id값을 추가하는 값은 token.sub
      },
    }),
    jwt: async ({ user, token }) => {
      if (user) { //로그인 한 경우 
        //user가 있는경우 token.sub를 user.id로 두겠다고 정의
        token.sub = user.id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);

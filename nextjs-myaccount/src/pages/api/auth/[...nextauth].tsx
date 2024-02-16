import { User } from '@/models/user'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    //session이라는 함수가 인증을 거쳤다 오면 동작을 하게 됨
    session({ session, token }) {
      if (session.user) {
        //로그인이 성공적으로 되었다면
        ;(session.user as User).id = token.sub as string
        //token의 값이 undefined일수도 있기 때문에 as string으로 타입 지정
      }

      return session
    },
  },
  session: {
    strategy: 'jwt',
    //jwt 방식으로 세션 관리
  },
  pages: {
    signIn: '/auth/signin',
    //로그인 페이지 정보
  },
})

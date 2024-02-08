import { Global } from '@emotion/react'
import type { AppProps } from 'next/app'
import globalSteyls from '@styles/globalStyles'
import Layout from '@/components/shared/Layout'

// nextjs에서 모든페이지들이 공통적으로 적용되는 레이아웃
// 모든페이지들은 App컴포넌트를 거쳐서 그려지게 됨
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout>
        <Global styles={globalSteyls} />
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

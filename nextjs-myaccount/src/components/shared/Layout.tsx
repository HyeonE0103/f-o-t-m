import SEO from './SEO'
import Head from 'next/head'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Head>
        <title>MyAccount</title>
        <meta name="description" content="내 자산을 편하게" />
        {/* 위 2가지 요소는 모든 페이지에서 공통으로 적용되는 메타태그 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {children}
    </div>
  )
}

export default Layout

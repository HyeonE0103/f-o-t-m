import { Html, Head, Main, NextScript } from 'next/document'

// SSR에서만 렌더링 됨. 기본 html 설정들을 여기에다가 함
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* 바뀌는 요소가 아니므로 Document에 정의 */}
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="root-portal" />
      </body>
    </Html>
  )
}

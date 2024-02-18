import { Global } from '@emotion/react'
import type { AppProps } from 'next/app'
import globalSteyls from '@styles/globalStyles'
import Layout from '@/components/shared/Layout'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { SessionProvider } from 'next-auth/react'
import Navbar from '@shared/Navbar'
import { AlertContextProvider } from '@/contexts/AlertContext'
import ErrorBoundary from '@shared/ErrorBoundary'
import { useReportWebVitals } from 'next/web-vitals'

const client = new QueryClient()

// nextjs에서 모든페이지들이 공통적으로 적용되는 레이아웃
// 모든페이지들은 App컴포넌트를 거쳐서 그려지게 됨
export default function App({
  Component,
  pageProps: { dehydratedState, session, ...pageProps },
}: AppProps) {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return (
    <>
      <Layout>
        <SessionProvider session={session}>
          <QueryClientProvider client={client}>
            <Global styles={globalSteyls} />
            <Hydrate state={dehydratedState}>
              {/* 서버측에서 수행한 값을 클라이언트에서 복원해서 사용할수 있기 때문에 이미
            한번 액션 호출이 일어났고 키값으로 저장이 되어있어서 클라이언트 측에서는
            값은 키값으로 접근을 하게 되면은 데이터가 바로 채워진 상태로 사용할 수 있음 */}
              <ErrorBoundary>
                <AlertContextProvider>
                  <Navbar />
                  <Component {...pageProps} />
                </AlertContextProvider>
              </ErrorBoundary>
            </Hydrate>
          </QueryClientProvider>
        </SessionProvider>
      </Layout>
    </>
  )
}

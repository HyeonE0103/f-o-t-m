import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import useLoadKakao from '@hooks/useLoadKakao'
import AuthGuard from '@components/auth/AuthGuard'
import Navbar from '@shared/Navbar'
import PrivateRoute from '@components/auth/PrivateRoute'
import { HelmetProvider } from 'react-helmet-async'

const TestPage = lazy(() => import('@pages/Test'))
const HotelListPage = lazy(() => import('@pages/HotelList'))
const HotelPage = lazy(() => import('@pages/Hotel'))
const MyPage = lazy(() => import('@pages/My'))
const SigninPage = lazy(() => import('@pages/Signin'))
const SettingsPage = lazy(() => import('@pages/settings'))
const LikePage = lazy(() => import('@pages/settings/like'))
const SchedulePage = lazy(() => import('@pages/Schedule'))
const ReservationPage = lazy(() => import('@pages/Reservation'))
const ReservationDonePage = lazy(() => import('@pages/ReservationDone'))
const ReservationListPage = lazy(() => import('@pages/ReservationList'))

const App = () => {
  useLoadKakao()
  return (
    <Suspense fallback={<></>}>
      <HelmetProvider>
        {/* 내부 컴포넌트들에서 helmet을 사용할 수 있게 됨 */}
        <BrowserRouter>
          <AuthGuard>
            <Navbar />
            <Routes>
              <Route path="/" element={<HotelListPage />} />
              <Route path="/hotel/:id" element={<HotelPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route
                path="/my"
                element={
                  <PrivateRoute>
                    <MyPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings/like"
                element={
                  <PrivateRoute>
                    <LikePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <PrivateRoute>
                    <SchedulePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reservation"
                element={
                  <PrivateRoute>
                    <ReservationPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reservation/done"
                element={
                  <PrivateRoute>
                    <ReservationDonePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reservation/list"
                element={
                  <PrivateRoute>
                    <ReservationListPage />
                  </PrivateRoute>
                }
              />
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </AuthGuard>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  )
}

export default App

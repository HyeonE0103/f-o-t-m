import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from '@shared/ScrollToTop'
import HomePage from '@pages/Home'
import TestPage from '@pages/Test'
import Card from '@pages/Card'
import SigninPage from '@pages/Signin'
import SignupPage from '@pages/Signup'
import Navbar from '@shared/Navbar'
import PrivateRoute from '@components/auth/PrivateRoute'
import ApplyPage from '@pages/Apply'
import ApplyDone from './pages/ApplyDone'
import { Suspense } from 'react'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/signin" Component={SigninPage} />
        <Route path="/signup" Component={SignupPage} />
        <Route path="/card/:id" Component={Card} />
        <Route
          path="/apply/:id"
          element={
            <Suspense fallback={<></>}>
              <PrivateRoute>
                <ApplyPage />
              </PrivateRoute>
            </Suspense>
          }
        />
        <Route
          path="/apply/done"
          element={
            <PrivateRoute>
              <ApplyDone />
            </PrivateRoute>
          }
        />

        <Route path="/test" Component={TestPage} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

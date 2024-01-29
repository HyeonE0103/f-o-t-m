import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '@pages/Home'
import TestPage from './pages/Test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={HomePage}></Route>
        <Route path="/test" Component={TestPage}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

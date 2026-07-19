import {Route, Routes} from "react-router-dom"
import Home from './pages/Home'
import Auth from './pages/Auth'
import useCurrentUser from './hooks/useCurrentUser'
function App() {
  useCurrentUser()
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/auth' element={<Auth/>} />
      </Routes>
    </>
  )
}

export default App
import { Routes, Route } from 'react-router-dom';
import { SignUp, Login, Home, Cloud, CloudInfo } from './pages';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/home/cat' element={<Cloud />} />
      <Route path='/home/info' element={<CloudInfo />} />
    </Routes>
  )
}

export default App
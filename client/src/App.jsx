import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import AdminDashboard from './pages/AdminDashboard'
import ThreeDBackground from './components/ThreeDBackground'

const App = () => {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      <ThreeDBackground />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/blog/:id' element={<Blog/>}/>
        <Route path='/admin/*' element={<AdminDashboard/>}/>
      </Routes>
    </div>
  )
}

export default App
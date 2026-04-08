import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Session from './pages/Session'
import Activity from './pages/Activity'
import EndOfSession from './pages/EndOfSession'
import Progress from './pages/Progress'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/session"         element={<Session />} />
        <Route path="/activity/:moduleId" element={<Activity />} />
        <Route path="/end-of-session"  element={<EndOfSession />} />
        <Route path="/progress"        element={<Progress />} />
      </Routes>
    </BrowserRouter>
  )
}

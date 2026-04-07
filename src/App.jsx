import './App.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <h1>GameHub Casino</h1>
      <p>Place your bets and choose your game!</p>
      <Outlet />
    </>
  )
}

export default App

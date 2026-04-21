import './App.css'
import { Outlet } from 'react-router-dom'
import "./styles/global.css";

function App() {

  return (
    <>
      <h1>Luigi's Casino</h1>
      <p>Place your bets and choose your game!</p>
      <Outlet />
      <footer>
        <p className="footer-text">Created by Ethan Zins & Josh Blank</p>
      </footer>
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import VideoContainer from './components/VideoContainer/VideoContainer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>Hello guys</h1>
    <VideoContainer/>
    </>
  )
}

export default App

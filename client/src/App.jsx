import AppRouter from "./routes/AppRouter"
import './App.css'
import './index.css'
import { useEffect } from "react"
import { useTheme } from "./hooks/useTheme"

function App() {
  const { toggleTheme } = useTheme()
  

  return (
    <AppRouter />
  )
}

export default App

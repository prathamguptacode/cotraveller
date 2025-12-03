import AppRouter from "./routes/AppRouter"
import './App.css'
import './index.css'
import { useEffect } from "react"
import { useTheme } from "./hooks/useTheme"

function App() {
  const { toggleTheme } = useTheme()
  useEffect(() => {
    //If theme is already user selected, then don't check/toggle
    const initialTheme = localStorage.getItem('theme')
    if (initialTheme) {
      console.log('ini')
      //When refreshing, classes reset to base value and js classes are gone
      initialTheme === 'dark' && document.documentElement.classList.add('dark')
      return
    }

    //Setting default theme for first time user
    if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
      console.log('i like dark by default')
      localStorage.setItem('theme', 'dark')
      return
    }
    //toggling since initial value is dark
    toggleTheme()
  }, [])

  return (
    <AppRouter />
  )
}

export default App

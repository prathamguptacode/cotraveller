import Router from "./Router"
import './App.css'
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar'
import { useEffect, useRef } from "react"
import { loaderEvent } from "../api/mitt"
import { Toaster } from "sonner"
import { useTheme } from "@/hooks/useTheme"


function App() {

  const ref = useRef<LoadingBarRef>(null)



  useEffect(() => {
    const bar = ref.current
    if (!bar) return
    const startLoading = () => bar.continuousStart()
    const stopLoading = () => bar.complete()

    loaderEvent.on('startLoading', startLoading)
    loaderEvent.on('stopLoading', stopLoading)

    return () => {
      loaderEvent.off('startLoading', startLoading)
      loaderEvent.off('stopLoading', stopLoading)
    }
  }, [])

  const { theme } = useTheme()

  return (
    <>
      <Toaster duration={3000}
        icons={{ success: null, error: null, close: null, info: null, loading: null, warning: null }}
        position={window.matchMedia("(max-width:768px)").matches ? "bottom-center" : "bottom-left"}
        theme={theme === 'dark' ? 'light' : 'dark'}
      />
      <Router />
      <LoadingBar color="var(--primary)" shadow={false} ref={ref} height={3} className="top-loading-bar" />

    </>
  )
}

export default App

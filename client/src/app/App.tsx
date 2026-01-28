import Router from "./Router"
import './App.css'
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar'
import { useEffect, useRef } from "react"
import { loaderEvent } from "../api/mitt"
import Providers from "./Providers"
import { Toaster } from "sonner"
import { CheckCircle, X } from "lucide-react"


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



  return (
    <Providers>
      <Router />
      <LoadingBar color="var(--primary)" shadow={false} ref={ref} height={3} className="top-loading-bar" />
      <Toaster duration={1500} icons={{ success: <CheckCircle color="green" />, error: <X color="red" /> }} />
    </Providers>
  )
}

export default App

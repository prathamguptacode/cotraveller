import AppRouter from "./routes/AppRouter"
import './App.css'
import './index.css'
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar'
import { useEffect, useRef } from "react"
import { loaderEvent } from "./api/mitt"


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
    <>
      <AppRouter />
      <LoadingBar color="var(--primary)" shadow={false} ref={ref} height={3} className="top-loading-bar" />
    </>
  )
}

export default App

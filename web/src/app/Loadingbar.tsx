import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useLoadingBar } from "react-top-loading-bar";

function Loadingbar() {

  const location = useLocation()
  const [prevLoc, setPrevLoc] = useState("")
  const { start, complete } = useLoadingBar()

  useEffect(() => {
    setPrevLoc(location.pathname)
    start()
    if (prevLoc === location.pathname) {
      setPrevLoc("")
    }
  }, [location])

  useEffect(() => {
    complete()
  }, [prevLoc])

  return (
    <></>
  )
}

export default Loadingbar 

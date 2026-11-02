import { useEffect, useRef } from "react"

export default function useEffectAfterFirstRender(fn: () => void, dep: any[]) {

  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    fn()
  }, dep)

}

import { APIProvider } from "@vis.gl/react-google-maps"
import type { ReactNode } from "react"

function GoogleMapApi({ children }: { children: ReactNode }) {
  const apiKey = import.meta.env.VITE_MAP_API
  return (
    <APIProvider apiKey={apiKey}>
      {children}
    </APIProvider>
  )
}

export default GoogleMapApi

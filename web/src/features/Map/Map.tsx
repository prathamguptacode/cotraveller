import type { posT } from "@/app/pages/TestMapPage"
import mystyle from "./Map.module.css"
import { AdvancedMarker, ColorScheme, useMap, Map as Vmap } from "@vis.gl/react-google-maps"
import { Compass } from "lucide-react"
import Route from "../MapRoutes/Route"
import { RoutesApi } from "../MapRoutes/RoutesApi"
import Test from "./test"

type position = {
  lat: number,
  lng: number
}
type props = {
  zoom?: number,
  center: position,
  pos: posT[]
}

function Map({ zoom, center, pos }: props) {

  const mapId = import.meta.env.VITE_MAP_ID

  const map = useMap()
  if (map && pos[pos.length - 1]) {
    map.panTo(pos[pos.length - 1])
  }

  const key = import.meta.env.VITE_MAP_API
  const apiClient = new RoutesApi(key)



  const appearance = {
    walkingPolylineColor: 'cyan',   // Pumpkin orange
    defaultPolylineColor: 'cyan',    // Deep purple
    stepMarkerFillColor: '#ffffff00',     // Dark haunted purple
    stepMarkerBorderColor: '#ffffff00'   // Amber orange
  };

  // for all options, see https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes#request-body
  const departureTime = new Date().toISOString();

  const routeOptions = {
    // travelMode: 'TRANSIT',
    // departureTime: departureTime,
    computeAlternativeRoutes: false,
    units: 'METRIC',
    intermediates: pos.filter((e, i) => {
      if (i == 0) return false
      if (i == pos.length - 1) return false
      return true
    }).map((e, i) => {
      return { location: { latLng: { longitude: e.lng, latitude: e.lat } } }
    })
  };


  console.log("pos", pos);

  // console.log("destination", { lng: pos[pos.length - 1].lng, lat: pos[pos.length - 1].lat })



  return (
    <div className={mystyle.mapWrapper}>
      <Vmap
        mapId={mapId}
        defaultZoom={zoom}
        defaultCenter={center}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        colorScheme={ColorScheme.DARK}
      >
        {
          pos.map(e => <AdvancedMarker position={e}>
            <span><Compass size={28} fill="cyan" /> </span>
          </AdvancedMarker>)
        }
        {
          pos.length > 1 ?
            <Route
              apiClient={apiClient}
              origin={{ lng: pos[0].lng, lat: pos[0].lat }}
              destination={{ lng: pos[pos.length - 1].lng, lat: pos[pos.length - 1].lat }}
              routeOptions={routeOptions}
              appearance={appearance}
            /> : null
        }
      </Vmap>
      {
        pos.length > 0 && <Test message={pos[pos.length - 1].lat} />
      }
    </div>
  )
}

export default Map

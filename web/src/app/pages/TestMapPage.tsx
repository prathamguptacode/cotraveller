import Autocomplete from '@/features/Autocomplete/Autocomplete'
import Map from '@/features/Map/Map'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useState } from 'react'

export type posT = {
  lat: number,
  lng: number
}

function TestMapPage() {
  const key = import.meta.env.VITE_MAP_API

  const [pos, setPos] = useState<posT[]>([])


  return (
    <div>
      <h1>test map route</h1>
      <APIProvider apiKey={key}>
        <Map center={{ lat: 21.125681, lng: 82.794998 }} zoom={5} pos={pos} />
        <Autocomplete setPos={setPos} />
      </APIProvider>
    </div>
  )
}

export default TestMapPage

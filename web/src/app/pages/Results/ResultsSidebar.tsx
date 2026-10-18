import { useParams, } from "react-router-dom";
import mystyle from "./Results.module.css"
import { useState, useEffect } from "react";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import useEmblaCarousel from 'embla-carousel-react'
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import SearchBox from "@/features/search/components/SearchBox";


function ResultsSidebar() {

  const { placeId } = useParams()


  return (
    <div>
      <SearchBox />
      {
        placeId && <PlaceInfo placeId={placeId} />
      }
    </div>
  )
}

export default ResultsSidebar



const mapId = import.meta.env.VITE_MAP_ID

function PlaceInfo({ placeId }: { placeId: string }) {

  const places = useMapsLibrary('places');
  const [loc, setLoc] = useState<google.maps.places.Place | null>(null)

  useEffect(() => {
    if (!places) return

    (async () => {
      const place = new google.maps.places.Place({ id: placeId })
      await place.fetchFields({
        fields: ["formattedAddress", "location", "photos"]
      })
      setLoc(place)
    })()

  }, [placeId, places])

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  function next() {
    emblaApi?.scrollNext()
  }
  function prev() {
    emblaApi?.scrollPrev()
  }






  return (
    <div className={mystyle.placeInfo}>
      {
        (loc && loc.formattedAddress && loc.formattedAddress.split(",").length >= 2) && (
          <div className={mystyle.locDescription}>
            <div>{loc.formattedAddress.split(",")[0]}</div>
            <div>
              <span>{loc.formattedAddress.split(",")[1]}</span>
              {/* <span>{loc.formattedAddress.split(",")[2]}</span> */}
            </div>
          </div>
        )
      }

      <div>
        <div className={mystyle.imgBox} ref={emblaRef}>
          <div className={mystyle.embla__container}>
            {
              loc?.photos?.map((e, i) => {
                return <div key={i} className={mystyle.embla__slide}>
                  <img src={e.getURI({ maxWidth: 422, maxHeight: 750 })} alt="city photos" width="100%" />
                </div>
              })
            }
          </div>
          <button className={mystyle.prev} onClick={prev}><CaretLeftIcon size={20} /> </button>
          <button className={mystyle.next} onClick={next}><CaretRightIcon size={20} /> </button>
        </div>
      </div>

      <div className={mystyle.mapWrapper}>
        {
          (loc?.location?.lat() && loc?.location?.lng()) &&
          <Map
            defaultZoom={11}
            mapId={mapId}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            defaultCenter={{ lat: loc.location.lat(), lng: loc.location.lng() }}>
            <MapController loc={loc} />
          </Map>
        }
      </div>

    </div>
  )
}

type MapControllerProps = {
  loc: google.maps.places.Place | null
}

const MapController = ({ loc }: MapControllerProps) => {
  const map = useMap()

  useEffect(() => {
    if (!map || !loc?.location?.lat() || !loc.location?.lng()) return
    map.panTo({ lat: loc.location.lat(), lng: loc.location.lng() })
    map.setZoom(11)

  }, [loc, map])

  return null
}

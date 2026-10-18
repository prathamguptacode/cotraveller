import { useNavigate, useParams, } from "react-router-dom";
import mystyle from "./Results.module.css"
import { useState, useRef, useEffect, useCallback } from "react";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAutocompleteSuggestions } from "@/hooks/autocomplete";
import { MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react";
import useEmblaCarousel from 'embla-carousel-react'
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

const placeHolderText = ["Tokyo", "Monoco", "California", "Germany"]

function ResultsSidebar() {
  const navigate = useNavigate()
  const searchInRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let i = 0
    let pos = 0

    async function dynamicPlaceholder() {
      if (!searchInRef.current) return
      if (i === placeHolderText[pos].length) {
        i = 0;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        searchInRef.current.placeholder = "Search for "
        if (pos === placeHolderText.length - 1) {
          pos = 0
        } else {
          pos++
        }
        return dynamicPlaceholder()
      }
      searchInRef.current.placeholder += placeHolderText[pos].charAt(i)
      i++;
      setTimeout(() => dynamicPlaceholder(), 100)
    }

    dynamicPlaceholder()
  }, [])



  const [input, setInput] = useState("")
  const { suggestions, resetSession } = useAutocompleteSuggestions(input, {
    includedPrimaryTypes: ["locality"]
  })
  const places = useMapsLibrary('places');
  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) return;
      if (!suggestion.placePrediction) return;
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: [
          "addressComponents"
        ]
      });
      setInput('');
      // calling fetchFields invalidates the session-token, so we now have to call
      // resetSession() so a new one gets created for further search
      resetSession();
      const city = place.addressComponents && place.addressComponents[0].longText
      const placeId = suggestion.placePrediction.placeId
      if (city && placeId) {
        return navigate(`/results/${city}/${placeId}`)
      }
    },
    [navigate, places, resetSession]
  )

  const { city, placeId } = useParams()




  return (
    <div>
      <div className={mystyle.searchBox}>
        <MagnifyingGlassIcon size={22} />
        <input placeholder="Search for " ref={searchInRef} value={input} onChange={e => setInput(e.currentTarget.value)} />
      </div>
      <LocationOption suggestions={suggestions} handleClick={handleSuggestionClick} />
      {
        (city && placeId) && <PlaceInfo placeId={placeId} />
      }
    </div>
  )
}

export default ResultsSidebar


type LocationOptionProps = {
  suggestions: google.maps.places.AutocompleteSuggestion[],
  handleClick: (suggestion: google.maps.places.AutocompleteSuggestion) => Promise<void>
}


function LocationOption({ suggestions, handleClick }: LocationOptionProps) {

  return !!suggestions.length && (
    <div className={mystyle.optionBox}>
      {
        suggestions.map(suggestion => <button key={suggestion.placePrediction?.placeId} className={mystyle.option} onClick={() => handleClick(suggestion)}>
          <div className={mystyle.iconWrapper}>
            <MapPinIcon weight="fill" size={20} />
          </div>
          <div>
            <div>
              {suggestion.placePrediction?.text.text}
            </div>
          </div>
        </button>
        )
      }
    </div>
  )
}

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

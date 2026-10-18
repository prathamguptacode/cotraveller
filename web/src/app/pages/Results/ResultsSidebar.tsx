import { useNavigate, useParams, } from "react-router-dom";
import mystyle from "./Results.module.css"
import { useState, useRef, useEffect, useCallback } from "react";
import { Map, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAutocompleteSuggestions } from "@/hooks/autocomplete";
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react";
import useEmblaCarousel from 'embla-carousel-react'
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

const placeHolderText = ["Search for Tokyo", "Search for Monoco", "Search for California", "Search for Germany"]

function ResultsSidebar() {

  const navigate = useNavigate()

  const searchInRef = useRef<HTMLInputElement>(null)
  let i = 0;
  const speed = 100;
  const [pos, setPos] = useState(0)

  async function dynamicPlaceholder(pos: number) {
    if (!searchInRef.current) return
    if (i === placeHolderText[pos].length) {
      i = 0;
      await new Promise((resolve) => setTimeout(resolve, 800));
      searchInRef.current.placeholder = ""
      if (pos === placeHolderText.length - 1) {
        setPos(0)
      } else {
        setPos(pos + 1)
      }
      return
    }
    searchInRef.current.placeholder += placeHolderText[pos].charAt(i)
    i++;
    setTimeout(() => dynamicPlaceholder(pos), speed)
  }

  useEffect(() => {
    dynamicPlaceholder(pos)
  }, [pos])



  const [input, setInput] = useState("")
  const { isLoading, suggestions, resetSession } = useAutocompleteSuggestions(input, {
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
    [places, resetSession,]
  );

  const params = useParams()
  const city = params.city
  const placeId = params.placeId



  return (
    <div>
      <div className={mystyle.searchBox}>
        <MagnifyingGlassIcon size={22} />
        <input ref={searchInRef} value={input} onChange={e => setInput(e.currentTarget.value)} />
      </div>
      <LocationOption suggestions={suggestions} handleClick={handleSuggestionClick} />
      {
        (city != undefined && placeId != undefined && city != "" && placeId != "") ? <PlaceInfo city={city} placeId={placeId} /> : null
      }
    </div>
  )
}

export default ResultsSidebar



function LocationOption({ suggestions, handleClick, }: { suggestions: google.maps.places.AutocompleteSuggestion[], handleClick: (suggestion: google.maps.places.AutocompleteSuggestion) => Promise<void>, }) {

  if (suggestions.length === 0) {
    return
  }

  return <div className={mystyle.optionBox}>
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
}



function PlaceInfo({ city, placeId }: { city: string, placeId: string }) {

  const places = useMapsLibrary('places');
  const [loc, setLoc] = useState<google.maps.places.Place | null>(null)

  useEffect(() => {
    if (!places) {
      return
    }

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
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }
  function prev() {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }

  const mapId = import.meta.env.VITE_MAP_ID

  return <div className={mystyle.placeInfo}>
    {
      (loc && loc.formattedAddress && loc.formattedAddress.split(",").length >= 2) ?
        (
          <div className={mystyle.locDescription}>
            <div>{loc.formattedAddress.split(",")[0]}</div>
            <div>
              <span>{loc.formattedAddress.split(",")[1]}</span>
              {/* <span>{loc.formattedAddress.split(",")[2]}</span> */}
            </div>
          </div>
        )
        : null
    }

    <div>
      <div className={mystyle.imgBox} ref={emblaRef}>
        <div className={mystyle.embla__container}>
          {
            loc?.photos?.map(e => {
              return <div className={mystyle.embla__slide}>
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
        (loc?.location?.lat() && loc?.location?.lng()) ?
          <Map
            defaultZoom={11}
            mapId={mapId}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            defaultCenter={{ lat: loc.location.lat(), lng: loc.location.lng() }}
          />
          : null
      }
    </div>

  </div>
}

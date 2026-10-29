import { useCallback, useEffect, useRef, useState, } from "react"
import mystyle from "./styles.module.css"
import { MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react"
import { useAutocompleteSuggestions } from "@/hooks/useAutoCompleteSuggestions"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useNavigate } from "react-router-dom"

const placeHolderText = ["Search for Tokyo", "Search for Monoco", "Search for California", "Search for Germany"]
const history = [
  {
    url: "london.webp",
    city: "London",
    country: "England"
  },
  {
    url: "paris.webp",
    city: "Paris",
    country: "France"
  },
  {
    url: "berlin.webp",
    city: "Berlin",
    country: "Germany"
  },
  {
    url: "rome.webp",
    city: "Rome",
    country: "Italy"
  },
  {
    url: "tokyo.webp",
    city: "Tokyo",
    country: "Japan"
  },
  {
    url: "bali.webp",
    city: "Bali",
    country: "Indonesia"
  },
]


function SearchSidebar() {

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
    await new Promise((resolve) => setTimeout(resolve, speed));
    dynamicPlaceholder(pos)
    // setTimeout(() => dynamicPlaceholder(pos), speed)
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

  return (
    <div>
      <div className={mystyle.searchBox}>
        <MagnifyingGlassIcon size={22} />
        <input ref={searchInRef} value={input} onChange={e => setInput(e.currentTarget.value)} />
      </div>
      <LocationOption suggestions={suggestions} handleClick={handleSuggestionClick} />
      <HistoryBox />
    </div >
  )
}


function HistoryBox() {

  return <div className={mystyle.historyBox}>
    {history.map((e, i) => <CityBox key={i} url={e.url} city={e.city} country={e.country} />)}
  </div>
}



function CityBox({ url, city, country }: { url: string, city: string, country: string }) {
  return <div className={mystyle.cityBox}>
    <img src={url} alt="city image" width="100%" />
    <div className={mystyle.content}>
      <div>{city}</div>
      <div>{country}</div>
    </div>
  </div>
}

export function LocationOption({ suggestions, handleClick, }: { suggestions: google.maps.places.AutocompleteSuggestion[], handleClick: (suggestion: google.maps.places.AutocompleteSuggestion) => Promise<void>, }) {

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


export default SearchSidebar

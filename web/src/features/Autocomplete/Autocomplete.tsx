import { useCallback, useState, type Dispatch, type SetStateAction } from "react"
import mystyle from "./Autocomplete.module.css"
import { useAutocompleteSuggestions } from "@/hooks/autcomplete"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import type { posT } from "@/app/pages/TestMapPage"

function Autocomplete({ setPos }: { setPos: Dispatch<SetStateAction<posT[]>> }) {


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
          'location',
        ]
      });

      setInput('');

      // calling fetchFields invalidates the session-token, so we now have to call
      // resetSession() so a new one gets created for further search
      resetSession();

      const lat = (place.location.lat());
      const lng = (place.location.lng());

      setPos(prev => [...prev, { lat, lng }])

    },
    [places, resetSession, setPos]
  );




  return (
    <div className={mystyle.wrapper}>
      <input placeholder="place..." onChange={e => setInput(e.currentTarget.value)} />
      <ul>
        {suggestions.map((sug) => (
          <li onClick={() => handleSuggestionClick(sug)} key={sug.placePrediction.placeId}>{sug.placePrediction.text.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default Autocomplete

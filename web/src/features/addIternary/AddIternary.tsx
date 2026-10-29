import type { tripDetailT } from "@/app/pages/Trips/TripsMainContent";
import { useAutocompleteSuggestions } from "@/hooks/useAutoCompleteSuggestions";
import { api } from "@/lib/axios";
import type { ApiSuccess } from "@/types/api.types";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation, type QueryObserverResult, type RefetchOptions } from "@tanstack/react-query";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import mystyle from "./style.module.css"
import { MapPinIcon } from "@phosphor-icons/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SignpostIcon } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";




function AddIternaryBox({ tripId, refetch, isPending }: { tripId: string, refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ApiSuccess<tripDetailT>, Error>>, isPending: boolean }) {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: "hsl(217, 63 %, 55 %)" }
    },
  });
  const [input, setInput] = useState("")
  const [query, setQuery] = useState("")
  const [loc, setLoc] = useState<google.maps.places.Place | null>(null)

  const [event, setEvent] = useState("")
  const [value, setValue] = useState<Dayjs>(dayjs());

  const mutation = useMutation({
    mutationKey: [tripId, "add iternary"],
    mutationFn: (e: { name: string, origin: number[], startTime: string, placeId: string, searchVariables: { city: string, country: string } }) => api.post(`/trips/${tripId}/itinerary`, e),
    onSuccess: async () => {
      await refetch()
      document.getElementById("addIternaryBox")?.hidePopover()
    },
    onError: () => toast.error("Please try again later")
  })



  const handleClick = async () => {

    // user have not selected the date 
    if (!value) {
      toast.error("Please select a date")
      return
    }

    // user has not clicked on any location
    if (!loc) {
      toast.error("Please select a location")
      return
    }

    //map error that its not giving address
    const address = loc.addressComponents
    if (!address) return

    //extracting city and country
    let city: string | null = null
    let country: string | null = null
    address.forEach(e => {
      if (e.types.includes("locality")) {
        city = e.longText
      }
      if (e.types.includes("country")) {
        country = e.longText
      }
    });


    //filling that name field
    const name = event || loc.displayName;
    //map error that its not giving display name
    if (!name) {
      toast.error("Please add event name")
      return
    }

    //map error that its not giving coordinates
    if (!loc.location) return


    //fallback if we did not find city and country
    if (!city) {
      city = name
    }
    if (!country) {
      country = name
    }


    //casting the request to server
    const body = {
      name,
      origin: [loc.location.lat(), loc.location.lng()],
      startTime: value.toISOString(),
      placeId: loc.id,
      searchVariables: { city, country }
    }
    mutation.mutate(body)

    setEvent("")
  }



  const { suggestions, resetSession } = useAutocompleteSuggestions(query)
  const places = useMapsLibrary('places');
  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) return;
      if (!suggestion.placePrediction) return;
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: [
          "addressComponents", "location", "displayName"
        ]
      });
      setLoc(place)
      setInput(place.displayName ? place.displayName : "")
      setQuery("")
      // calling fetchFields invalidates the session-token, so we now have to call
      // resetSession() so a new one gets created for further search
      resetSession();
    },
    [places, resetSession, setQuery]
  );


  return <div id="addIternaryBox" className={mystyle.addIternaryBox} popover="auto">
    <div className={mystyle.boxTitle}>
      Add Iternary Item
    </div>
    <div className={mystyle.eventBox}>
      <div><SignpostIcon size={22} /></div>
      <input placeholder="Event (optional)" value={event} onChange={e => setEvent(e.target.value)} />
    </div>
    <div>
      <div className={mystyle.searchBox}>
        <MapPinIcon size={22} />
        <input placeholder="Tokyo" value={input} onChange={e => { setInput(e.currentTarget.value); setQuery(e.currentTarget.value) }} />
      </div>
      <Suggestionbox suggestions={suggestions} handleSuggestionClick={handleSuggestionClick} />
    </div>
    <div >
      <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar className={mystyle.calBox} value={value} onChange={(newValue) => setValue(newValue)} />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
    <button onClick={handleClick} className={mystyle.submitBtn} disabled={isPending}>
      {
        mutation.isPending || isPending ? "loading" : "Add to iternary"
      }
    </button>
  </div>
}


export default AddIternaryBox



function Suggestionbox({ suggestions, handleSuggestionClick }: { suggestions: google.maps.places.AutocompleteSuggestion[], handleSuggestionClick: (suggestion: google.maps.places.AutocompleteSuggestion) => Promise<void>, }) {

  if (suggestions.length < 1) return null
  return <div className={mystyle.optionBox} >
    {
      suggestions.map(suggestion => <button key={suggestion.placePrediction?.placeId} className={mystyle.option} onClick={() => handleSuggestionClick(suggestion)}>
        <div className={mystyle.iconWrapper}>
          <MapPinIcon weight="fill" size={20} />
        </div>
        <span className={mystyle.suggestionText}>
          {suggestion.placePrediction?.text.text}
        </span>
      </button>
      )
    }
  </div >
}

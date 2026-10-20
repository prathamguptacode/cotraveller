import { MapPinIcon, Plus } from "@phosphor-icons/react"
import mystyle from "./Trips.module.css"
import { api } from "@/lib/axios"
import { CalendarIcon, ChatTeardropIcon } from "@phosphor-icons/react/dist/ssr"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AdvancedMarker, Map, useMapsLibrary } from "@vis.gl/react-google-maps"
import { useCallback, useEffect, useState } from "react"
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAutocompleteSuggestions } from "@/hooks/useAutoCompleteSuggestions"
// import { RoutesApi } from "@/features/mapRoutes/RoutesApi"
// import Routes from "@/features/mapRoutes/Routes"

type itineraryItem = {
  name: string,
  origin: { coordinates: number[] },
  startTime: string,
  placeId: string,
  searchVariables: { city: string, country: string }
}

type tripDetailT = {
  trip: {
    name: string,
    itineraryItems: itineraryItem[]
  },
  members: { user: { email: string } }[]
}

function TripsMainContent() {

  const mapId = import.meta.env.VITE_MAP_ID
  const params = useParams()
  const tripId = params.tripId
  const navigate = useNavigate()


  const { isPending, data, error } = useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => api.get<tripDetailT>(`/trips/${tripId}`)
  })

  if (isPending) {
    return <div>loading</div>
  }

  if (error) {
    return <div>Something went wrong</div>
  }

  if (!tripId) {
    return navigate("/")
  }

  // const key = import.meta.env.VITE_MAP_API
  // const apiClient = new RoutesApi(key)
  // const routeOptions = {
  //   computeAlternativeRoutes: false,
  //   units: 'METRIC',
  //   // intermediates: data.data.trip.itineraryItems.filter((e, i) => {
  //   //   if (i == 0) return false
  //   //   if (i == data.data.trip.itineraryItems.length - 1) return false
  //   //   return true
  //   // }).map((e) => {
  //   //   return { location: { latLng: { longitude: e.origin.coordinates[0], latitude: e.origin.coordinates[1] } } }
  //   // })
  // };
  //
  //
  // const originM = {
  //   lng: data.data.trip.itineraryItems[0].origin.coordinates[1],
  //   lat: data.data.trip.itineraryItems[0].origin.coordinates[0]
  // }
  //
  //
  // const destinationM = { lng: data.data.trip.itineraryItems[data.data.trip.itineraryItems.length - 1].origin.coordinates[1], lat: data.data.trip.itineraryItems[data.data.trip.itineraryItems.length - 1].origin.coordinates[0] }
  //

  // console.log("orgin", originM)
  // console.log("destination", destinationM)







  return (
    <div className={mystyle.wrapper}>
      <div className={mystyle.topBar}>
        <div className={mystyle.imgWrapper}>
          <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/8f/b2/89/photo0jpg.jpg?w=1200&h=1200&s=1" alt="trip photo" width="50px" height="50px" />
        </div>
        <div className={mystyle.tripInfo}>
          <div>{data.data.trip.name}</div>
          <div>
            {
              data.data.members.map((e, i) => {
                return <span key={i}>{e.user.email} {i < data.data.members.length - 1 ? ", " : null}</span>
              })
            }
          </div>
        </div>
        <div className={mystyle.iconBox}>
          <Link to={`/trips/${tripId}/calendar`}>
            <CalendarIcon size={28} />
          </Link>
          <Link to={`/trips/${tripId}/chats`}>
            <ChatTeardropIcon size={28} />
          </Link>
        </div>
      </div>
      <div className={mystyle.content}>
        <div>
          <Map
            defaultZoom={11}
            mapId={mapId}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            {/* <Routes */}
            {/*   apiClient={apiClient} */}
            {/*   origin={{ lng: data.data.trip.itineraryItems[0].origin.coordinates[1], lat: data.data.trip.itineraryItems[0].origin.coordinates[0] }} */}
            {/*   destination={{ lng: data.data.trip.itineraryItems[data.data.trip.itineraryItems.length - 1].origin.coordinates[1], lat: data.data.trip.itineraryItems[data.data.trip.itineraryItems.length - 1].origin.coordinates[0] }} */}
            {/*   routeOptions={routeOptions} */}
            {/* /> */}

            {
              data.data.trip.itineraryItems.map(e => {
                return <AdvancedMarker position={{ lat: e.origin.coordinates[0], lng: e.origin.coordinates[1] }}></AdvancedMarker>
              })
            }

          </Map>
        </div>
        <div className={mystyle.iternaryBox}>
          <button className={mystyle.addBtn} popoverTarget="addIternaryBox"><Plus size={24} /> </button>
          <AddIternaryBox tripId={tripId} />

          {
            data.data.trip.itineraryItems.map((e, i) => <IternaryItem key={i} title={e.name} description={e.searchVariables.country} date={e.startTime} hasNext={i < data.data.trip.itineraryItems.length - 1} placeId={e.placeId} />)
          }

        </div>
      </div>
    </div>
  )
}

export default TripsMainContent



function IternaryItem({ title, description, date, hasNext, placeId }: { title: string, description: string, date: string, hasNext: boolean, placeId?: string, }) {

  const strDate = new Date(date).toLocaleString("defautl", { day: "numeric", month: "long", year: "numeric" })
  const places = useMapsLibrary('places');
  const [place, setPlace] = useState<google.maps.places.Place | null>(null)

  useEffect(() => {
    if (!places) return
    (async () => {
      const place = new google.maps.places.Place({ id: placeId })
      await place.fetchFields({
        fields: ["photos"]
      })
      setPlace(place)
    })()
  }, [places])




  return <div className={mystyle.wrap}>
    <div className={mystyle.IternaryItem}>
      <div className={mystyle.frame}>
        <img src={place?.photos[0].getURI({ maxWidth: 150, maxHeight: 150 })} alt="iternary item photo" width="100px" height="100px" />
      </div>
      <div className={mystyle.con}>
        <div>{title}</div>
        <div>{description}</div>
      </div>
      <div className={mystyle.date}>
        {strDate}
      </div>
      {
        hasNext ?
          <div className={mystyle.stick} /> : null
      }
    </div>
  </div>
}


function AddIternaryBox({ tripId }: { tripId: string }) {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: `hsl(217, 63 %, 55 %)` }
    },
  });
  const [input, setInput] = useState("")
  const [query, setQuery] = useState("")
  const [loc, setLoc] = useState<google.maps.places.Place | null>(null)
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  const mutation = useMutation({
    mutationKey: [tripId, "add iternary"],
    mutationFn: (e: { name: string, origin: number[], startTime: string, placeId: string, searchVariables: { city: string, country: string } }) => api.post(`/trips/${tripId}/itinerary`, e)
  })

  const handleClick = async () => {
    if (!loc) return
    const address = loc?.addressComponents
    if (!address) return
    let city
    let country
    address.forEach(e => {
      if (e.types.includes("locality")) {
        city = e.longText
      }
      if (e.types.includes("country")) {
        country = e.longText
      }
    });
    const name = loc.displayName;
    if (!name) return
    if (!loc.location) return
    if (!city) {
      city = name
    }
    if (!country) {
      country = name
    }
    // ###not toaster
    if (!value) return
    const body = {
      name,
      origin: [loc.location.lat(), loc.location.lng()],
      startTime: value.toISOString(),
      placeId: loc.id,
      searchVariables: { city, country }
    }
    mutation.mutate(body)
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
    <button onClick={handleClick} className={mystyle.submitBtn}>Add to iternary</button>
  </div>
}



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


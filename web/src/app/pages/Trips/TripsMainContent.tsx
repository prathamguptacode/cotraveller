import { MapPinIcon, Plus } from "@phosphor-icons/react"
import mystyle from "./Trips.module.css"
import { api } from "@/lib/axios"
import { CalendarIcon, ChatTeardropIcon } from "@phosphor-icons/react/dist/ssr"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { Map } from "@vis.gl/react-google-maps"
import { useState } from "react"
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, ThemeProvider } from '@mui/material/styles';


type tripDetailT = {
  trip: {
    name: string,
  },
  members: { user: { email: string } }[]
}

function TripsMainContent() {

  const mapId = import.meta.env.VITE_MAP_ID
  const params = useParams()
  const tripId = params.tripId

  const { isPending, data, error } = useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => api.get<tripDetailT>(`/trip/${tripId}`)
  })

  if (isPending) {
    return <div>loading</div>
  }

  if (error) {
    return <div>Something went wrong</div>
  }

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
          <div><CalendarIcon size={28} /> </div>
          <div><ChatTeardropIcon size={28} /> </div>
        </div>
      </div>
      <div className={mystyle.content}>
        <div>
          <Map
            defaultZoom={11}
            mapId={mapId}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          />
        </div>
        <div className={mystyle.iternaryBox}>
          <button className={mystyle.addBtn} popoverTarget="addIternaryBox"><Plus size={24} /> </button>
          <AddIternaryBox />
          <IternaryItem title="Great Harry Poter House" description="go there and have fun" date="12 November 5:00pm" hasNext={true} />

          <IternaryItem title="Great Harry Poter House" description="go there and have fun" date="12 November 5:00pm" hasNext={true} />

          <IternaryItem title="Great Harry Poter House" description="go there and have fun" date="12 November 5:00pm" hasNext={true} />

          <IternaryItem title="Great Harry Poter House" description="go there and have fun" date="12 November 5:00pm" hasNext={true} />

          <IternaryItem title="Great Harry Poter House" description="go there and have fun" date="12 November 5:00pm" hasNext={true} />

          <IternaryItem title="Great Harry Poter House" description="go there and have fun" date="12 November 5:00pm" hasNext={false} />

        </div>
      </div>
    </div>
  )
}

export default TripsMainContent



function IternaryItem({ title, description, date, hasNext, placeId }: { title: string, description: string, date: string, hasNext: boolean, placeId?: string, }) {

  const src = "https://lh3.googleusercontent.com/grass-cs/AABkmLcp4HlQHcCFYKqDV4W72qR4lYUWqZ0i7OZwDxJKO0zzRregYzJ9tS9rLZyU81krvU9S01495pDiTjQqTcxIoKl8Fft_zITYoyDF44RQBMCyCW6HTFFuzkwUyhnuYy7-APBLsTGtqRuwBrp5=w408-h272-k-no"


  return <div className={mystyle.wrap}>
    <div className={mystyle.IternaryItem}>
      <div className={mystyle.frame}>
        <img src={src} alt="iternary item photo" width="100px" height="100px" />
      </div>
      <div className={mystyle.con}>
        <div>{title}</div>
        <div>{description}</div>
      </div>
      <div className={mystyle.date}>
        {date}
      </div>
      {
        hasNext ?
          <div className={mystyle.stick} /> : null
      }
    </div>
  </div>
}


function AddIternaryBox() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: `hsl(217, 63%, 55%)` }
    },
  });

  const [input, setInput] = useState("")
  const [value, setValue] = useState<Dayjs | null>(dayjs());


  return <div id="addIternaryBox" className={mystyle.addIternaryBox} popover="auto">
    <div className={mystyle.boxTitle}>
      Add Iternary Item
    </div>
    <div>
      <div className={mystyle.searchBox}>
        <MapPinIcon size={22} />
        <input placeholder="Tokyo" value={input} onChange={e => setInput(e.currentTarget.value)} />
      </div>
    </div>
    <div >
      <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar className={mystyle.calBox} value={value} onChange={(newValue) => setValue(newValue)} />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
    <button className={mystyle.submitBtn}>Add to iternary</button>
  </div>
}

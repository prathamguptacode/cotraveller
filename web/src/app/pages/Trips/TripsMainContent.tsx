import { Plus } from "@phosphor-icons/react"
import mystyle from "./Trips.module.css"
import { api } from "@/lib/axios"
import { CalendarIcon, ChatTeardropIcon, UserCirclePlusIcon } from "@phosphor-icons/react/dist/ssr"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { AdvancedMarker, Map, useMapsLibrary } from "@vis.gl/react-google-maps"
import { useEffect, useState } from "react"
import { getImgURL } from "@/lib/cloudinary"
import AddIternaryBox from "@/features/addIternary/AddIternary"
import InviteLinkBox from "@/features/inviteLinkBox/InviteLinkBox"


type itineraryItem = {
  name: string,
  origin: { coordinates: number[] },
  startTime: string,
  placeId: string,
  searchVariables: { city: string, country: string }
}

export type tripDetailT = {
  trip: {
    name: string,
    avatar: {
      publicId: string,
      version: number
    },
    itineraryItems: itineraryItem[]
  },
  members: { user: { email: string } }[]
}

type createInviteT = {
  tripId: string,
  inviteToken: string
}

const mapId = import.meta.env.VITE_MAP_ID

function TripsMainContent() {
  const { tripId } = useParams() as { tripId: string }

  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => api.get<tripDetailT>(`/trips/${tripId}`)
  })


  const inviteQuery = useQuery({
    enabled: false,
    queryKey: ["inviteReq", tripId],
    queryFn: () => api.get<createInviteT>(`/trips/${tripId}/invite`)
  })



  if (isPending) {
    return <div>loading</div>
  }

  if (error) {
    return <div>Something went wrong</div>
  }


  return (
    <div data-mobile-visible={true} className={mystyle.wrapper}>
      <div className={mystyle.topBar}>
        <div className={mystyle.imgWrapper}>
          <img src={(data.data.trip.avatar.publicId != "") ? getImgURL(data.data.trip.avatar, 200) : "tripIcon.webp"} alt="trip photo" width="50px" height="50px" />
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
          <Link to={`/${tripId}/calendar`}>
            <CalendarIcon size={28} />
          </Link>
          <Link to={`/${tripId}/chats`}>
            <ChatTeardropIcon size={28} />
          </Link>
          {/* ###looks ugly restyle position */}
          <button popoverTarget="linkBox" onClick={() => inviteQuery.refetch()}><UserCirclePlusIcon size={28} /></button>
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
            {
              data.data.trip.itineraryItems.map((e, i) => {
                return <AdvancedMarker key={i} position={{ lat: e.origin.coordinates[0], lng: e.origin.coordinates[1] }} />
              })
            }
          </Map>
        </div>
        <div className={mystyle.iternaryBox}>
          <button className={mystyle.addBtn} popoverTarget="addIternaryBox"><Plus size={24} /> </button>
          <AddIternaryBox tripId={tripId} refetch={refetch} isPending={isPending} />
          <InviteLinkBox tripId={tripId} tripName={data.data.trip.name} isLoading={inviteQuery.isPending} inviteToken={inviteQuery.data?.data.inviteToken} />
          {
            data.data.trip.itineraryItems.map((e, i) => <IternaryItem key={i} title={e.name} description={`${e.searchVariables.city}, ${e.searchVariables.country}`} date={e.startTime} hasNext={i < data.data.trip.itineraryItems.length - 1} placeId={e.placeId} />)
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
  }, [places, placeId])

  console.log(place)
  console.log(place?.photos)


  return <div className={mystyle.wrap}>
    <div className={mystyle.IternaryItem}>
      <div className={mystyle.frame}>
        <img src={(place?.photos && place.photos.length > 0) ? place.photos[0].getURI({ maxWidth: 150, maxHeight: 150 }) : ""} alt="item photo" width="100px" height="100px" />
      </div>
      <div className={mystyle.con}>
        <div>{title}</div>
        <div>{description}</div>
      </div>
      <div className={mystyle.date}>
        {strDate}
      </div>
      {hasNext ? <div className={mystyle.stick} /> : null}
    </div>
  </div>
}


import { Link, useParams } from 'react-router-dom'
import styles from './styles.module.css'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { getImgURL } from '@/lib/cloudinary'

type resT = { trip: trip }[]

type trip = {
    _id: string,
    name: string,
    avatar: { publicId: string, version: number },
    firstEvent: { startTime: string },
    lastEvent: { startTime: string },
    memberNumber: number
}

const SearchResults = () => {

    const params = useParams()
    const city = params.city as string
    const { data, isPending } = useQuery({
        queryKey: ["search", "results", city],
        queryFn: () => api.get<resT>(`/trips/search?query=${city}`)
    })

    // ###style no trips found page and loading page
    if (isPending) {
        return <div>loading</div>
    }


    return (
        <main className={styles.main}>
            <section className={styles.results}>
                {
                    (data && data.data.length > 0) ? data.data.map(e => <SearchResult city={city} key={e.trip._id} _id={e.trip._id} name={e.trip.name} avatar={e.trip.avatar} firstEvent={e.trip.firstEvent} lastEvent={e.trip.lastEvent} memberNumber={e.trip.memberNumber} />) : <div>No trip found</div>
                }
            </section>
        </main>
    )
}

export default SearchResults

const SearchResult = ({ _id, name, avatar, firstEvent, lastEvent, memberNumber, city }: trip & { city: string }) => {

    const startT = new Date(firstEvent.startTime)
    const endT = new Date(lastEvent.startTime)

    return (
        <Link to={`/${_id}`} className={styles.result}>
            <div className={styles.imageWrapper}>
                <img src={(avatar.publicId != "") ? getImgURL(avatar, 200) : "/tripIcon.webp"} alt="trip photo" />
            </div>
            <div className={styles.content}>
                <div className={styles.contentTop}>
                    <h3 className={styles.title}>
                        {name}
                    </h3>
                    <div data-mobile-only={true} className={styles.dateInfo}>
                        <span>{startT.toLocaleDateString("defautl", { day: "numeric", month: "long", year: "numeric" })}</span>
                        <span>-</span>
                        <span>{endT.toLocaleDateString("defautl", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                </div>

                <div className={styles.dateInfo}>
                    <span>{startT.toLocaleDateString("defautl", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span>-</span>
                    <span>{endT.toLocaleDateString("defautl", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.tags}>
                        <div className={styles.tag}>
                            <span>
                                {city}
                            </span>
                        </div>
                        <div className={styles.tag}>
                            <span>
                                {memberNumber > 1 ? `${memberNumber} travellers` : `solo travel`}
                            </span>
                        </div>
                        <div className={styles.tag}>
                            <span>
                                2 days ago
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

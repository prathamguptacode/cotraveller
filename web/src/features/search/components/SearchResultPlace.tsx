import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import styles from '../styles.module.css'
import { useEffect, useState } from 'react';
import { useCarousel } from '@/hooks/useCarousel';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';


type SearchResultPlaceProps = {
    placeId: string
}

const mapId = import.meta.env.VITE_MAP_ID

const SearchResultPlace = ({ placeId }: SearchResultPlaceProps) => {
    const places = useMapsLibrary('places')
    const [place, setPlace] = useState<google.maps.places.Place | null>(null)
    const { carouselRef, next, prev } = useCarousel()

    useEffect(() => {
        if (!places) return

        (async () => {
            const place = new google.maps.places.Place({ id: placeId })
            await place.fetchFields({
                fields: ["formattedAddress", "location", "photos"]
            })
            setPlace(place)
        })()

    }, [placeId, places])



    return (
        <div className={styles.placeInfo}>
            {
                (place && place.formattedAddress && place.formattedAddress.split(",").length >= 2) && (
                    <div className={styles.locDescription}>
                        <div>{place.formattedAddress.split(",")[0]}</div>
                        <div>
                            <span>{place.formattedAddress.split(",")[1]}</span>
                        </div>
                    </div>
                )
            }

            <div>
                <div className={styles.imgBox} ref={carouselRef}>
                    <div className={styles.embla__container}>
                        {
                            place?.photos?.map((e, i) => {
                                return (
                                    <div key={i} className={styles.embla__slide}>
                                        <img src={e.getURI({ maxWidth: 422, maxHeight: 750 })} alt="city photos" width="100%" />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button className={styles.prev} onClick={prev}><CaretLeftIcon size={20} /> </button>
                    <button className={styles.next} onClick={next}><CaretRightIcon size={20} /> </button>
                </div>
            </div>

            <div className={styles.mapWrapper}>
                {
                    (place?.location?.lat() && place?.location?.lng()) &&
                    <Map
                        defaultZoom={11}
                        mapId={mapId}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                        defaultCenter={{ lat: place.location.lat(), lng: place.location.lng() }}>
                        <MapController place={place} />
                    </Map>
                }
            </div>

        </div>
    )

}

export default SearchResultPlace


type MapControllerProps = {
    place: google.maps.places.Place | null
}

const MapController = ({ place }: MapControllerProps) => {
    const map = useMap()

    useEffect(() => {
        if (!map || !place?.location?.lat() || !place.location?.lng()) return
        map.panTo({ lat: place.location.lat(), lng: place.location.lng() })
        map.setZoom(11)

    }, [place, map])

    return null
}


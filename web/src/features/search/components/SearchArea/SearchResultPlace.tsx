import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useCarousel } from '@/hooks/useCarousel';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';

import styles from './result.module.css'


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
        <div className={styles.wrapper}>
            <div className={styles.carousel} ref={carouselRef}>
                <button data-button='prev' className={styles.carouselButton} onClick={prev}>
                    <CaretLeftIcon size={16} weight='bold' />
                </button>
                <div className={styles.imagesWrapper}>
                    {
                        place?.photos?.map((e, i) => {
                            return (
                                <div key={i} className={styles.imageWrapper}>
                                    <img src={e.getURI({ maxWidth: 422, maxHeight: 750 })} alt="city photos" width="100%" />
                                </div>
                            )
                        })
                    }
                </div>
                <button data-button='next' className={styles.carouselButton} onClick={next}>
                    <CaretRightIcon size={16} weight='bold' />
                </button>
            </div>


            <div className={styles.locationInfo}>
                <h1 className={styles.city}>
                    {place?.formattedAddress?.split(', ')[0]}
                </h1>
                <h2 className={styles.country}>
                    {place?.formattedAddress?.split(', ')[1]}
                </h2>
            </div>

            <div className={styles.mapArea}>
                <PlaceMap place={place} />
            </div>

        </div>
    )

}

export default SearchResultPlace




type PlaceMapProps = {
    place: google.maps.places.Place | null
}

const PlaceMap = ({ place }: PlaceMapProps) => {

    return (
        <div className={styles.mapWrapper}>
            {place?.location && (
                <Map
                    defaultZoom={11}
                    mapId={mapId}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    defaultCenter={{ lat: place.location.lat(), lng: place.location.lng() }}>
                    <MapController place={place} />
                </Map>
            )}
        </div>

    )
}




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


import { MagnifyingGlassIcon, MapPinIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useAnimatedPlaceholder } from '../hooks/useAnimatedPlaceHolder'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useAutocompleteSuggestions } from '@/hooks/useAutoCompleteSuggestions'
import { useNavigate } from 'react-router-dom'

import styles from '../styles.module.css'



const SearchBox = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery)
    const inputRef = useAnimatedPlaceholder()

    const resetSearchQuery = () => setSearchQuery('')


    return (
        <>
            <div className={styles.searchBox}>
                <MagnifyingGlassIcon size={24} />
                <input placeholder="Search for " ref={inputRef} value={searchQuery} onChange={e => setSearchQuery(e.currentTarget.value)} />
            </div>
            <SearchSuggestions debouncedSearchQuery={debouncedSearchQuery} resetSearchQuery={resetSearchQuery} />
        </>

    )
}

export default SearchBox




type SearchSuggestions = {
    debouncedSearchQuery: string,
    resetSearchQuery: () => void
}

function SearchSuggestions({ debouncedSearchQuery, resetSearchQuery }: SearchSuggestions) {
    const navigate = useNavigate()
    const places = useMapsLibrary('places');
    const { suggestions, resetSession } = useAutocompleteSuggestions(debouncedSearchQuery, {
        includedPrimaryTypes: ["locality"]
    })

    const handleSuggestionClick = async (suggestion: google.maps.places.AutocompleteSuggestion) => {
        if (!places || !suggestion.placePrediction) return

        const place = suggestion.placePrediction.toPlace()
        await place.fetchFields({
            fields: [
                "addressComponents"
            ]
        })
        // calling fetchFields invalidates the session-token, so we now have to call
        // resetSession() so a new one gets created for further search
        resetSession()
        resetSearchQuery()

        const city = place.addressComponents && place.addressComponents[0].longText
        const placeId = suggestion.placePrediction.placeId
        if (city && placeId) return navigate(`/results/${city}/${placeId}`)
    }



    return !!suggestions.length && (
        <div className={styles.optionBox}>
            {
                suggestions.map(suggestion => <button key={suggestion.placePrediction?.placeId} className={styles.option} onClick={() => handleSuggestionClick(suggestion)}>
                    <div className={styles.iconWrapper}>
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
    )
}


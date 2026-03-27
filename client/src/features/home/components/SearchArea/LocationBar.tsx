import React, { useEffect, useRef } from 'react'
import usePlace from 'use-places-autocomplete';
import mystyle from './search.module.css'
import { MdLocationPin } from "react-icons/md";

function LocationBar() {
    const locationIn = useRef<HTMLInputElement>(null);
    const {
        ready,
        value,
        setValue,
        suggestions: { data, status },
        clearSuggestions,
    } = usePlace({
        debounce: 300
    });
    function handleSelect(item: google.maps.places.AutocompletePrediction) {
        setValue(item.structured_formatting.main_text);
        clearSuggestions();
    }
    function handleClk() {
        if (locationIn.current) {
            setValue(locationIn.current.value)
        }
    }
    useEffect(() => {
        locationIn.current?.focus()
    }, [])
    return (
        <div className={mystyle.locationcamp}>
            <div className={mystyle.locationBox}>
                <MdLocationPin size={20} />
                <input type="text" placeholder='From Where?' ref={locationIn} className={mystyle.locationInput} onChange={(e) => setValue(e.target.value)} onClick={handleClk} disabled={!ready} autoFocus />
            </div>
        </div>
    )
}

export default LocationBar

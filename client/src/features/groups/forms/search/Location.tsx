import React, { useEffect, useRef } from 'react'
import usePlace from 'use-places-autocomplete';
import mystyle from './Location.module.css'
import { MapPin } from 'lucide-react';

function Location({ location, setLocation }: { location: string, setLocation: React.Dispatch<React.SetStateAction<string | null>> }) {

    const locationIn = useRef<HTMLInputElement>(null);
    const {
        ready,
        value,
        setValue,
        suggestions: { data, status },
        clearSuggestions,
    } = usePlace({
        debounce: 300,
    });
    function handleSelect(item: google.maps.places.AutocompletePrediction) {
        setLocation(item.structured_formatting.main_text);
        setValue(item.structured_formatting.main_text, false);
        clearSuggestions();
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value)
    }
    function handleClklocationcamp() {
        locationIn.current?.focus()
    }
    useEffect(() => {
        if (location) {
            if (locationIn.current) {
                setValue(location, false)
            }
        }
    }, [])


    return (
        <div>
            <div className={mystyle.locationcamp} onClick={handleClklocationcamp}>
                <input type="text" value={value} placeholder='From Where?' ref={locationIn} className={mystyle.locationInput} onChange={handleChange} disabled={!ready} />
                <div className={mystyle.suggestion}>


                    {
                        status === 'OK' &&
                        <ul>
                            {
                                data.splice(0, 4).map((item, index) => <li className={mystyle.suggestionTab} key={index} onClick={() => handleSelect(item)}>
                                    <div className={mystyle.suggestionIcon}>
                                        <MapPin />
                                    </div>
                                    <div>
                                        <div className={mystyle.mainLoc}>
                                            {item.structured_formatting.main_text}
                                        </div>
                                        <div className={mystyle.secondaryLoc}>{item.structured_formatting.secondary_text}</div>
                                    </div>
                                </li>)
                            }
                        </ul>
                    }
                </div>
            </div>
        </div>
    )
}

export default Location

import React, { useEffect, useRef } from 'react'
import usePlace from 'use-places-autocomplete';
import mystyle from './search.module.css'
import { MdLocationPin } from "react-icons/md";

function LocBar() {
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
        setValue(item.structured_formatting.main_text, false);
        clearSuggestions();
    }
    function handleClk() {
        // if (locationIn.current) {
        //     setValue(locationIn.current.value)
        // }
    }
    useEffect(() => {
        // locationIn.current?.focus()
    }, [])

    // console.log(data)

    return (
        <div className={mystyle.locationcamp}>
            <div className={mystyle.locationBox}>
                <MdLocationPin size={20} />
                <input type="text" value={value} placeholder='From Where?' ref={locationIn} className={mystyle.locationInput} onChange={(e) => setValue(e.target.value)} onClick={handleClk} disabled={!ready} />
            </div>
            {
                status === 'OK' &&
                <ul>
                    {
                        data.map((item, index) => <li style={{padding: '20px', background: 'red'}} key={index} onClick={() => handleSelect(item)}>
                            {
                                item.description
                            }
                        </li>)
                    }
                </ul>
            }
        </div>
    )
}

export default LocBar

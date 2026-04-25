import React, { useEffect, useRef } from 'react'
import usePlace from 'use-places-autocomplete';
import mystyle from './search.module.css'
import { MapPin } from 'lucide-react';

// const historyCards: {
//     index: number,
//     value: string
// }[] = [
//         {
//             index: 0,
//             value: "IIT Roorkie"
//         },
//         {
//             index: 1,
//             value: "IIT Dhanbad"
//         },
//         {
//             index: 2,
//             value: "VIT Chennai"
//         },
//         {
//             index: 3,
//             value: "Paris"
//         },
//     ]

function LocBar({ setLocation, location }: { setLocation: React.Dispatch<React.SetStateAction<string | null>>, location: string | null }) {
    const locationIn = useRef<HTMLInputElement>(null);
    // const [history, setHistory] = useState("none");
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
        setLocation(item.structured_formatting.main_text);
        setValue(item.structured_formatting.main_text, false);
        clearSuggestions();
    }
    // function handleClk() {
    //     if (locationIn.current) {
    //         setValue(locationIn.current.value)
    //         if (!locationIn.current.value) {
    //             setHistory('block')
    //         }
    //     }
    // }
    // function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    //     setValue(e.target.value);
    //     setHistory('none')
    // }
    // function handleClkHistory(e: number) {
    //     if (locationIn.current) {
    //         const val = historyCards[e].value
    //         setValue(val)
    //         setHistory("none")
    //     }
    // }
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
        <div className={mystyle.locationcamp} onClick={handleClklocationcamp}>
            <div className={mystyle.locationBox}>
                <MapPin />
                <input type="text" value={value} placeholder='From Where?' ref={locationIn} className={mystyle.locationInput} onChange={handleChange} disabled={!ready} />
            </div>
            <div className={mystyle.suggestion}>


                {
                    status === 'OK' &&
                    <ul>
                        {
                            data.map((item, index) => <li className={mystyle.suggestionTab} key={index} onClick={() => handleSelect(item)}>
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
                {/* <ul style={{ display: history }}>
                    {
                        historyCards.map((e) => <li onClick={() => handleClkHistory(e.index)}>{e.value}</li>)
                    }
                </ul> */}
            </div>
        </div>
    )
}

export default LocBar

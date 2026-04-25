import mystyle from './search.module.css'
import { IoMdSearch } from "react-icons/io";
import { useLoadScript, type Libraries } from '@react-google-maps/api'
import LocBar from './LocBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';

const lib: Libraries = ["places"]
const Currentdate = new Date();

function Searchbox({ dLocation, dDate }: { dLocation: string | null, dDate: string | null }) {
    const navigate = useNavigate();
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
        region: 'in',
        libraries: lib
    })
    const [location, setLocation] = useState(dLocation);
    let defaultDate = `${Currentdate.getFullYear()}-${(Currentdate.getMonth() + 1).toString().padStart(2, "0")}-${Currentdate.getDate().toString().padStart(2, "0")}`;
    if (dDate) {
        defaultDate = dDate;
    }
    const [date, setdate] = useState<string | null>(defaultDate);
    const [query] = useSearchParams();
    async function search() {
        if (!location) {
            return toast.error('Please select a Location');
        }
        if (!date) {
            return toast.error('Please select a Date');
        }
        const time = query.get('time')
        const members = query.get('members')
        const travelMode = query.get('travelMode')
        const tags = query.getAll('tags')

        navigate(`/viewgroup?q=${location}&date=${date}&members=${members}&time=${time}&travelMode=${travelMode}&tags=${tags[0]}&tags=${tags[1]}&tags=${tags[2]}&tags=${tags[3]}`)

    }

    // ###closing the location box 

    return (
        <>
            <div className={mystyle.searchbox}>
                {
                    isLoaded ? <LocBar setLocation={setLocation} location={location} /> : (<div className={mystyle.loadingLoc}>
                        <MapPin />
                        Loading...
                    </div>)
                }
                <div className={mystyle.dateIn}>
                    <div>
                        Departure
                    </div>
                    <input type="date" defaultValue={defaultDate} onChange={(e) => setdate(e.target.value)} />
                </div>
            </div>
            <div className={mystyle.btnbox}>
                <button aria-label='Search' className={mystyle.searchbtn} onClick={search}>
                    <IoMdSearch size="20px" />
                    Find groups
                </button>
            </div>
        </>
    )
}

export default Searchbox

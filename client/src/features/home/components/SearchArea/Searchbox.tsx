import mystyle from './search.module.css'
import { IoMdSearch } from "react-icons/io";
import { useLoadScript, type Libraries } from '@react-google-maps/api'
import { MdLocationPin } from "react-icons/md";
import LocBar from './LocBar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

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
    async function search() {
        if (!location) {
            return toast.error('Please select a Location');
        }
        if (!date) {
            return toast.error('Please select a Date');
        }
        navigate(`/viewgroup?q=${location}&date=${date}`)
    }

    // ###closing the location box 

    return (
        <div>
            <div className={mystyle.searchbox}>
                {
                    isLoaded ? <LocBar setLocation={setLocation} location={location} /> : (<div className={mystyle.loadingLoc}>
                        <MdLocationPin size={20} />
                        Loading...
                    </div>)
                }
                <div className={mystyle.dateIn}>
                    <div>
                        Departure Date:
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
        </div>
    )
}

export default Searchbox

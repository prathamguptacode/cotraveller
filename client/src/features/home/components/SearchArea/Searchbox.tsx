import mystyle from './search.module.css'
import { IoMdSearch } from "react-icons/io";
import { useLoadScript, type Libraries } from '@react-google-maps/api'
import { MdLocationPin } from "react-icons/md";
import LocBar from './LocBar';

const lib: Libraries = ["places"]

function Searchbox() {


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
        region: 'in',
        libraries: lib
    })

    async function search() {
        console.log('btn clk')
    }



    return (
        <div>
            <div className={mystyle.searchbox}>
                {
                    isLoaded ? <LocBar /> : (<div className={mystyle.loadingLoc}>
                        <MdLocationPin size={20} />
                        Loading...
                    </div>)
                }
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

import { Link } from 'react-router-dom'
import styles from './styles.module.css'

const history = [
    {
        url: "london.webp",
        city: "London",
        country: "England",
        link: "/search/London/ChIJdd4hrwug2EcRmSrV3Vo6llI"
    },
    {
        url: "paris.webp",
        city: "Paris",
        link: "/search/Paris/ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
        country: "France"
    },
    {
        url: "berlin.webp",
        city: "Berlin",
        link: "/search/Berlin/ChIJAVkDPzdOqEcRcDteW0YgIQQ",
        country: "Germany"
    },
    {
        url: "rome.webp",
        city: "Rome",
        link: "/search/Rome/ChIJu46S-ZZhLxMROG5lkwZ3D7k",
        country: "Italy"
    },
    {
        url: "tokyo.webp",
        city: "Tokyo",
        link: "/search/Tokyo/ChIJXSModoWLGGARILWiCfeu2M0",
        country: "Japan"
    },
    // {
    //     url: "bali.webp",
    //     city: "Bali",
    //     link: "",
    //     country: "Indonesia"
    // },
]

const SearchHistory = () => {
    return (
        <div className={styles.historyBox}>
            {history.map(e => <CityBox key={e.url} url={e.url} city={e.city} country={e.country} link={e.link} />)}
        </div>
    )
}

export default SearchHistory


function CityBox({ url, city, country, link }: { url: string, city: string, country: string, link: string }) {
    return <Link to={link} className={styles.cityBox}>
        <img src={url} alt="city image" width="100%" />
        <div className={styles.content}>
            <div>{city}</div>
            <div>{country}</div>
        </div>
    </Link>
}

import styles from '../styles.module.css'

const history = [
    {
        url: "london.webp",
        city: "London",
        country: "England"
    },
    {
        url: "paris.webp",
        city: "Paris",
        country: "France"
    },
    {
        url: "berlin.webp",
        city: "Berlin",
        country: "Germany"
    },
    {
        url: "rome.webp",
        city: "Rome",
        country: "Italy"
    },
    {
        url: "tokyo.webp",
        city: "Tokyo",
        country: "Japan"
    },
    {
        url: "bali.webp",
        city: "Bali",
        country: "Indonesia"
    },
]

const SearchHistory = () => {
    return (
        <div className={styles.historyBox}>
            {history.map(e => <CityBox key={e.url} url={e.url} city={e.city} country={e.country} />)}
        </div>
    )
}

export default SearchHistory


function CityBox({ url, city, country }: { url: string, city: string, country: string }) {
    return <div className={styles.cityBox}>
        <img src={url} alt="city image" width="100%" />
        <div className={styles.content}>
            <div>{city}</div>
            <div>{country}</div>
        </div>
    </div>
}

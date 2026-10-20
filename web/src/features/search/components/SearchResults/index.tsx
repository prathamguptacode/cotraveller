import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import leon from '@/assets/leon.jpeg'

const members = Array(20).fill('')
const results = Array(10).fill('')

const SearchResults = () => {
    return (
        <main className={styles.main}>
            <section className={styles.results}>
                {results.map((_, i) => {
                    return (
                        <SearchResult key={i} />
                    )
                })}
            </section>
        </main>
    )
}

export default SearchResults

const SearchResult = () => {
    return (
        <article className={styles.result}>
            <div className={styles.imageWrapper}>
                <img src="/tokyo.webp" alt="trip-display-picture" />
            </div>
            <div className={styles.content}>
                <div className={styles.contentTop}>
                    <Link to={'/'}>
                        <h3 className={styles.title}>
                            Hill Top Swiss Cottage
                        </h3>
                    </Link>
                    <div data-mobile-only={true} className={styles.dateInfo}>
                        24 Aug - 1 Sep
                    </div>
                </div>

                <div className={styles.lineBreak}></div>
                <div className={styles.dateInfo}>
                    24 Aug - 1 Sep
                </div>
                <p className={styles.description}>
                    Located at the Himalayan foothills, surrounded by luxuriant forests, Hill Top Swiss Cottage offers sweeping views of the hills and the Holy Ganga.
                </p>
                <div className={styles.bottom}>
                    <div className={styles.tags}>
                        <div className={styles.tag}>
                            <span>
                                Tokyo, Japan
                            </span>
                        </div>
                        <div className={styles.tag}>
                            <span>
                                {members.length} travellers
                            </span>
                        </div>
                        <div className={styles.tag}>
                            <span>
                                2 days
                            </span>
                        </div>
                    </div>
                    <div className={styles.members}>
                        {members.slice(0, 5).map((_, i) => {
                            return (
                                <Link to={`/`} key={i} className={styles.member}>
                                    <div className={styles.avatarWrapper}>
                                        <img src={leon} alt="user-avatar" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>


            </div>
        </article>
    )
}

import Banner from '@/components/homepage/Banner'
import Searchbox from '@/components/homepage/Searchbox'
import styles from './home.module.css'
import DiscoverBox from '@/components/homepage/DiscoverBox'
import LiveGroups from '@/components/homepage/LiveGroups'
import FAQ from '@/components/homepage/FAQ/FAQ'

const Home = () => {
  return (
    <>
      <Banner />
      <main className={styles.wrapper}>
        <Searchbox />
        <div className={styles.bottomWrapper}>
          <DiscoverBox />
          <LiveGroups />
          <FAQ />
        </div>
      </main>

    </>


  )
}

export default Home

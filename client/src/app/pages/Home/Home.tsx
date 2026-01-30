import Banner from '@/features/home/components/Banner'
import Searchbox from '@/features/home/components/SearchArea/Searchbox'
import styles from './home.module.css'
import DiscoverBox from '@/features/home/components/DiscoverBox'
import LiveGroups from '@/features/home/components/LiveGroups'
import FAQ from '@/features/home/components/FAQS'

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

import React from 'react'
import ThemeButton from '../../components/Buttons/ThemeButton'
import Navbar from '../../components/homepage/Navbar'
import Banner from '../../components/homepage/Banner'
import Searchbox from '../../components/homepage/Searchbox'
import styles from './home.module.css'
import DiscoverBox from '../../components/homepage/DiscoverBox'
import LiveGroups from '../../components/homepage/LiveGroups'

const Home = () => {
  return (
    <>
      <Banner />
      <div className={styles.wrapper}>
        <Searchbox />
        <div className={styles.bottomWrapper}>
          <DiscoverBox />
          <LiveGroups />
        </div>
      </div>

    </>


  )
}

export default Home

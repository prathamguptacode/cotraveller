import React from 'react'
import ThemeButton from '../../components/Buttons/ThemeButton'
import Navbar from '../../components/homepage/Navbar'
import Banner from '../../components/homepage/Banner'
import Searchbox from '../../components/homepage/Searchbox'
import styles from './home.module.css'

const Home = () => {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <Banner />
      <Searchbox />
    </div>
  )
}

export default Home

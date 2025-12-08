import React from 'react'
import ThemeButton from '../../components/Buttons/ThemeButton'
import Navbar from '../../components/homepage/Navbar'
import Banner from '../../components/homepage/Banner'
import Searchbox from '../../components/homepage/Searchbox'
import styles from './home.module.css'
import DiscoverBox from '../../components/homepage/discoverBox'
import LiveGroups from '../../components/homepage/LiveGroups'

const Home = () => {
  return (
    <>
      <Banner />
      <Searchbox />
      <DiscoverBox />
      < LiveGroups />
    </>


  )
}

export default Home

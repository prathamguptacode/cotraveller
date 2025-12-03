import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import mystyle from './Searchbar.module.css'

function Searchbar() {
    const {theme , toggleTheme} = useTheme()
    //college
    //transport
    //date
    //timerange
  return (
    <div className={mystyle.searchbar}>
      <div className={mystyle.inbx}>
      </div>
    </div>
  )
}

export default Searchbar

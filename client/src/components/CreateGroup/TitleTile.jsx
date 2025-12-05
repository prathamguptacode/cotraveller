import React from 'react'
import mystyle from './CreateGroup.module.css'

function TitleTile() {


  return (
    <div className={mystyle.titleTile}>
        <div className={mystyle.strip}></div>
      <div className={mystyle.title}>Your Group Information</div>
      <div className={mystyle.con}>Find your next bestie, flight mate, or chaos buddy.</div>
    </div>
  )
}

export default TitleTile

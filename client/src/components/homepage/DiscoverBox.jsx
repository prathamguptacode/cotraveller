import React from 'react'
import mystyle from './homepage.module.css'
import clsx from 'clsx'

function DiscoverBox() {
  return (
    <div className={mystyle.discoverbx}>
      <div className={mystyle.can}>
        <div className={mystyle.discoverTitle}>Your next trip starts with one search.</div>
        <div className={mystyle.discoverContent}>Find travellers heading to the same destination, connect instantly, and join plans that match your vibe.</div>
      </div>
      <div className={mystyle.disbtnbx}><button className={clsx(mystyle.discoverBtn, mystyle.inhover)}>Explore</button></div>
    </div>
  )
}

export default DiscoverBox

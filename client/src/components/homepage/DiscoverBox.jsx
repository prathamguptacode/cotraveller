import React from 'react'
import mystyle from './homepage.module.css'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

function DiscoverBox() {

    const navigate=useNavigate()

    function handleClick(){
        navigate('/viewgroup?q=VIT%20Chennai&mode=Airplane&lowerT=2025-12-20T00:00&upperT=2025-12-20T23:59&d=20&m=December&y=2025')
    }

  return (
    <div className={mystyle.discoverbx}>
      <div className={mystyle.can}>
        <div className={mystyle.discoverTitle}>Your next trip starts with one search.</div>
        <div className={mystyle.discoverContent}>Find travellers heading to the same destination, connect instantly, and join plans that match your vibe.</div>
      </div>
      <button aria-label='Explore' onClick={handleClick} className={clsx(mystyle.discoverBtn, mystyle.inhover)}>Explore</button>
    </div>
  )
}

export default DiscoverBox

import mystyle from '../home.module.css'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

function DiscoverBox() {

  const discoverURL = '/viewgroup?q=VIT%20Chennai&mode=Airplane&lowerT=2025-12-20T00:00&upperT=2025-12-20T23:59&d=20&m=December&y=2025'

  return (
    <div className={mystyle.discoverbx}>
      <div>
        <div className={mystyle.discoverTitle}>Your next trip starts with one search.</div>
        <div className={mystyle.discoverContent}>Find travellers heading to the same destination, connect instantly, and join plans that match your vibe.</div>
      </div>
      <Link to={discoverURL} aria-label='Explore' className={clsx(mystyle.discoverBtn, mystyle.inhover)}>Explore</Link>
    </div>
  )
}

export default DiscoverBox

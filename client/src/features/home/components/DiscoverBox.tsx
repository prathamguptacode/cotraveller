import mystyle from '../home.module.css'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

function DiscoverBox() {

  // const Currentdate = new Date()
  // const defaultDate = `${Currentdate.getFullYear()}-${(Currentdate.getMonth() + 1).toString().padStart(2, "0")}-${Currentdate.getDate().toString().padStart(2, "0")}`;
  // const discoverURL = `/viewgroup?date=${defaultDate}`
  const discoverURL = `/explore`

  return (
    <div className={mystyle.discoverbx}>
      <div>
        <div className={mystyle.discoverTitle}>Your next trip starts with one search.</div>
        <div className={mystyle.discoverContent}>Find your vibe, meet your people, and travel together.</div>
      </div>
      <Link to={discoverURL} aria-label='Explore' className={clsx(mystyle.discoverBtn, mystyle.inhover)}>Explore</Link>
    </div>
  )
}

export default DiscoverBox

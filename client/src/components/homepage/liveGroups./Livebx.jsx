import React from 'react'
import mystyle from './livebx.module.css'
import { MdGroups } from "react-icons/md";

function Livebx({mode,num}) {
  return (
    <div className={mystyle.box}>
        <div className={mystyle.content}>
            < MdGroups size="28px" />
            Live {mode} Groups
            </div>
        <div className={mystyle.num}>{num}</div>
    </div>
  )
}

export default Livebx

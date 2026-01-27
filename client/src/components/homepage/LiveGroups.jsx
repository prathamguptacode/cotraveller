import React, { useEffect, useRef, useState } from 'react'
import mystyle from './homepage.module.css'
import clsx from 'clsx'
import Livebx from './liveGroups./Livebx'
import { api } from '../../api/axios'

function LiveGroups() {

    const [airNum,setAirNum]=useState(0)
    const [railNum,setRailNum]=useState(0)
    const [taxiNum,setTaxiNum]=useState(0)
    const airplane=useRef()
    const train=useRef()
    const taxi=useRef()

    useEffect(()=>{
        (async () => {
            const res=await api.get('group/getnumbers')
            const val=res.data?.data
            if(val[0]){
                if(val[0]._id == "Airplane"){
                    const num=val[0].count
                    setAirNum(num)
                }
                if(val[0]._id == "Railway"){
                    const num=val[0].count
                    setRailNum(num)
                }
                if(val[0]._id == "Taxi"){
                    const num=val[0].count
                    setTaxiNum(num)
                }
            }
            if(val[1]){
                if(val[1]._id == "Airplane"){
                    const num=val[1].count
                    setAirNum(num)
                }
                if(val[1]._id == "Railway"){
                    const num=val[1].count
                    setRailNum(num)
                }
                if(val[1]._id == "Taxi"){
                    const num=val[1].count
                    setTaxiNum(num)
                }
            }
            if(val[2]){
                if(val[2]._id == "Airplane"){
                    const num=val[2].count
                    setAirNum(num)
                }
                if(val[2]._id == "Railway"){
                    const num=val[2].count
                    setRailNum(num)
                }
                if(val[2]._id == "Taxi"){
                    const num=val[2].count
                    setTaxiNum(num)
                }
            }
        })()
    },[])
    

  return (
    <div className={mystyle.livebx}>
      <div className={mystyle.livetitle}>Find cotravellers from your college to anywhere</div>
      <div className={mystyle.livebtnbx}>
        <button aria-label='Ariplane' className={clsx(mystyle.livebtn)} ref={airplane} >Airplane</button>
        <button aria-label='Railway' className={mystyle.livebtn} ref={train}>Railway</button>
        <button aria-label='Taxi' className={mystyle.livebtn} ref={taxi}>Taxi</button>
      </div>
      <div className={mystyle.livegrp}>
        <Livebx mode="Airplane" num={airNum}/>
        <Livebx mode="Train" num={railNum} />
        <Livebx mode="Taxi" num={taxiNum} />
      </div>
    </div>
  )
}

export default LiveGroups

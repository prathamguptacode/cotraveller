import { useEffect, useState } from 'react'
import Searchbox from '@/features/home/components/SearchArea/Searchbox'
import mystyle from './ViewGroup.module.css'
import { useSearchParams } from 'react-router-dom'
import { api } from '@/api/axios'
import Group from '@/components/viewgroup/Group'
import NoGroup from '../success/NoGroup'
import { loaderEvent } from '@/api/mitt'
import { Modes, Months, type Mode, type Month } from '@/types/constants.types'

function ViewGroup() {
    const [groupData, setGroupData] = useState([])
    const [localLoader, setLocalLoader] = useState(true)

    const [query] = useSearchParams()
    const location = query.get("q");
    const date = query.get("date");
    // <NoGroup />


    useEffect(() => {
        console.log('query changed')
    }, [query])

    return (
        <div className={mystyle.wrapper}>
            {/* <Searchbox l={location} md={mode} d={d} m={m} y={y} w="1920px" /> */}
            {/* <div className={mystyle.groupSection} >
                {localLoader ? <div className={mystyle.loader} /> : groupData.length == 0 ? <NoGroup /> : groupData.map(element => {
                    return <Group element={element} />
                })}
            </div> */}
            <Searchbox />
            <NoGroup />
        </div>

    )
}

export default ViewGroup

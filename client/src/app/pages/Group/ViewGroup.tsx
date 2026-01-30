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
    const mode = query.get("mode");
    const d = query.get("d");
    const m = query.get("m");
    const y = query.get("y");
    const isMonth = (m: string): m is Month => Months.includes(m as Month)
    const isMode = (mode: string): mode is Mode => Modes.includes(mode as Mode)
    if (!location || !mode || !d || !m || !y || !isMonth(m) || !isMode(mode)) return <NoGroup />


    useEffect(() => {
        const location = query.get("q");
        const mode = query.get("mode");
        const lowerT = query.get("lowerT");
        const upperT = query.get("upperT");
        (async () => {
            setLocalLoader(true)
            loaderEvent.emit('startLoading')
            const body = {
                mode: mode,
                lowerTime: lowerT,
                upperTime: upperT,
                intialLocation: location
            }
            try {
                const res = await api.post("/group/viewgroupbyfilter", body)
                setGroupData(res.data.data)
                setLocalLoader(false)
            } catch (error) {
                //something went wrong page
                console.error(error)
            } finally {
                loaderEvent.emit('stopLoading')
            }
        })()
    }, [query])

    return (
        <div className={mystyle.wrapper}>
            <Searchbox l={location} md={mode} d={d} m={m} y={y} w="1920px" />
            <div className={mystyle.groupSection} >
                {localLoader ? <div className={mystyle.loader} /> : groupData.length == 0 ? <NoGroup /> : groupData.map(element => {
                    return <Group element={element} />
                })}
            </div>

        </div>

    )
}

export default ViewGroup

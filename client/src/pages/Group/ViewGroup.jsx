import React, { useEffect, useState } from 'react'
import Navbar from '../../components/homepage/navbar'
import Searchbox from '../../components/homepage/Searchbox'
import mystyle from './ViewGroup.module.css'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../api/axios'
import Group from '../../components/viewgroup/Group'

function ViewGroup() {

    const [groupData,setGroupData]=useState([])
    console.log(groupData)

    const [query] = useSearchParams()
    const location = query.get("q");
    const mode = query.get("mode");
    const d = query.get("d");
    const m = query.get("m");
    const y = query.get("y");

    useEffect(() => {
        const location = query.get("q");
        const mode = query.get("mode");
        const lowerT = query.get("lowerT");
        const upperT = query.get("upperT");
        (async () => {
            const body = {
                mode: mode,
                lowerTime: lowerT,
                upperTime: upperT,
                intialLocation: location
            }
            try {
                const res = await api.post("/group/viewgroupbyfilter", body)
                setGroupData(res.data.data)
            } catch (error) {
                //something went wrong page
            }
        })()
    }, [query])

    return (
        <div>
            <Navbar />
            <Searchbox l={location} md={mode} d={d} m={m} y={y} w="1920px" tempMargin='64px' />
            <div className={mystyle.groupSection}>
                {groupData.map(element => {
                    console.log(element)
                    return <Group element={element} />
                })}
            </div>
        </div>
    )
}

export default ViewGroup

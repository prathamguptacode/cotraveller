import React, { useEffect } from 'react'
import Navbar from '../../components/homepage/navbar'
import Searchbox from '../../components/homepage/Searchbox'
import mystyle from './ViewGroup.module.css'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../api/axios'

function ViewGroup() {

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
            const res = await api.post("/group/viewgroupbyfilter", body)
            console.log(res)
            console.log(body)
        })()

    }, [query])

    return (
        <div>
            <Navbar />
            <Searchbox l={location} md={mode} d={d} m={m} y={y} />
            <div className={mystyle.groupwrapper}>
                hello world
            </div>
        </div>
    )
}

export default ViewGroup

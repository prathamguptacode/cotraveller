import { useEffect, useState } from 'react'
import Searchbox from '@/features/home/components/SearchArea/Searchbox'
import mystyle from './ViewGroup.module.css'
import { data, useSearchParams } from 'react-router-dom'
import { api } from '@/api/axios'
import Group from '@/components/viewgroup/Group'
import NoGroup from '../success/NoGroup'
import { useQuery } from '@tanstack/react-query'

type Group = {
    _id: string,
    title: string,
    content: string,
    memberNumber: 3,
    travelDate: string,
    incomingRequests: string[],
    ownerPop: {
        fullName: string
    }
}

type Groups = {
    groups: Group[],
}

function ViewGroup() {
    const [query] = useSearchParams()
    const location = query.get("q");
    const date = query.get("date");
    const { data: groups } = useQuery({
        queryKey: ["groups", location,date],
        queryFn: () => {
            return api.get<Groups>(`groups/viewgroupbyfilter?intialLocation=${location}&travelDate=${date}`)
        },
        select(data) {
            return data.data.groups
        },
    })

    return (
        <div className={mystyle.wrapper}>
            <Searchbox dLocation={location} dDate={date} />
            <p>
                {
                groups && groups.length>0 ? groups.map(e=><Group element={e} />) : <NoGroup />
                }
            </p>
        </div>

    )
}

export default ViewGroup

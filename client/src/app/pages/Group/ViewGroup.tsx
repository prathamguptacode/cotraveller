import Searchbox from '@/features/home/components/SearchArea/Searchbox'
import mystyle from './ViewGroup.module.css'
import { Navigate, useSearchParams } from 'react-router-dom'
import { api } from '@/api/axios'
import Group from '@/components/viewgroup/Group'
import NoGroup from '../Extras/NoGroup'
import { useQuery } from '@tanstack/react-query'
import LoadingPage from '../Extras/LoadingPage'

// ###fix the commentsss

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
    const time = query.get('time')
    const members = query.get('members')
    const travelMode = query.get('travelMode')
    const tags = query.getAll('tags')
    const { data: groups, isLoading, isError } = useQuery({
        queryKey: ["groups", location, date],
        queryFn: () => {
            return api.get<Groups>(`groups/viewgroupbyfilter?intialLocation=${location}&travelDate=${date}`)
        },
        select(data) {
            return data.data.groups
        },
    })
    // u may wanna fix it
    if (isError) {
        return <Navigate to={'/error'} />
    }

    return (
        <div className={mystyle.wrapper}>
            <Searchbox dLocation={location} dDate={date} />
            {isLoading ? <LoadingPage /> :
                <div>
                    {
                        groups && groups.length > 0 ? groups.map(e => <Group element={e} />) : <NoGroup />
                    }
                </div>
            }
        </div>

    )
}

export default ViewGroup

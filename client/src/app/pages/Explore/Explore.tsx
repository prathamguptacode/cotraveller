import Searchbox from '@/features/home/components/SearchArea/Searchbox'
import mystyle from './Explore.module.css'
import { Navigate } from 'react-router-dom'
import { api } from '@/api/axios'
import Group from '@/components/viewgroup/Group'
import NoGroup from '../Extras/NoGroup'
import { useQuery } from '@tanstack/react-query'
import LoadingPage from '../Extras/LoadingPage'

type GroupT = {
    _id: string,
    title: string,
    content: string,
    memberNumber: number,
    travelDate: string,
    incomingRequests: string[],
    member: string[]
    ownerPop: {
        fullName: string
    }
}

type Groups = {
    groups: GroupT[],
}

function ViewGroup() {

    const { data: groups, isLoading, isError } = useQuery({
        queryKey: ["groups", location, "explore"],
        queryFn: () => {
            const url = `groups/viewgroupbyfilter`;
            return api.get<Groups>(url)
        },
        select(data) {
            return data.data.groups
        },
    })
    if (isLoading) {
        return <LoadingPage />
    }
    if (isError) {
        return <Navigate to={'/error'} />
    }

    return (
        <div className={mystyle.wrapper}>
            <Searchbox dLocation={null} dDate={null} />
            <div>

                <div>
                    {
                        groups && groups.length > 0 ? groups.map(group => <Group group={group} key={group._id} />) : <NoGroup />
                    }
                </div>

            </div>
        </div>
    )
}

export default ViewGroup

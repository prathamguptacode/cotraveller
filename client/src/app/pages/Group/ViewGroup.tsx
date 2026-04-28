import Searchbox from '@/features/home/components/SearchArea/Searchbox'
import mystyle from './ViewGroup.module.css'
import { Navigate, useSearchParams } from 'react-router-dom'
import { api } from '@/api/axios'
import Group from '@/components/viewgroup/Group'
import NoGroup from '../Extras/NoGroup'
import { useQuery } from '@tanstack/react-query'
import LoadingPage from '../Extras/LoadingPage'
import { z } from 'zod'
import { useEffect } from 'react'

// ###fix the commentsss
type GroupT = {
    _id: string,
    title: string,
    content: string,
    memberNumber: number,
    travelDate: string,
    incomingRequests: string[],
    ownerPop: {
        fullName: string
    }
}

type Groups = {
    groups: GroupT[],
}

const querySchema = z.object({
    location: z.string(),
    date: z.string(),
    members: z.coerce.number().refine(val => (val >= 2 && val <= 5) || val == 32).nullable(),
    mode: z.enum(["Train", "Flight", "Taxi", "Car", "Bike"]).nullable(),
    tags: z.array(z.enum(["no alcohol", "girls only", "budget friendly", "pet friendly"])),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable()
})

function ViewGroup() {
    const [query] = useSearchParams()
    const location = query.get("q");
    const date = query.get("date");

    // check query
    const membersQ = query.get('members')
    const locationQ = query.get("q");
    const dateQ = query.get("date");
    const modeQ = query.get("mode");
    const tagsQ = query.getAll("tags");
    const timeQ = query.get("time")
    const validateQuery = querySchema.safeParse({ location: locationQ, date: dateQ, members: membersQ, mode: modeQ, tags: tagsQ, time: timeQ })

    const { data: groups, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ["groups", location, date],
        queryFn: () => {
            let url = `groups/viewgroupbyfilter?intialLocation=${location}&travelDate=${date}`;
            if (validateQuery.data?.members) {
                const text = `&memberNumber=${validateQuery.data.members}`
                url = url.concat(text)
            }
            if (validateQuery.data?.mode) {
                const text = `&mode=${validateQuery.data.mode}`
                url = url.concat(text)
            }
            if (validateQuery.data?.tags) {
                let text = "";
                validateQuery.data.tags.forEach((e) => {
                    text = text.concat(`&tags=${e}`)
                })
                url = url.concat(text)
            }
            if (validateQuery.data?.time) {
                const text = `&travelTime=${validateQuery.data.time}`
                url = url.concat(text)
            }
            console.log(url)
            return api.get<Groups>(url)
        },
        select(data) {
            return data.data.groups
        },
        enabled: validateQuery.success,
    })
    useEffect(() => {
        if (validateQuery.success) {
            refetch()
        }
    }, [query])
    if (!validateQuery.success) {
        return <Navigate to={'/error'} />
    }
    if (isError) {
        return <Navigate to={'/error'} />
    }

    return (
        <div className={mystyle.wrapper}>
            <Searchbox dLocation={location} dDate={date} />
            {
                isFetching ? <LoadingPage /> : null
            }
            {isLoading ? <LoadingPage /> :
                <div>
                    {
                        groups && groups.length > 0 ? groups.map(group => <Group group={group} />) : <NoGroup />
                    }
                </div>
            }
        </div>

    )
}

export default ViewGroup

import GroupForm from './GroupForm'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import type { GroupFormSchema } from '../types'
import { normalizeError } from '@/utils/normalizeError'
import { loaderEvent } from '@/api/mitt'
import { toast } from 'sonner'
import type { SubmitHandler } from 'react-hook-form'
import { api } from '@/api/axios'

type Group = Omit<GroupFormSchema, 'travelTime'>


const EditGroupForm = () => {
    const navigate = useNavigate()
    const { groupId } = useParams() as { groupId: string }

    const { data: group } = useSuspenseQuery({
        queryKey: ['groups', groupId],
        queryFn: () => {
            loaderEvent.emit('startLoading')
            return api.get<{ group: Group }>(`/groups/${groupId}`)
        },
        select: (res) => {
            loaderEvent.emit('stopLoading')

            const { group } = res.data
            const travelDate = res.data.group.travelDate;
            const travelDateUtc = new Date(travelDate);
            const DateInd = travelDateUtc.toString();
            const travelDateInd = new Date(DateInd);
            const year = travelDateInd.getFullYear();
            const month = (travelDateInd.getMonth() + 1).toString().padStart(2, '0');
            const day = travelDateInd.getDate().toString().padStart(2, '0');
            const myDateHtml = `${year}-${month}-${day}`;
            const hour = travelDateInd.getHours().toString().padStart(2, '0');
            const time = travelDateInd.getMinutes().toString().padStart(2, '0');
            const myTimeHtml = `${hour}:${time}`
            return { ...group, travelDate: myDateHtml, travelTime: myTimeHtml } as GroupFormSchema
        },
        refetchOnWindowFocus: false
    })


    const { mutate: editGroup, isPending } = useMutation({
        mutationFn: (body: GroupFormSchema) => api.patch(`/groups/${groupId}`, body),
        onSuccess: () => navigate('/groups/success', { state: { click: true } }),
        onError: (error) => {
            const err = normalizeError(error)
            if (err.status >= 500) return
            toast.error(error.message)
        },
        onSettled: () => loaderEvent.emit('stopLoading')
    })


    const onSubmit: SubmitHandler<GroupFormSchema> = async (data) => {
        loaderEvent.emit('startLoading')
        const indTime = `${data.travelDate}T${data.travelTime}`;
        const timeIn = new Date(indTime);
        const time = timeIn.toISOString();
        const body = { ...data, travelDate: time }

        editGroup(body)
    }

    return (
        <GroupForm isPending={isPending} onSubmit={onSubmit} group={group} />
    )
}

export default EditGroupForm

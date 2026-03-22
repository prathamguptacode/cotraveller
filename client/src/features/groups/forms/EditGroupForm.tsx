import Navbar from '@/app/layouts/Navbar/Navbar'
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
        queryFn: () => api.get<{ group: Group }>(`/groups/${groupId}`),
        select: (res) => {
            const { group } = res.data
            const time = new Intl.DateTimeFormat('en-gb', { hour: '2-digit', minute: '2-digit' }).format(new Date(group.travelDate))
            const date = new Intl.DateTimeFormat('en-ca', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(group.travelDate))
            return { ...group, travelDate: date, travelTime: time } as GroupFormSchema
        }
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
        <div>
            <Navbar>
                <Navbar.Hamburger />
                <Navbar.Title />
                <Navbar.ThemeButton />
                {/* <Navbar.ProfileButton /> */}
            </Navbar>
            {/* ### fix the colors */}
            <GroupForm isPending={isPending} onSubmit={onSubmit} group={group} />

        </div>
    )
}

export default EditGroupForm

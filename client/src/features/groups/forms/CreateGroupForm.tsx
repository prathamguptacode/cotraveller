import { useMutation } from '@tanstack/react-query';
import { type SubmitHandler } from 'react-hook-form';
import { api } from '@/api/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { loaderEvent } from '@/api/mitt';
import { normalizeError } from '@/utils/normalizeError';
import type { GroupFormSchema } from '../types';
import GroupForm from './GroupForm';




function CreateGroupForm() {
    const navigate = useNavigate()


    const { mutate: createGroup, isPending } = useMutation({
        mutationFn: (body: GroupFormSchema) => api.post('/groups', body),
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

        createGroup(body)
    };
    return (
        <GroupForm isPending={isPending} onSubmit={onSubmit} />
    );
}

export default CreateGroupForm;

import mystyle from './Group.module.css'
import { api } from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { normalizeError } from '@/utils/normalizeError';

type GroupProps = {
    group: {
        _id: string;
        title: string;
        content: string;
        ownerPop: {
            fullName: string;
        };
        travelDate: string;
        incomingRequests: string[];
    };
};

type JoinRequest = {
    _id: string,
    groupId: string,
    requesterId: string
}

function Group({ group }: GroupProps) {
    const { title, content, travelDate, _id: groupId } = group
    const members = group.ownerPop.fullName; //###FIX this , why is value of members = owner's name?
    const timeInd = new Date(travelDate).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })

    //###Font sizes are not good, need great improvements

    const { user } = useAuth()
    const { data: joinRequests, refetch: refetchJoinRequests } = useSuspenseQuery({
        queryKey: ['groups', groupId, 'requests'],
        queryFn: () => api.get<{ joinRequests: JoinRequest[] }>(`/groups/${groupId}/requests`),
        select: (res) => res.data.joinRequests
    })

    const { mutate: sendRequest, isPending: isSendingRequest } = useMutation({
        mutationFn: () => api.post(`/groups/${groupId}/requests`),
        onError: (error) => {
            const err = normalizeError(error)
            if (err.status < 500) toast.error("An error occurred !", {
                description: err.message
            })
        },
        onSuccess: () => toast.success("Request Sent"),
        onSettled: () => refetchJoinRequests()
    })

    const hasRequested = joinRequests.some(request => request.requesterId == user?._id)



    return (
        <div className={mystyle.linewrapper}>
            <div className={mystyle.groupwrapper}>
                <div className={mystyle.group}>
                    <div className={mystyle.memberbx}>

                        <div className={mystyle.members}>{members}</div>

                    </div>
                    <div className={mystyle.title}>{title}</div>
                    <div className={mystyle.content}>{content}</div>
                    <div className={mystyle.time}>Time: {timeInd}</div>
                    {/* <div className={mystyle.comments}>{commentNum ? commentNum : "0"} {commentNum == 1 ? 'comment' : 'comments'}</div> */}
                </div>
                <div className={mystyle.btnbox}>
                    <button aria-label='Send Request' onClick={() => user && sendRequest()} className={mystyle.groupbtn} disabled={isSendingRequest || hasRequested}>{hasRequested ? 'Request Sent' : 'Send Request'}</button>
                    <Link to={`/groups/${groupId}`} aria-label='More info' className={mystyle.groupbtn}>More info</Link>
                </div>
            </div>
            <div className={mystyle.line}></div>

        </div>
    )
}

export default Group

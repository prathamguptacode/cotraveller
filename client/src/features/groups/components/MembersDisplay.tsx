import { useAuth } from '@/hooks/useAuth'
import mystyle from '../groupInfo.module.css'
import type { Group } from '../types'
import { FaUser } from 'react-icons/fa6'


type MembersDisplayProps = {
    group: Group,
}

const MembersDisplay = ({ group }: MembersDisplayProps) => {
    const { user } = useAuth()
    
    return (
        <div className={mystyle.memberbx}>
            <div className={mystyle.memtitle}>Members</div>
            {
                group.member.map((e) => {
                    return (
                        <div key={e._id} className={mystyle.member}>
                            <div className={mystyle.memberAvatarWrapper}>
                                <FaUser />
                            </div>
                            <div className={mystyle.name}>{e._id == user?._id ? "You" : e.fullName}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default MembersDisplay

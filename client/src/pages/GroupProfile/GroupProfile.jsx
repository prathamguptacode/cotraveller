import { useAuth } from '../../hooks/useAuth'

const GroupProfile = () => {
    const { user } = useAuth()
    return (
        <div>
            Hello, {user.fullName}, this a group
            <p>If you do not like your username: {user.username}, you can change it in your profile settings</p>
        </div>
    )
}

export default GroupProfile

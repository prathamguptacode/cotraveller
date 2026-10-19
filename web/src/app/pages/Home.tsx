import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const { user } = useAuth()

    const [first, setfirst] = useState('')
    return (
        <div>
            Hi, {user ? `${user._id} ${user.email}` : 'Mom'}
            <Link to={`/users/${first}`}>{first}</Link>
            <input value={first} onChange={(e) => setfirst(e.target.value)} type="text" />
        </div>
    )
}

export default Home

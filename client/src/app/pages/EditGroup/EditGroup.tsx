import QuestionTile from '@/features/createGroup/components/CreateGroup/QuestionTile'
import mystyle from './EditGroup.module.css'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import TitleTile from '@/features/createGroup/components/CreateGroup/TitleTile'
import Navbar from '@/components/Navbar/Navbar'

function EditGroup() {

    const location = useLocation()
    const { groupId } = useParams()
    if (!groupId || !location.state?.allowed) return <Navigate to={'/'} replace />

    return (
        <div className={mystyle.wrap}>
            <Navbar>
                <Navbar.Title />
                <Navbar.ThemeButton />
            </Navbar>
            <TitleTile title="Edit your group information" con="A good description helps the right people join your group." />
            <QuestionTile edit={groupId} />
        </div>
    )
}

export default EditGroup

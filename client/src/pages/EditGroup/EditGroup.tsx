import mystyle from './EditGroup.module.css'
import NewNav from '@/components/CreateGroup/newNav'
import TitleTile from '@/components/CreateGroup/TitleTile'
import QuestionTile from '@/components/CreateGroup/QuestionTile'
import { Navigate, useLocation, useSearchParams } from 'react-router-dom'

function EditGroup() {

    const location = useLocation()
    const [q] = useSearchParams()
    const id = q.get("q")

    return location.state?.allowed ?
        <div className={mystyle.wrap}>
            <NewNav />
            <TitleTile title="Edit your group information" con="A good description helps the right people join your group." />
            <QuestionTile edit={id} />
        </div> :
        <Navigate to="/" replace />



}

export default EditGroup

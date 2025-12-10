import React, { useEffect } from 'react'
import mystyle from './EditGroup.module.css'
import NewNav from '../../components/CreateGroup/newNav'
import TitleTile from '../../components/CreateGroup/TitleTile'
import QuestionTile from '../../components/CreateGroup/QuestionTile'
import { api } from '../../api/axios'
import { data, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

function EditGroup() {

    const location=useLocation()
    const navigate=useNavigate()


    const [q] = useSearchParams()
    const id = q.get("q")

    useEffect(()=>{
        if(! location.state?.allowed){
            return navigate('/')
        }
    },[])

    return (
        <div children={mystyle.wrap}>
            <NewNav />
            <TitleTile title="Edit your group information" con="A good description helps the right people join your group." />
            <QuestionTile edit={id} />
        </div>
    )
}

export default EditGroup

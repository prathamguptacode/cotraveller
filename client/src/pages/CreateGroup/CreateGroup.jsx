import NewNav from '../../components/CreateGroup/newNav'
import TitleTile from '../../components/CreateGroup/TitleTile'
import QuestionTile from '../../components/CreateGroup/QuestionTile'


function CreateGroup() {

  return (
    <div className='createWrapper'>
      <NewNav />
      <TitleTile />
      <QuestionTile  />
      {/* //title component
        //question answer component */}
    </div>
  )
}

export default CreateGroup

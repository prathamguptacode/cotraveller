import NewNav from '@/components/CreateGroup/newNav'
import TitleTile from '@/components/CreateGroup/TitleTile'
import QuestionTile from '@/components/CreateGroup/QuestionTile'
import styles from './CreateGroup.module.css'

function CreateGroup() {

  return (
    <div className={styles.wrapper}>
      <NewNav />
      <TitleTile />
      <QuestionTile  />
      {/* //title component
        //question answer component */}
    </div>
  )
}

export default CreateGroup

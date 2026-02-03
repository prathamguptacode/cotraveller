
import QuestionTile from '../components/CreateGroup/QuestionTile'
import TitleTile from '../components/CreateGroup/TitleTile'
import styles from './CreateGroup.module.css'
import Navbar from '@/components/Navbar/Navbar'

function CreateGroup() {

  return (
    <div className={styles.wrapper}>
      <Navbar>
        <Navbar.Title />
        <Navbar.ThemeButton />
      </Navbar>
      <TitleTile />
      <QuestionTile />
      {/* //title component
        //question answer component */}
    </div>
  )
}

export default CreateGroup

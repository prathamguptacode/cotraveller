import Navbar from '@/components/Navbar/Navbar'
import GroupInfoFeature from '@/features/groupInfo/components/GroupInfoFeature'

const GroupInfo = () => {
  return (
    <div>
      <Navbar >
        <Navbar.Hamburger />
        <Navbar.Title />
        <Navbar.ThemeButton />
        <Navbar.Inbox />
        <Navbar.LoginButton />
        <Navbar.CreateGroupButton />
        <Navbar.ProfileButton />
      </Navbar>
      <GroupInfoFeature />
    </div>
  )
}

export default GroupInfo

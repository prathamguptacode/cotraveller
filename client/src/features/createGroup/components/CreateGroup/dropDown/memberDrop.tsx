import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import mystyle from '../dropDown/dropDown.module.css'

type MemberDropProps = {
  setMember: Dispatch<SetStateAction<string>>
}

function MemberDrop({ setMember }: MemberDropProps) {

  function click(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    const val = e.currentTarget.innerText;
    const data = val
    setMember(data)
  }
  function splClick() {
    const val = "32";
    setMember(val)
  }

  return (
    <div className={mystyle.memberDrop}>
      <div className={mystyle.options} onClick={click}>
        2
      </div>
      <div className={mystyle.options} onClick={click}>
        3
      </div>
      <div className={mystyle.options} onClick={click}>
        4
      </div>
      <div className={mystyle.options} onClick={click}>
        5
      </div>
      <div className={mystyle.options} onClick={splClick}>
        6+
      </div>
    </div>
  )
}

export default MemberDrop

import React from 'react'
import mystyle from '../dropDown/dropDown.module.css'

function MemberDrop({setMember}) {

    function click(e){
        const val=e.target.innerText;
        const data=Number(val)
        setMember(data)
    }
    function splClick(){
        const val=32;
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

import React from 'react'

const Auth = () => {
  return (
    <div>
      <button onClick={()=>{
        window.location.href="/api/oauth/google"
      }}>LETS GO</button>
    </div>
  )
}

export default Auth

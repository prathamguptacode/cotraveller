import React from 'react'

const Auth = () => {
  return (
    <div>
      <button onClick={()=>{
        window.location.href="/api/oauth/google"
      }}>LETS GO</button>
      <button onClick={()=>{
        window.location.href='/api/oauth/github'
      }}>git baby</button>
    </div>
  )
}

export default Auth

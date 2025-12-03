import React from 'react'
import GoogleButton from '../../components/OAuthButtons/GoogleButton'
import GithubButton from '../../components/OAuthButtons/GithubButton'
import ThemeButton from '../../components/Buttons/ThemeButton'

const Auth = () => {
  return (
    <div>
      <GoogleButton />
      <GithubButton />
      <ThemeButton/>
    </div>
  )
}

export default Auth

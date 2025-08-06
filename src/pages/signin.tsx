import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function signin() {
  return (
    <div>
        <SignIn redirectUrl='/admin' />
    </div>
  )
}

export default signin
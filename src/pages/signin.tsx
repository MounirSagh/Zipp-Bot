import { SignIn } from '@clerk/clerk-react'

function signin() {
  return (
    <div>
        <SignIn redirectUrl='/admin' />
    </div>
  )
}

export default signin
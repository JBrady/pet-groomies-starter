import { useSession, signIn, signOut } from 'next-auth/react'

/* const Home = () => {
  return <>Home Page</>
} */

export default function Component() {
  const { data: session } = useSession()
  if (session && session.user) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button type='button' onClick={() => signOut()}>
          Sign out
        </button>
      </>
    )
  }

  return (
    <>
      Not signed in <br />
      <button type='button' onClick={() => signIn()}>
        Sign in
      </button>
    </>
  )
}

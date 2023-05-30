// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import

// ** Component Import
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSession } from 'next-auth/react'

// ** Util Import
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'

/* interface User {
  name?: string | null,
  email?: string | null,
  image?: string | null,
  role?: string | null,
} */

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { children, guestGuard = false, authGuard = true } = props

  // ** Hooks
  const session = useSession()
  const router = useRouter()

  // ** Vars
  let ability: AppAbility

  useEffect(() => {
    if (session?.data?.user && session.data.user.role && !guestGuard && router.route === '/') {
      const homeRoute = getHomeRoute(session.data.user.role)
      router.replace(homeRoute)
    }
  }, [session?.data?.user, guestGuard, router])

  // User is logged in, build ability for the user based on his role
  if (session.data && session.data.user && !ability) {
    ability = buildAbilityFor(session.data.user.role, aclAbilities.subject)
    if (router.route === '/') {
      return <Spinner />
    }
  }

  // If guest guard or no guard is true or any error page
  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    // If user is logged in and his ability is built
    if (session?.data?.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // If user is not logged in (render pages like login, register etc..)
      return <>{children}</>
    }
  }

  // Check the access of current user and render pages
  if (ability && session?.data?.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    if (router.route === '/') {
      return <Spinner />
    }

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard

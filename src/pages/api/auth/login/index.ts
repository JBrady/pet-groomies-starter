// ** Next Imports
import { NextApiResponse, NextApiRequest } from 'next/types'

// ** Fake user data and data type
// ** Please remove below user data and data type in production and verify user with Real Database
export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
}
const users: UserDataType[] = [
  {
    id: 1,
    role: 'admin',
    password: 'admin',
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'admin@vuexy.com'
  },
  {
    id: 2,
    role: 'client',
    password: 'client',
    username: 'nathandoe',
    fullName: 'Nathan Doe',
    email: 'client@vuexy.com'
  }
]

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body

  const user = users.find(u => u.email === email && u.password === password)

  if (user) {
    return res.status(200).json(user)
  } else {
    return res.status(404).json({ message: 'Email or Password is invalid' })
  }
}

export default handler

import { Navigate } from 'react-router-dom'

import useUser from '@hooks/auth/useUser'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser()

  if (user == null) {
    return <Navigate to="/signin" replace={true} />
  }

  return <>{children}</>
}

export default PrivateRoute

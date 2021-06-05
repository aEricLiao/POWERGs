import { useAppSelector } from '@src/reducers/hooks'
import { Link } from 'react-router-dom'
import { RoutePath } from '@src/constants/routePath'

const Profile = () => {
  const isLogin = useAppSelector((state) => state.authentication.status)
  return (
    <div>{isLogin ? 'welcome' : <Link to={RoutePath.login}>Login</Link>}</div>
  )
}

export default Profile

import { useAppSelector } from '@src/reducers/hooks'
import { Link as RouterLink } from 'react-router-dom'
import { RoutePath } from '@src/constants/routePath'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'

const Profile = () => {
  const isLogin = useAppSelector((state) => state.authentication.status)
  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        {isLogin ? (
          'welcome'
        ) : (
          <Link component={RouterLink} to={RoutePath.login}>
            Login
          </Link>
        )}
      </Grid>
    </Grid>
  )
}

export default Profile

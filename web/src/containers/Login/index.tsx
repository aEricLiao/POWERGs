import { useAppSelector, useAppDispatch } from '@src/reducers/hooks'
import { login, logout } from '@src/reducers/features/authentication'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '@src/constants/routePath'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useIntl } from 'react-intl'
import messages from './messages'

const Login = () => {
  const isFetching = useAppSelector((state) => state.authentication.isFetching)
  const isLogin = useAppSelector((state) => state.authentication.status)
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { formatMessage } = useIntl()
  useEffect(() => {
    if (isLogin) {
      history.push(RoutePath.Profile)
    }
  }, [isLogin, history])

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={2}>
      <Grid item xs={2} container justify="space-between">
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(login())}>
          {formatMessage(messages.login)}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(logout())}>
          {formatMessage(messages.logout)}
        </Button>
      </Grid>
      <Grid item>{isFetching && <CircularProgress />}</Grid>
    </Grid>
  )
}

export default Login

import { useAppSelector, useAppDispatch } from '@src/reducers/hooks'
import { login } from '@src/reducers/features/authentication'
import { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { RoutePath } from '@src/constants/routePath'
import Button from '@material-ui/core/Button'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { useIntl } from 'react-intl'
import messages from './messages'
import useStyles from './style'

const Login = () => {
  const isLogin = useAppSelector((state) => state.authentication.status)
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { formatMessage } = useIntl()
  const classes = useStyles()
  useEffect(() => {
    if (isLogin) {
      history.push(RoutePath.Profile)
    }
  }, [isLogin, history])

  return (
    <form id="loginForm" className={classes.gridItem}>
      <div className={classes.inputItem}>
        <p className={classes.title}>{formatMessage(messages.email)}:</p>
        <OutlinedInput placeholder={formatMessage(messages.email)} fullWidth />
      </div>
      <div className={classes.inputItem}>
        <p className={classes.title}>{formatMessage(messages.password)}:</p>
        <OutlinedInput
          placeholder={formatMessage(messages.password)}
          fullWidth
        />
      </div>
      <Link className={classes.forgotLink} to={RoutePath.forgotPassword}>
        {formatMessage(messages.forgotPassword)}
      </Link>
      <div className={classes.buttonArea}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(login())}>
          {formatMessage(messages.loginButton)}
        </Button>
      </div>
    </form>
  )
}

export default Login

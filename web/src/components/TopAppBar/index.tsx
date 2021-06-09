import useStyles from './style'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import PowerIcon from '@material-ui/icons/Power'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import messages from './messages'
import { RoutePath } from '@src/constants/routePath'
import { useAppSelector } from '@src/reducers/hooks'

interface TopAppBarProps {
  className: string
}

const TopAppBar = ({ className }: TopAppBarProps) => {
  const classes = useStyles()
  const history = useHistory()
  const { formatMessage } = useIntl()
  const isLogin = useAppSelector((state) => state.authentication.status)
  const onLogin = () => history.push(RoutePath.Login)
  return (
    <AppBar position="fixed" className={className}>
      <Toolbar>
        <PowerIcon />
        <Typography variant="h6" className={classes.title}>
          POWERGs
        </Typography>
        {isLogin ? (
          <AccountCircle />
        ) : (
          <Button color="inherit" onClick={onLogin}>
            {formatMessage(messages.login)}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default TopAppBar

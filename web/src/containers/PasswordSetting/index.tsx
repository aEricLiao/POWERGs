import { useAppDispatch } from '@src/reducers/hooks'
import { setPassword } from '@src/reducers/features/authentication'
import Button from '@material-ui/core/Button'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { useIntl } from 'react-intl'
import messages from './messages'
import useStyles from './style'

const PasswordSetting = () => {
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()
  const classes = useStyles()

  return (
    <form className={classes.gridItem}>
      <div className={classes.inputItem}>
        <p className={classes.title}>{formatMessage(messages.email)}:</p>
        <OutlinedInput placeholder={formatMessage(messages.email)} fullWidth />
      </div>
      <div className={classes.inputItem}>
        <p className={classes.title}>{formatMessage(messages.code)}:</p>
        <OutlinedInput placeholder={formatMessage(messages.code)} fullWidth />
      </div>
      <div className={classes.inputItem}>
        <p className={classes.title}>{formatMessage(messages.newPassword)}:</p>
        <OutlinedInput
          placeholder={formatMessage(messages.newPassword)}
          fullWidth
        />
      </div>
      <div className={classes.inputItem}>
        <p className={classes.title}>
          {formatMessage(messages.confirmPassword)}:
        </p>
        <OutlinedInput
          placeholder={formatMessage(messages.confirmPassword)}
          fullWidth
        />
      </div>
      <div className={classes.buttonArea}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(setPassword())}>
          {formatMessage(messages.button)}
        </Button>
      </div>
    </form>
  )
}

export default PasswordSetting

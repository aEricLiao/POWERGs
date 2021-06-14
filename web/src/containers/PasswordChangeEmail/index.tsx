import { useAppDispatch } from '@src/reducers/hooks'
import { sendEmail } from '@src/reducers/features/authentication'
import Button from '@material-ui/core/Button'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { useIntl } from 'react-intl'
import messages from './messages'
import useStyles from './style'

const PasswordChangeEmail = () => {
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()
  const classes = useStyles()

  return (
    <form id="setPasswordForm" className={classes.gridItem}>
      <div className={classes.label}>
        <h2>{formatMessage(messages.passwordForgotCase)}</h2>
        <p>{formatMessage(messages.pleaseEnterEmail)}</p>
        <p>{formatMessage(messages.sendPasswordChangeLink)}</p>
      </div>
      <div className={classes.inputItem}>
        <p>{formatMessage(messages.passwordChangeEmail)}:</p>
        <OutlinedInput
          placeholder={formatMessage(messages.passwordChangeEmail)}
          fullWidth
        />
      </div>
      <div className={classes.buttonArea}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(sendEmail())}>
          {formatMessage(messages.sendEmailButton)}
        </Button>
      </div>
    </form>
  )
}

export default PasswordChangeEmail

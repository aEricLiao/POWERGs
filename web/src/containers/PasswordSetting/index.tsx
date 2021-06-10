import { useAppDispatch } from '@src/reducers/hooks'
// import { useEffect } from 'react'
// import { useHistory } from 'react-router-dom'
// import { RoutePath } from '@src/constants/routePath'
import { setPassword } from '@src/reducers/features/authentication'
import Button from '@material-ui/core/Button'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { useIntl } from 'react-intl'
import messages from './messages'
import styled from 'styled-components'

const PasswordSetting = () => {
  const dispatch = useAppDispatch()
  // const history = useHistory()
  const { formatMessage } = useIntl()

  return (
    <form id="setPasswordForm">
      <GridItem>
        <InputItem>
          <Title>
            <p>{formatMessage(messages.email)}:</p>
          </Title>
          <OutlinedInput
            placeholder={formatMessage(messages.email)}
            fullWidth
          />
        </InputItem>
        <InputItem>
          <Title>
            <p>{formatMessage(messages.code)}:</p>
          </Title>
          <OutlinedInput placeholder={formatMessage(messages.code)} fullWidth />
        </InputItem>
        <InputItem>
          <Title>
            <p>{formatMessage(messages.newPassword)}:</p>
          </Title>
          <OutlinedInput
            placeholder={formatMessage(messages.newPassword)}
            fullWidth
          />
        </InputItem>
        <InputItem>
          <Title>
            <p>{formatMessage(messages.confirmPassword)}:</p>
          </Title>
          <OutlinedInput
            placeholder={formatMessage(messages.confirmPassword)}
            fullWidth
          />
        </InputItem>
        <ButtonArea>
          <Button
            type="submit"
            form="setPasswordForm"
            variant="contained"
            color="primary"
            onClick={() => dispatch(setPassword())}>
            {formatMessage(messages.button)}
          </Button>
        </ButtonArea>
      </GridItem>
    </form>
  )
}
const Title = styled.div`
  margin-right: 1rem;
  width: 60%;
`
const InputItem = styled.div`
  display: flex;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  width: 40%;
`
const GridItem = styled.div`
  display: grid;
  justify-items: center;
  margin-top: 1rem;
`
const ButtonArea = styled.div`
  display: grid;
  margin-top: 1rem;
  justify-items: center;
`

export default PasswordSetting

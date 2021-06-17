import { useState, useMemo } from 'react'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { useForm, Controller } from 'react-hook-form'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { useIntl } from 'react-intl'
import messages from './messages'
import { Fields } from './types'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import useStyles from './styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { signup } from '@src/reducers/features/authentication'
import { useAppDispatch } from '@src/reducers/hooks'

interface FieldItem {
  name: string
  required?: boolean
}

const generateFields = () => [
  {
    name: Fields.Name,
    required: true,
  },
  {
    name: Fields.Email,
    required: true,
  },
  {
    name: Fields.Postal,
    required: true,
  },
  {
    name: Fields.Address,
    required: true,
  },
  {
    name: Fields.Tel1,
    required: true,
  },
  {
    name: Fields.Tel2,
  },
  {
    name: Fields.CustomerId,
    required: true,
  },
  {
    name: Fields.MainCustomerSupportUsername1,
  },
  {
    name: Fields.MainCustomerSupportUsername2,
  },
  {
    name: Fields.ServiceStartDate,
  },
  {
    name: Fields.Payment,
  },
  {
    name: Fields.CorrespondNote,
  },
  {
    name: Fields.Memo,
  },
  {
    name: Fields.CompanyType,
    required: true,
  },
  {
    name: Fields.GroupId1,
    required: true,
  },
  {
    name: Fields.GroupId2,
  },
  {
    name: Fields.GroupId3,
  },
  {
    name: Fields.GroupId4,
  },
  {
    name: Fields.GroupId5,
  },
]

const Signup = () => {
  const { control, handleSubmit } = useForm()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const { formatMessage } = useIntl()
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const fields = useMemo<FieldItem[]>(generateFields, [generateFields])
  const onSubmit = async (data: Record<string, any>) => {
    console.log(data)
    setOpenDialog(true)
    await dispatch(signup(data))
  }
  const onDialogClose = () => setOpenDialog(false)
  return (
    <Container
      maxWidth="md"
      classes={{
        root: classes.root,
      }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={0}>
          <Grid
            container
            alignItems="center"
            direction="column"
            justify="flex-start"
            spacing={1}>
            <Typography variant="h3">
              {formatMessage(messages.title)}
            </Typography>
            {fields.map(({ name, required }: FieldItem, index) => (
              <Grid
                key={`${name}_${index}`}
                item
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}>
                <Grid item xs={2}>
                  {formatMessage(messages[name])}
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    rules={{ required }}
                    render={({ field, fieldState }) => {
                      const error = fieldState.invalid
                      return (
                        <>
                          <OutlinedInput
                            {...field}
                            error={error}
                            fullWidth
                            placeholder={formatMessage(messages[name])}
                          />
                          {error && (
                            <FormHelperText error={error}>
                              {formatMessage(messages.required)}
                            </FormHelperText>
                          )}
                        </>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            ))}
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                {formatMessage(messages.submit)}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
      <Dialog
        open={openDialog}
        onClose={onDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {formatMessage(messages.successTitle)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {formatMessage(messages.successContent)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose} color="primary" autoFocus>
            {formatMessage(messages.close)}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Signup

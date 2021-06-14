import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  title: {
    marginRight: '1rem',
    width: '35%',
  },
  inputItem: {
    display: 'flex',
    marginTop: '0.2rem',
    marginBottom: '0.2rem',
    width: '30%',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyItems: 'center',
    marginTop: '1rem',
  },
  buttonArea: {
    display: 'flex',
    marginTop: '1rem',
    justifyItems: 'center',
  },
  forgotLink: {
    alignItems: 'center',
    marginTop: '1rem',
  },
})

export default useStyles

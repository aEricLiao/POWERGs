import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  title: {
    marginRight: '1rem',
    width: '60%',
  },
  inputItem: {
    display: 'flex',
    marginTop: '0.2rem',
    marginBottom: '0.2rem',
    width: '40%',
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
})

export default useStyles

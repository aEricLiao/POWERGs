import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  label: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0.2rem',
    marginBottom: '0.2rem',
    width: '30%',
    '& p': {
      width: '100%',
    },
    '& h2': {
      textAlign: 'center',
    },
  },
  inputItem: {
    display: 'flex',
    marginTop: '0.2rem',
    marginBottom: '0.2rem',
    width: '30%',
    '& p': {
      marginRight: '1rem',
      width: '35%',
    },
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

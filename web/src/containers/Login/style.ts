import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  title: {
    'margin-right': '1rem',
    width: '35%',
  },
  inputItem: {
    display: 'flex',
    'margin-top': '0.2rem',
    'margin-bottom': '0.2rem',
    width: '30%',
  },
  gridItem: {
    display: 'grid',
    'justify-items': 'center',
    'margin-top': '1rem',
  },
  buttonArea: {
    display: 'grid',
    'margin-top': '1rem',
    'justify-items': 'center',
  },
  forgotLink: {
    alignItems: 'center',
    'margin-top': '1rem',
  },
})

export default useStyles

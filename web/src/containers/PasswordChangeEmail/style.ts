import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  label: {
    display: 'flex',
    'flex-direction': 'column',
    'margin-top': '0.2rem',
    'margin-bottom': '0.2rem',
    width: '30%',
    '& p': {
      width: '100%',
    },
    '& h2': {
      'text-align': 'center',
    },
  },
  inputItem: {
    display: 'flex',
    'margin-top': '0.2rem',
    'margin-bottom': '0.2rem',
    width: '30%',
    '& p': {
      'margin-right': '1rem',
      width: '35%',
    },
  },
  gridItem: {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'justify-items': 'center',
    'margin-top': '1rem',
  },
  buttonArea: {
    display: 'flex',
    'margin-top': '1rem',
    'justify-items': 'center',
  },
})

export default useStyles

import Profile from '@src//containers/Profile'
import { Switch, Route } from 'react-router-dom'
import { RoutePath } from '@src/constants/routePath'
import Box from '@material-ui/core/Box'
import TopAppBar from '@src/components/TopAppBar'
import LeftDrawer from '@src/components/LeftDrawer'
import useStyles from './style'

const Main = () => {
  const classes = useStyles()
  return (
    <Box>
      <TopAppBar className={classes.appBar} />
      <LeftDrawer />
      <Switch>
        <Route path={RoutePath.Profile}>
          <Profile />
        </Route>
      </Switch>
      <Box component="footer">I am footer</Box>
    </Box>
  )
}

export default Main

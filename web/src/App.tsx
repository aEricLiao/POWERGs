import React from 'react'
import { Provider } from 'react-redux'
import store from './reducers'
import Login from './containers/Login'
import PasswordSetting from './containers/PasswordSetting'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { RoutePath } from './constants/routePath'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { theme } from './styles/theme'
import { IntlProvider } from 'react-intl'
import ja from './i18n/ja.json'
import Main from './containers/Main'
import Box from '@material-ui/core/Box'

function App() {
  return (
    <Provider store={store}>
      <IntlProvider locale="ja" messages={ja}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box maxWidth="xl" minHeight="100vh">
            <Router>
              <Switch>
                <Route path={RoutePath.Login}>
                  <Login />
                </Route>
                <Route path={RoutePath.SetPassword}>
                  <PasswordSetting />
                </Route>
                <Route path={RoutePath.Root}>
                  <Main />
                </Route>
                <Redirect to={RoutePath.Root} />
              </Switch>
            </Router>
          </Box>
        </ThemeProvider>
      </IntlProvider>
    </Provider>
  )
}

export default App

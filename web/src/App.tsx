import React from 'react'
import { Provider } from 'react-redux'
import logo from './logo.svg'
import './App.css'
import store from './reducers'
import Profile from './containers/Profile'
import Login from './containers/Login'
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

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer">
                Learn React
              </a>
            </header>
          </div>
          <Switch>
            <Route path={RoutePath.profile}>
              <Profile />
            </Route>
            <Route path={RoutePath.login}>
              <Login />
            </Route>
            <Redirect to={RoutePath.profile} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App

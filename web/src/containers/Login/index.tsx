import { useAppSelector, useAppDispatch } from '@src/reducers/hooks'
import { login, logout } from '@src/reducers/features/authentication'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '@src/constants/routePath'

const Login = () => {
  const isFetching = useAppSelector((state) => state.authentication.isFetching)
  const isLogin = useAppSelector((state) => state.authentication.status)
  const dispatch = useAppDispatch()
  const history = useHistory()
  useEffect(() => {
    if (isLogin) {
      history.push(RoutePath.profile)
    }
  }, [isLogin, history])

  return (
    <div>
      <button type="button" onClick={() => dispatch(login())}>
        login
      </button>
      <button type="button" onClick={() => dispatch(logout())}>
        logout
      </button>
      {isFetching && <p>loading</p>}
    </div>
  )
}

export default Login

import { useAppSelector, useAppDispatch } from '@src/reducers/hooks'
import { login, logout } from '@src/reducers/features/authentication'

const Profile = () => {
  const isLogin = useAppSelector((state) => state.authentication.status)
  const isFetching = useAppSelector((state) => state.authentication.isFetching)
  const dispatch = useAppDispatch()
  return (
    <div>
      <button type="button" onClick={() => dispatch(login())}>
        login
      </button>
      <button type="button" onClick={() => dispatch(logout())}>
        logout
      </button>
      {isLogin ? 'welcome' : 'please login'}
      {isFetching && <p>loading</p>}
    </div>
  )
}

export default Profile

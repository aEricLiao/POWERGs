import { configureStore } from '@reduxjs/toolkit'
import authentication from './features/authentication'
import logger from 'redux-logger'

const store = configureStore({
  reducer: {
    authentication,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      process.env.NODE_ENV === 'development' ? [logger] : []
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store

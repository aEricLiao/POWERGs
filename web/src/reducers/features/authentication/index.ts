import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Service from '@src/services/authenticationService'

export const login = createAsyncThunk(
  'authentication/login',
  async (userId, thunkAPI) => {
    const service = Service()
    try {
      await service.login()
    } catch (error) {
      console.error(error)
    }
  }
)

export const logout = createAsyncThunk(
  'authentication/logout',
  async (userId, thunkAPI) => {
    const service = Service()
    try {
      await service.logout()
    } catch (error) {
      console.error(error)
    }
  }
)

export const setPassword = createAsyncThunk(
  'authentication/setPassword',
  async (userId, thunkAPI) => {
    const service = Service()
    try {
      await service.setPassword()
    } catch (error) {
      console.error(error)
    }
  }
)

export const sendEmail = createAsyncThunk(
  'authentication/passwordChangeEmail',
  async (userId, thunkAPI) => {
    const service = Service()
    try {
      await service.sendEmail()
    } catch (error) {
      console.error(error)
    }
  }
)

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    status: false,
    isFetching: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.isFetching = true
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = true
      state.isFetching = false
    })
    builder.addCase(logout.pending, (state, action) => {
      state.isFetching = true
    })
    builder.addCase(logout.fulfilled, (state, action) => {
      state.status = false
      state.isFetching = false
    })
  },
})

export default authenticationSlice.reducer

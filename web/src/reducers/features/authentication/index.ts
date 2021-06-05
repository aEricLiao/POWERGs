import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const login = createAsyncThunk(
  'authentication/login',
  (userId, thunkAPI) => {
    return new Promise<any>((resolve) => {
      setTimeout(async () => {
        resolve({})
      }, 1000)
    })
  }
)

export const logout = createAsyncThunk(
  'authentication/logout',
  async (userId, thunkAPI) => {
    return new Promise<any>((resolve) => {
      setTimeout(async () => {
        resolve({})
      }, 1000)
    })
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

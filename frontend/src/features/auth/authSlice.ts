import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '@api/client'
import { User, LoginCredentials, SignupCredentials } from '@/types'

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const formData = new URLSearchParams()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    
    const response = await client.post('/api/auth/login', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    return access_token
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials) => {
    const response = await client.post('/api/auth/signup', credentials)
    return response.data
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async () => {
    const response = await client.get<User>('/api/users/me')
    return response.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'ログインに失敗しました'
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'アカウント作成に失敗しました'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
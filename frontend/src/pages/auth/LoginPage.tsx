import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store'
import { login } from '@features/auth/authSlice'

export const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { status, error } = useSelector((state: RootState) => state.auth)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(login({ email, password })).unwrap()
      navigate('/articles')
    } catch (err) {
      // エラーは Redux state で処理されます
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === 'loading'}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'ログイン中...' : 'ログイン'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/signup')}
            disabled={status === 'loading'}
          >
            アカウントをお持ちでない方はこちら
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
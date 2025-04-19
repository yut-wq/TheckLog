import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store'
import { signup } from '@features/auth/authSlice'

export const SignupPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { status, error } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(signup({ username, email, password })).unwrap()
      navigate('/login')
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
          アカウント作成
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
            id="username"
            label="ユーザー名"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={status === 'loading'}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
            {status === 'loading' ? '作成中...' : 'アカウント作成'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            disabled={status === 'loading'}
          >
            すでにアカウントをお持ちの方はこちら
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { LoginPage } from '@pages/auth/LoginPage'
import { SignupPage } from '@pages/auth/SignupPage'
import { ArticleListPage } from '@pages/articles/ArticleListPage'
import { ArticleDetailPage } from '@pages/articles/ArticleDetailPage'
import { ArticleEditPage } from '@pages/articles/ArticleEditPage'
import { AuthGuard } from '@components/AuthGuard'
import './App.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Navigate to="/articles" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/articles" element={<ArticleListPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route
              path="/articles/new"
              element={
                <AuthGuard>
                  <ArticleEditPage />
                </AuthGuard>
              }
            />
            <Route
              path="/articles/:id/edit"
              element={
                <AuthGuard>
                  <ArticleEditPage />
                </AuthGuard>
              }
            />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App

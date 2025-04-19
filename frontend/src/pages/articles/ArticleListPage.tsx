import { Box, Button, Card, CardContent, Container, Typography, CircularProgress } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SxProps } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store'
import { fetchArticles } from '@features/articles/articlesSlice'
import { Article } from '@/types'

export const ArticleListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { articles, status, error } = useSelector((state: RootState) => state.articles)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles())
    }
  }, [status, dispatch])

  if (status === 'loading') {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    )
  }

  const cardStyle: SxProps<Theme> = {
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      boxShadow: 6,
    }
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            記事一覧
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/articles/new')}
          >
            新規作成
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {articles.map((article: Article) => (
            <Card 
              key={article.id}
              sx={cardStyle}
              onClick={() => navigate(`/articles/${article.id}`)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(article.created_at).toLocaleDateString()}
                </Typography>
                {article.tags.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {article.tags.map((tag: string) => (
                      <Typography
                        key={tag}
                        component="span"
                        variant="body2"
                        sx={{
                          mr: 1,
                          px: 1,
                          py: 0.5,
                          bgcolor: 'primary.50',
                          borderRadius: 1,
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  )
}
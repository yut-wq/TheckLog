import { Box, Button, Container, TextField, Typography, Alert, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store'
import { createArticle, updateArticle, fetchArticleById } from '@features/articles/articlesSlice'

export const ArticleEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { currentArticle, status, error } = useSelector((state: RootState) => state.articles)
  const isEditing = !!id

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchArticleById(id))
    }
  }, [isEditing, id, dispatch])

  useEffect(() => {
    if (isEditing && currentArticle) {
      setTitle(currentArticle.title)
      setContent(currentArticle.content)
      setTags(currentArticle.tags.join(', '))
    }
  }, [isEditing, currentArticle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const tagList = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    try {
      if (isEditing && id) {
        await dispatch(updateArticle({ id, title, content, tags: tagList })).unwrap()
      } else {
        await dispatch(createArticle({ title, content, tags: tagList })).unwrap()
      }
      navigate('/articles')
    } catch (err) {
      setSubmitError('記事の保存に失敗しました。もう一度お試しください。')
    }
  }

  if (isEditing && status === 'loading') {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          {isEditing ? '記事の編集' : '新規記事の作成'}
        </Typography>
        {(error || submitError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || submitError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            disabled={status === 'loading'}
          />
          <TextField
            fullWidth
            label="タグ (カンマ区切り)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            margin="normal"
            helperText="例: React, TypeScript, FastAPI"
            disabled={status === 'loading'}
          />
          <TextField
            fullWidth
            label="本文"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            required
            multiline
            rows={10}
            disabled={status === 'loading'}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' 
                ? (isEditing ? '更新中...' : '作成中...')
                : (isEditing ? '更新' : '作成')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={status === 'loading'}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
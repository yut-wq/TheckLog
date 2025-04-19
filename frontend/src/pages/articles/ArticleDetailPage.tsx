import { Box, Button, Container, Chip, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store'
import { fetchArticleById, deleteArticle } from '@features/articles/articlesSlice'

export const ArticleDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { currentArticle: article, status, error } = useSelector((state: RootState) => state.articles)
  const { user } = useSelector((state: RootState) => state.auth)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id))
    }
  }, [id, dispatch])

  const handleDelete = async () => {
    try {
      await dispatch(deleteArticle(id!)).unwrap()
      navigate('/articles')
    } catch (err) {
      // エラーはRedux stateで処理されます
    }
    setDeleteDialogOpen(false)
  }

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

  if (!article) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography>記事が見つかりませんでした。</Typography>
        </Box>
      </Container>
    )
  }

  const isAuthor = user?.id === article.user_id

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {article.title}
          </Typography>
          {isAuthor && (
            <Box>
              <Button
                variant="outlined"
                onClick={() => navigate(`/articles/${id}/edit`)}
                sx={{ mr: 1 }}
              >
                編集
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
              >
                削除
              </Button>
            </Box>
          )}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            作成日: {new Date(article.created_at).toLocaleDateString()}
            {article.updated_at !== article.created_at && 
              ` (更新日: ${new Date(article.updated_at).toLocaleDateString()})`
            }
          </Typography>
          {article.tags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {article.tags.map((tag) => (
                <Chip key={tag} label={tag} sx={{ mr: 1 }} />
              ))}
            </Box>
          )}
        </Box>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {article.content}
        </Typography>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>記事の削除</DialogTitle>
        <DialogContent>
          <Typography>
            この記事を削除してもよろしいですか？この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
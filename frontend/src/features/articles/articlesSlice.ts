import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '@api/client'
import { Article, CreateArticleData, UpdateArticleData } from '@/types'

interface ArticlesState {
  articles: Article[];
  currentArticle: Article | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ArticlesState = {
  articles: [],
  currentArticle: null,
  status: 'idle',
  error: null,
}

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async () => {
    const response = await client.get<Article[]>('/api/articles')
    return response.data
  }
)

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: string) => {
    const response = await client.get<Article>(`/api/articles/${id}`)
    return response.data
  }
)

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (data: CreateArticleData) => {
    const response = await client.post<Article>('/api/articles', data)
    return response.data
  }
)

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async (data: UpdateArticleData) => {
    const { id, ...articleData } = data
    const response = await client.put<Article>(`/api/articles/${id}`, articleData)
    return response.data
  }
)

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id: string) => {
    await client.delete(`/api/articles/${id}`)
    return id
  }
)

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.currentArticle = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch articles
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.articles = action.payload
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || '記事の取得に失敗しました'
      })
      // Fetch single article
      .addCase(fetchArticleById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentArticle = action.payload
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || '記事の取得に失敗しました'
      })
      // Create article
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles.push(action.payload)
      })
      // Update article
      .addCase(updateArticle.fulfilled, (state, action) => {
        const index = state.articles.findIndex(article => article.id === action.payload.id)
        if (index !== -1) {
          state.articles[index] = action.payload
        }
        state.currentArticle = action.payload
      })
      // Delete article
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter(article => article.id !== action.payload)
        if (state.currentArticle?.id === action.payload) {
          state.currentArticle = null
        }
      })
  },
})

export const { clearCurrentArticle } = articlesSlice.actions
export default articlesSlice.reducer
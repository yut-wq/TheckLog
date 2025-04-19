from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..crud import crud_article
from ..schemas import schemas
from typing import List
from ..core.security import get_current_user
from ..models.models import User

router = APIRouter()

@router.get("", response_model=List[schemas.Article])
def get_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    articles = crud_article.get_articles(db, skip=skip, limit=limit)
    return articles

@router.get("/{article_id}", response_model=schemas.Article)
def get_article(article_id: str, db: Session = Depends(get_db)):
    db_article = crud_article.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="記事が見つかりません")
    return db_article

@router.post("", response_model=schemas.Article)
async def create_article(
    article: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_article.create_article(db=db, article=article, user_id=str(current_user.id))

@router.put("/{article_id}", response_model=schemas.Article)
async def update_article(
    article_id: str,
    article: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = crud_article.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="記事が見つかりません")
    if db_article.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="この操作は許可されていません")
    
    return crud_article.update_article(db, article_id=article_id, article=article)

@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = crud_article.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="記事が見つかりません")
    if db_article.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="この操作は許可されていません")
    crud_article.delete_article(db, article_id=article_id)
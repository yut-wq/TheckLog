from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..crud import crud_article
from ..schemas import schemas
from typing import List
from ..core.security import oauth2_scheme

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
def create_article(
    article: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    return crud_article.create_article(db=db, article=article, user_id=token)

@router.put("/{article_id}", response_model=schemas.Article)
def update_article(
    article_id: str,
    article: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    db_article = crud_article.update_article(db, article_id=article_id, article=article)
    if db_article is None:
        raise HTTPException(status_code=404, detail="記事が見つかりません")
    if db_article.user_id != token:
        raise HTTPException(status_code=403, detail="この操作は許可されていません")
    return db_article

@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(
    article_id: str,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    db_article = crud_article.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="記事が見つかりません")
    if db_article.user_id != token:
        raise HTTPException(status_code=403, detail="この操作は許可されていません")
    crud_article.delete_article(db, article_id=article_id)
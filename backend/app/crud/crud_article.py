from sqlalchemy.orm import Session
from .. import models, schemas
from typing import List

def get_article(db: Session, article_id: str):
    return db.query(models.Article).filter(models.Article.id == article_id).first()

def get_articles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Article).offset(skip).limit(limit).all()

def create_article(db: Session, article: schemas.ArticleCreate, user_id: str):
    # タグの取得または作成
    tags = []
    for tag_name in article.tags:
        tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
        if not tag:
            tag = models.Tag(name=tag_name)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        tags.append(tag)

    db_article = models.Article(
        title=article.title,
        content=article.content,
        user_id=user_id,
        tags=tags
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def update_article(db: Session, article_id: str, article: schemas.ArticleCreate):
    db_article = get_article(db, article_id)
    if not db_article:
        return None

    # タグの更新
    tags = []
    for tag_name in article.tags:
        tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
        if not tag:
            tag = models.Tag(name=tag_name)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        tags.append(tag)

    db_article.title = article.title
    db_article.content = article.content
    db_article.tags = tags

    db.commit()
    db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: str):
    db_article = get_article(db, article_id)
    if db_article:
        db.delete(db_article)
        db.commit()
    return db_article
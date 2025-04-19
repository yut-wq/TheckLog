from sqlalchemy.orm import Session
from .. import models, schemas
from typing import List

def get_article(db: Session, article_id: str):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if article:
        article.tags = [tag.name for tag in article.tags]  # タグを文字列のリストに変換
    return article

def get_articles(db: Session, skip: int = 0, limit: int = 100):
    articles = db.query(models.Article).offset(skip).limit(limit).all()
    for article in articles:
        article.tags = [tag.name for tag in article.tags]  # タグを文字列のリストに変換
    return articles

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
    
    # レスポンス用のデータを作成
    response_dict = {
        "id": db_article.id,
        "title": db_article.title,
        "content": db_article.content,
        "user_id": db_article.user_id,
        "created_at": db_article.created_at,
        "updated_at": db_article.updated_at,
        "tags": [tag.name for tag in db_article.tags]
    }
    return schemas.Article(**response_dict)

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

    # 元のタグオブジェクトを保存
    db_article.tags = tags
    db_article.title = article.title
    db_article.content = article.content

    db.commit()
    db.refresh(db_article)
    
    # レスポンス用にタグを文字列のリストに変換
    db_article.tags = [tag.name for tag in tags]
    return db_article

def delete_article(db: Session, article_id: str):
    db_article = get_article(db, article_id)
    if db_article:
        db.delete(db_article)
        db.commit()
    return db_article
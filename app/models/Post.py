from app.instances.db import db
import app.models.User
import app.models.Answer
from sqlalchemy.dialects.mysql import LONGTEXT
import datetime


class Post(db.Model):
    """
    Represnts a post (e.g. challenge)
    """
    
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    title = db.Column(db.String(50), nullable=False)
    body = db.Column(LONGTEXT, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey(app.models.User.User.id), nullable=False)
    user = db.relationship(app.models.User.User, backref=db.backref('posts'))
    answers = db.relationship(app.models.Answer.Answer, backref=db.backref('posts'))
    
    def to_json(self):
        data = {}
        data['title'] = self.title
        data['body'] = self.body
        data['owner'] = self.user.to_json()
        
        return data
    
    def __repr__(self):
        return '<Post(%r) by %r>' % (self.id, self.user.name)

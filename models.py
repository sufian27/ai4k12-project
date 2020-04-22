from app import db
from datetime import datetime
import pytz

#table that stores id and info of users
class User(db.Model):
    id = db.Column(db.String, primary_key=True)
    actions = db.relationship('User_Action', backref='user', lazy='dynamic')

    def __init__(self, id):
        self.id = id

#table that contains all the actions that users do - add clicked elements later
class User_Action(db.Model):
    row_id = db.Column(db.Integer, primary_key=True)
    time_stamp = db.Column(db.DateTime, nullable=False, default=datetime.now(pytz.timezone("America/New_York")))
    description = db.Column(db.String)
    user_id = db.Column(db.String, db.ForeignKey('user.id')) #relationship

    def __init__(self, description, user_id):
        self.description = description
        self.user_id = user_id
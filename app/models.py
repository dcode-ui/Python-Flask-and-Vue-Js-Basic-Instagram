from . import db

class Users(db.Model):
    user_id = db.Column(db.Integer, unique=True, primary_key = True)
    username = db.Column(db.String(20), nullable = False)
    firstname = db.Column(db.String(40), nullable = False)
    lastname = db.Column(db.String(40), nullable = False)
    email = db.Column(db.String(100), unique=True, nullable = False)
    location = db.Column(db.String(50))
    biography = db.Column(db.Text)
    profile_photo = db.Column(db.String(100))
    password = db.Column(db.String(150))
    joined_on = db.Column(db.DateTime, nullable = False)

    def __init__(self,username,firstname,lastname,email,location,biography,profile_photo, password, joined_on):
        self.username = username
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.location = location
        self.biography = biography
        self.profile_photo = profile_photo
        self.password = password
        self.joined_on = joined_on

    def __repre__(self):
        return '<Name %r>' % self.firstname

class Posts(db.Model):
    post_id = db.Column(db.Integer, unique=True, primary_key = True)
    user_id = db.Column(db.Integer)
    photo = db.Column(db.String(100))
    caption = db.Column(db.Text)
    created_on = db.Column(db.DateTime, nullable = False)

    def __init__(self,user_id,photo,caption,created_on):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on
    
    def __repre__(self):
        return '<Caption %r>' % self.caption
    

    

class Likes(db.Model):
    like_id = db.Column(db.Integer, unique=True, primary_key = True)
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer)

    def __init__(self,user_id,post_id):
        self.user_id = user_id
        self.post_id = post_id
    
    def __repre__(self):
        return '<Caption %r>' % self.post_id

class Follows(db.Model):
    follow_id = db.Column(db.Integer, unique=True, primary_key = True)
    user_id = db.Column(db.Integer)
    follower_id = db.Column(db.Integer)

    def __init__(self,user_id,follower_id):
        self.user_id = user_id
        self.post_id = follower_id
    
    def __repre__(self):
        return '<Caption %r>' % self.follower_id
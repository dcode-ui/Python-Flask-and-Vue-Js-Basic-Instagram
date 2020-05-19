from flask import Flask
from flask_sqlalchemy import SQLAlchemy
#initializing flask app
app = Flask(__name__)

#app configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://photogramadmin:photogrampass@localhost/photogram'
db = SQLAlchemy(app)

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

class Posts(db.Model):
    post_id = db.Column(db.Integer, unique=True, primary_key = True)
    user_id = db.Column(db.Integer)
    photo = db.Column(db.String(100))
    caption = db.Column(db.Text)
    created_on = db.Column(db.DateTime, nullable = False)

class Likes(db.Model):
    like_id = db.Column(db.Integer, unique=True, primary_key = True)
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer)

class Follows(db.Model):
    follow_id = db.Column(db.Integer, unique=True, primary_key = True)
    user_id = db.Column(db.Integer)
    follower_id = db.Column(db.Integer)

"""
@app.route('/test/jwt',methods=['GET'])
def getjwt():
    name = request.args['name']
    token = jwt.encode({"name":name},app.config['SECRET_KEY'])
    return jsonify({"token":token.decode('utf-8')})
"""
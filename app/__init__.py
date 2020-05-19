from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect

#initializing flask app
app = Flask(__name__)
csrf = CSRFProtect(app)

#app configurations
app.config['PR_UPLOAD_FOLDER'] = './app/static/uploads/profile'
app.config['PST_UPLOAD_FOLDER'] = './app/static/uploads/post'
app.config['UPLOAD_FOLDER'] = './app/static/uploads'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://photogramadmin:photogrampass@localhost/photogram'
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
db = SQLAlchemy(app)

app.config.from_object(__name__)
from app import views
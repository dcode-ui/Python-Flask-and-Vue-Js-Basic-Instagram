from flask_wtf import FlaskForm
from wtforms.fields import StringField
from wtforms.widgets import TextArea
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms.validators import InputRequired

class registerForm(FlaskForm):
    username = StringField('username', validators=[InputRequired()])
    firstname = StringField('firstname', validators=[InputRequired()])
    lastname = StringField('lastname', validators=[InputRequired()])
    email = StringField('email', validators=[InputRequired()])
    location = StringField('location', validators=[InputRequired()])
    biography = StringField('biography', widget=TextArea(),validators=[InputRequired()])
    pphoto = FileField('pphoto', validators=[FileRequired(), FileAllowed(['jpg', 'png'], 'Images only!')])
    password = StringField('password', validators=[InputRequired()])
    #password_two = StringField('password_two', validators=[InputRequired()])

class postForm(FlaskForm):
    caption = StringField('caption', widget=TextArea(),validators=[InputRequired()])
    postphoto = FileField('postphoto', validators=[FileRequired(), FileAllowed(['jpg', 'png'], 'Images only!')])

class UploadForm(FlaskForm):
    description = StringField('description', validators=[InputRequired()])
    photo = FileField('photo', validators=[FileRequired(), FileAllowed(['jpg', 'png'], 'Images only!')])
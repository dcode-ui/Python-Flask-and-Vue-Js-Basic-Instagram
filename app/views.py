from app import app, db
from flask import jsonify, render_template, request, make_response
#importing wtforms
from .forms import postForm
from .forms import registerForm
#importing os module
import os
import datetime
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
#Authentication
from .models import Users
from .models import Posts
from .models import Likes
import jwt

#pbkdf2:sha256:150000$yXqrVzdv$ea6a0caaf36860120a76012a6a7cfca392a0e9e6e271a635cc183ee5ef20436d
#create full image path
basedir = os.path.abspath(os.path.dirname(__file__))
def mkurl(loca,file):
    if loca == "pprofile":
        s = "/static/uploads/profile/"
        return s + file
    if loca == "ppost":
        s = "/static/uploads/post/"
        return s + file
  #  s = "/static/uploads/"
    #return s+file
def popuEX(x,tup):
    res ={}
    res['user_id'] = tup[x].Users.user_id
    res['username'] = tup[x].Users.username
    res['postphoto'] = tup[x].Posts.photo
    res['caption'] = tup[x].Posts.caption
    return res


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

@app.route('/api/users/register', methods = ['POST'])
def register():
    form = registerForm()
    if request.method == 'POST':
        username = form.username.data
        firstname = form.firstname.data
        lastname = form.lastname.data
        email = form.email.data
        location = form.location.data
        biography = form.biography.data
        profile_photo = form.pphoto.data
        password = generate_password_hash(form.password.data)
        #getting and saving photo to folder
        filename = secure_filename(profile_photo.filename)
        profile_photo.save(os.path.join(app.config['PR_UPLOAD_FOLDER'], filename))
        #saving userdata to db
        user = Users(username,firstname,lastname,email,location,biography,mkurl("pprofile",filename),password,datetime.datetime.now())
        db.session.add(user)
        db.session.commit()
        #print(mkurl("pprofile",filename))
        userT = db.session.query(Users).filter_by(email=email).first()
        access_token = jwt.encode({'user_id':userT.user_id, 'email':userT.email},app.config['SECRET_KEY'])
        userD = {"user_id":userT.user_id,"email":userT.email}
        return make_response({"token":access_token.decode('UTF-8'), "udetails":userD})
    return make_response({"message":"Invalid Request"})

@app.route('/api/auth/login', methods = ['POST'])
def login():
    user = None
    req = request.get_json()
    if req['email']:
        user = db.session.query(Users).filter_by(email=req['email']).first()
    password = check_password_hash(user.password,req['password'])
    if password:
        access_token = jwt.encode({'user_id':user.user_id, 'email':user.email},app.config['SECRET_KEY'])
        userD = {"user_id":user.user_id,"email":user.email}
        return make_response({"token":access_token.decode('UTF-8'), "udetails":userD})
    return make_response({"message":"Invalid Password"})
    


@app.route('/api/auth/logout', methods = ['GET'])
def logout():
    auth = request.headers.get('Authorization')
    verify = jwt.decode(auth.split()[1],app.config['SECRET_KEY'])
    if db.session.query(Users).filter_by(email=verify['email']).first():
        return make_response({"message":"logged out"})
    return make_response({"message":"Error logging out"})

    return jsonify(output)
    #return make_response({"message":"list of user's post"})

@app.route('/api/users/<int:user_idx>/posts', methods = ['POST'])
def get_user_posts(user_idx):
    auth = request.headers.get('Authorization')
    verify = jwt.decode(auth.split()[1],app.config['SECRET_KEY'])
    if db.session.query(Users).filter_by(email=verify['email']).first():
        user = db.session.query(Users).filter_by(user_id=user_idx).first()
        user_posts = db.session.query(Posts).filter_by(user_id=user_idx).all()
        user_postOut = []
        user_profile = []

        for post in user_posts:
            res = {}
            res['user_id'] = post.user_id
            res['caption'] = post.caption
            res['postphoto'] = post.photo
            user_postOut.append(res)

        ures = {}
        ures['firstname'] = user.firstname
        ures['lastname'] = user.lastname
        ures['location'] = user.location
        ures['biography'] = user.biography
        ures['profile_photo'] = user.profile_photo
        ures['joined'] = user.joined_on
        user_profile.append(ures)
        userP ={"profileDetails": user_profile, "userPost":user_postOut}
        if userP != {}:
            return jsonify(userP)
        return make_response({"message":"Error finding data"})

@app.route('/api/users/<int:user_id>/posts/add', methods = ['POST'])
def add_post(user_id):
    form = postForm()
    auth = request.headers.get('Authorization')
    verify = jwt.decode(auth.split()[1],app.config['SECRET_KEY'])
    if db.session.query(Users).filter_by(email=verify['email']).first():
        print(2893)
        caption = form.caption.data
        postphoto = form.postphoto.data
        filename = secure_filename(postphoto.filename)
        postphoto.save(os.path.join(app.config['PST_UPLOAD_FOLDER'], filename))
        post = Posts(verify['user_id'],mkurl("ppost",filename),caption,datetime.datetime.now())
        db.session.add(post)
        db.session.commit()
        print(caption)
        return make_response({"message":"Your post was added"})
    return make_response({"message":"Error while posting"})

@app.route('/api/posts', methods = ['GET'])
def get_all_posts():
    explorePosts = db.session.query(Users,Posts).outerjoin(Posts, Users.user_id == Posts.user_id).all()
    posts = db.session.query(Posts)
    post_out = []
    expost_out = []

    for r in explorePosts:
        if r[1] == None:
            pass
        else:   
            res = {}
            nl = db.session.query(Likes).filter_by(post_id=r.Posts.post_id).count()
            res['post_id'] = r.Posts.post_id
            res['user_id'] = r.Users.user_id
            res['username'] = r.Users.username
            res['userphoto'] = r.Users.profile_photo
            res['caption'] = r.Posts.caption
            res['postphoto'] = r.Posts.photo
            res['posted_on'] = r.Posts.created_on
            res['num_likes'] = nl
            expost_out.append(res)
    return jsonify(expost_out)

@app.route('/api/posts/<int:post_id>/like', methods = ['POST'])
def like_post(post_id):
    req = request.get_json()
    auth = request.headers.get('Authorization')
    verify = jwt.decode(auth.split()[1],app.config['SECRET_KEY'])
    if db.session.query(Users).filter_by(email=verify['email']).first():
        like = Likes(req['user_id'],post_id)
        db.session.add(like)
        db.session.commit()
        print(like)

        return make_response({"message":"liked"})